/**
 * Снимает шапку в состоянии «после прокрутки» — проверить её подложку.
 * Запуск:  node tools/scrolled-shot.mjs [url] [outDir]
 */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const URL = process.argv[2] ?? 'http://127.0.0.1:4787/'
const OUT = process.argv[3] ?? 'tools/shots'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const browser = await chromium.launch({ executablePath: CHROME })
await mkdir(OUT, { recursive: true })

for (const vp of [
  { name: 'desktop', width: 1600, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1500)
  await page.evaluate(() => {
    const hero = document.querySelector('.hero')
    window.scrollTo(0, (hero?.offsetHeight ?? 800) + 60)
  })
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${OUT}/${vp.name}-scrolled.png` })

  const colors = await page.evaluate(() => {
    const bg = getComputedStyle(document.querySelector('.header__bg')).backgroundColor
    const second = getComputedStyle(document.querySelector('.manifest')).backgroundColor
    return { header: bg, second }
  })
  console.log(`${vp.name}: подложка шапки ${colors.header} / фон второго блока ${colors.second}`)
  await page.close()
}

await browser.close()
