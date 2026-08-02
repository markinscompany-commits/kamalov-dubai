/**
 * Кадр венка в увеличении: видно, попадает ли знак в проём ветви.
 *
 * Запуск: node tools/laurel-check.mjs [url]
 */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const CHROME = ['C:', 'Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'].join(String.fromCharCode(92))
const URL = process.argv[2] ?? 'http://127.0.0.1:4787/'
const OUT = 'tools/shots-brand'

const browser = await chromium.launch({ executablePath: CHROME })
await mkdir(OUT, { recursive: true })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 3 })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1500)
await page.evaluate(() => {
  const el = document.querySelector('.doctor__stats')
  window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 200, behavior: 'instant' })
})
await page.waitForTimeout(700)

const box = await page.evaluate(() => {
  const row = document.querySelector('.doctor__stats-row')
  const r = row.getBoundingClientRect()
  return { x: r.x, y: r.y, width: r.width, height: r.height }
})
await page.screenshot({ path: `${OUT}/laurels-zoom.png`, clip: box })
await browser.close()
