/**
 * Снимает блок так, как его реально видит человек: прокручивается через блок
 * шагами в 80% экрана, после каждого шага ждёт анимации появления и снимает
 * видимую область.
 *
 * Нужен для длинных блоков: section-shot снимает элемент целиком, но всё, что
 * ни разу не побывало на экране, стоит с несработавшими анимациями (opacity 0)
 * и на снимке выглядит пустотой.
 *
 * Запуск: node tools/scroll-shot.mjs [url] [#id] [viewport]
 *   viewport: desktop | mobile (по умолчанию mobile)
 */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const args = process.argv.slice(2)
const URL = args[0] ?? 'http://127.0.0.1:4787/'
const ID = args[1] ?? 'clinic'
const VP = args[2] === 'desktop' ? { name: 'desktop', width: 1600, height: 1000 } : { name: 'mobile', width: 390, height: 844 }
const OUT = 'tools/shots-brand'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const browser = await chromium.launch({ executablePath: CHROME })
await mkdir(OUT, { recursive: true })

const page = await browser.newPage({ viewport: { width: VP.width, height: VP.height } })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1200)

const box = await page.evaluate((sel) => {
  const el = document.getElementById(sel)
  const r = el.getBoundingClientRect()
  return { top: window.scrollY + r.top, height: r.height }
}, ID)

const step = Math.round(VP.height * 0.8)
let offset = 0
let i = 0
while (offset < box.height) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), box.top + offset - 60)
  await page.waitForTimeout(2200)
  i += 1
  await page.screenshot({ path: `${OUT}/scroll-${ID}-${VP.name}-${i}.png` })
  offset += step
}

console.log(`${i} кадров, блок ${Math.round(box.height)}px`)
await browser.close()
