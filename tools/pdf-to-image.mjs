/**
 * Первая страница PDF → снимок для сайта.
 *
 * Понадобилось для лицензии DHA: клиника присылает её в PDF, а на странице
 * документ показывается картинкой. Чтобы при следующей лицензии не собирать
 * это руками - скрипт.
 *
 * Рендерит системный Chrome (у него свой просмотрщик PDF), поля просмотрщика
 * потом обрезаются автоматически: лист белый на тёмном фоне, по этому и ищем.
 * Пробовали через pdfjs + node-canvas - спотыкается на встроенных картинках
 * (в лицензии это QR-код и гербы), поэтому не он.
 *
 * Запуск: node tools/pdf-to-image.mjs <файл.pdf> <куда.webp> [ширина]
 */
import { chromium } from 'playwright-core'
import { unlink } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import sharp from 'sharp'

const SRC = process.argv[2]
const OUT = process.argv[3]
const WIDTH = Number(process.argv[4] ?? 1400)
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const TMP = 'tools/.pdf-raw.png'

const url = `${pathToFileURL(resolve(SRC)).href}#toolbar=0&navpanes=0&view=Fit&page=1`

const browser = await chromium.launch({ executablePath: CHROME, args: ['--headless=new'] })
const page = await browser.newPage({ viewport: { width: 1100, height: 1500 }, deviceScaleFactor: 2 })
await page.goto(url, { waitUntil: 'load' })
// Просмотрщик рисует страницу не сразу - ждём, замерять тут нечего
await page.waitForTimeout(4500)
await page.screenshot({ path: TMP })
await browser.close()

// Ищем границы листа: всё, что светлее 200 по серому, - это он
const { data, info } = await sharp(TMP).greyscale().raw().toBuffer({ resolveWithObject: true })
let top = info.height
let left = info.width
let right = 0
let bottom = 0
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (data[y * info.width + x] > 200) {
      if (y < top) top = y
      if (y > bottom) bottom = y
      if (x < left) left = x
      if (x > right) right = x
    }
  }
}

await sharp(TMP)
  .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
  .resize({ width: WIDTH, withoutEnlargement: true })
  .webp({ quality: 88, effort: 6 })
  .toFile(OUT)
await unlink(TMP)

const meta = await sharp(OUT).metadata()
console.log(`${OUT}: ${meta.width}x${meta.height}, ${Math.round(meta.size / 1024)} KB`)
