/**
 * Снимает отдельный блок страницы целиком, с уже прочерченной разметкой.
 *
 * Запуск: node tools/section-shot.mjs [url] [#id ...]
 */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const args = process.argv.slice(2)
const URL = args[0] ?? 'http://127.0.0.1:4787/'
const IDS = args.length > 1 ? args.slice(1) : ['doctor', 'rhinoplasty', 'septoplasty']
const OUT = 'tools/shots-brand'
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

  for (const id of IDS) {
    // Прокручиваем к блоку и даём разметке прочертиться, а караоке - залиться
    await page.evaluate((sel) => {
      const el = document.getElementById(sel)
      window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 60, behavior: 'instant' })
    }, id)
    await page.waitForTimeout(1200)
    await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'instant' }))
    await page.waitForTimeout(1400)
    await page.evaluate((sel) => {
      const el = document.getElementById(sel)
      window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 60, behavior: 'instant' })
    }, id)
    await page.waitForTimeout(900)

    const el = await page.$(`#${id}`)
    await el.screenshot({ path: `${OUT}/section-${id}-${vp.name}.png` })
  }

  await page.close()
}

await browser.close()
