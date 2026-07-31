/**
 * Проверка эффектов, которые видно только при прокрутке:
 * заливка текста «караоке» и наведение на кнопку (уголки → рамка).
 *
 * Запуск: node tools/scroll-check.mjs [url]
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
await mkdir(OUT, { recursive: true })

// --- Караоке: прокручиваем до блока «Подход» тремя шагами ---
const manifest = await page.locator('.manifest').boundingBox()
for (const [i, k] of [0.35, 0.6, 0.95].entries()) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), manifest.y * k + 200)
  await page.waitForTimeout(900)
  const filled = await page.evaluate(
    () => document.querySelectorAll('.karaoke__word--on').length,
  )
  const total = await page.evaluate(() => document.querySelectorAll('.karaoke__word').length)
  console.log(`шаг ${i + 1}: залито ${filled} из ${total} слов`)
  await page.screenshot({ path: `${OUT}/karaoke-${i + 1}.png` })
}

// --- Наведение на кнопку WhatsApp: уголки должны сомкнуться в рамку ---
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
await page.waitForTimeout(400)
const ghost = page.locator('.action--ghost')
await ghost.hover()
await page.waitForTimeout(700)
await page.screenshot({
  path: `${OUT}/hover-ghost.png`,
  clip: { x: 120, y: 690, width: 620, height: 160 },
})
console.log('наведение снято: tools/shots/hover-ghost.png')

// --- Замер кнопки: не вылезает ли подпись за заливку ---
const box = await page.evaluate(() => {
  const btn = document.querySelector('.action--primary')
  const label = btn.querySelector('.action__label')
  const b = btn.getBoundingClientRect()
  const l = label.getBoundingClientRect()
  return {
    btnWidth: Math.round(b.width),
    labelWidth: Math.round(l.width),
    padLeft: Math.round(l.left - b.left),
    padRight: Math.round(b.right - l.right),
  }
})
console.log('кнопка:', JSON.stringify(box))

await browser.close()
