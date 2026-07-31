/**
 * Проверяет, действительно ли текст поверх фотографии инвертируется.
 *
 * Одного снимка мало: белый текст на тёмном фоне выглядит одинаково и когда смешивание
 * работает, и когда его нет вовсе. Поэтому снимаем ОДИН И ТОТ ЖЕ элемент дважды —
 * над тёмным участком кадра и над светлым. Если смешивание живое, во втором случае
 * текст станет тёмным. Если он остался белым — смешивание не дошло, и виноват
 * контекст наложения.
 *
 * Запуск: node tools/blend-check.mjs [url]
 */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const URL = process.argv[2] ?? 'http://127.0.0.1:4787/'
const OUT = 'tools/shots'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const browser = await chromium.launch({ executablePath: CHROME })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1600)
await mkdir(OUT, { recursive: true })

async function shoot(name, selector, pad = 16) {
  const box = await page.locator(selector).boundingBox()
  if (!box) return console.log(`${name}: элемент не найден`)
  await page.screenshot({
    path: `${OUT}/${name}.png`,
    clip: {
      x: Math.max(0, box.x - pad),
      y: Math.max(0, box.y - pad),
      width: box.width + pad * 2,
      height: box.height + pad * 2,
    },
  })
}

// 1. Подсказка над ТЁМНЫМ участком: подставляем под неё водолазку
await page.evaluate(() => {
  const img = document.querySelector('.hero__photo img')
  img.style.objectPosition = '50% 100%'
})
await page.waitForTimeout(600)
await shoot('blend-on-dark', '.hero__scroll')

// 2. Та же подсказка над СВЕТЛЫМ участком: подставляем фон кадра
await page.evaluate(() => {
  const img = document.querySelector('.hero__photo img')
  img.style.objectPosition = '50% 0%'
  img.style.transform = 'translateY(-38%)'
})
await page.waitForTimeout(600)
await shoot('blend-on-light', '.hero__scroll')

console.log('снято: blend-on-dark.png, blend-on-light.png')
console.log('смешивание живое, если на тёмном текст светлый, а на светлом — тёмный')

await browser.close()
