/*
 * Проход по ВСЕЙ странице сверху вниз шагами в 80% экрана - для полировки:
 * каждый шаг ждёт анимации появления и снимает видимую область.
 * Запуск: node tools/page-walk.mjs [url] [viewport] [prefix]
 */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const URL = process.argv[2] ?? 'http://localhost:4787/'
const VP = process.argv[3] === 'desktop' ? { name: 'desktop', width: 1600, height: 1000 } : { name: 'mobile', width: 390, height: 844 }
const PREFIX = process.argv[4] ?? 'walk'
const OUT = 'tools/shots-brand'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const browser = await chromium.launch({ executablePath: CHROME })
await mkdir(OUT, { recursive: true })
const page = await browser.newPage({ viewport: { width: VP.width, height: VP.height } })
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })

await page.goto(URL, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1200)

const total = await page.evaluate(() => document.documentElement.scrollHeight)
const step = Math.round(VP.height * 0.8)
let i = 0
for (let y = 0; y < total; y += step) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
  await page.waitForTimeout(1600)
  i += 1
  await page.screenshot({ path: `${OUT}/${PREFIX}-${VP.name}-${String(i).padStart(2, '0')}.png` })
}

console.log(`${i} кадров, страница ${total}px, ошибок консоли: ${errors.length ? errors.join(' | ') : 'нет'}`)
await browser.close()
