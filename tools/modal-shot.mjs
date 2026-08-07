/*
 * Снимки попапа записи: открытый с первого экрана, десктоп и телефон.
 * Запуск: node tools/modal-shot.mjs [url]
 */
import { chromium } from 'playwright-core'

const URL = process.argv[2] ?? 'http://localhost:4787/'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const browser = await chromium.launch({ executablePath: CHROME })

for (const vp of [{ n: 'desktop', w: 1600, h: 1000 }, { n: 'mobile', w: 390, h: 844 }]) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1200)
  await page.locator('.hero__actions button').first().click()
  await page.waitForTimeout(700)
  await page.screenshot({ path: `tools/shots-brand/modal-${vp.n}.png` })
  await page.close()
}

await browser.close()
console.log('ok')
