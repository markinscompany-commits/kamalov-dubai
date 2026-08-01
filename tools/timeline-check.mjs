import { chromium } from 'playwright-core'
const CHROME = ['C:', 'Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'].join(String.fromCharCode(92))
const browser = await chromium.launch({ executablePath: CHROME })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.goto(process.argv[2] ?? 'http://127.0.0.1:4787/', { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1400)
await page.evaluate(() => document.getElementById('doctor').scrollIntoView())
await page.waitForTimeout(900)

const before = await page.evaluate(() => ({
  строк: document.querySelectorAll('.tl__row').length,
  кнопка: document.querySelector('.tl__toggle-label').textContent.trim(),
}))
console.log('до раскрытия:', JSON.stringify(before))

await page.click('.tl__toggle')
await page.waitForTimeout(900)
const after = await page.evaluate(() => ({
  строк: document.querySelectorAll('.tl__row').length,
  кнопка: document.querySelector('.tl__toggle-label').textContent.trim(),
  раскрыто: document.querySelector('.tl__toggle').getAttribute('aria-expanded'),
}))
console.log('после раскрытия:', JSON.stringify(after))
await page.screenshot({ path: 'tools/shots-brand/timeline-open.png', clip: { x: 400, y: 0, width: 900, height: 1000 } })

await page.click('.tl__toggle')
await page.waitForTimeout(700)
const back = await page.evaluate(() => document.querySelectorAll('.tl__row').length)
console.log('после сворачивания строк:', back)
await browser.close()
