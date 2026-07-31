/**
 * Снимает заставку: при загрузке и при смене языка.
 * Запуск:  node tools/preloader-shot.mjs [url] [outDir]
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
  await page.goto(URL)
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${OUT}/${vp.name}-preloader.png` })

  const gone = await page
    .waitForSelector('.pre', { state: 'detached', timeout: 8000 })
    .then(() => true)
    .catch(() => false)
  console.log(`${vp.name}: заставка ушла — ${gone}`)

  // и при смене языка
  await page.waitForTimeout(500)
  const btn = page.locator('button', { hasText: /^En$/ }).first()
  if (await btn.isVisible()) {
    await btn.click()
    await page.waitForTimeout(600)
    const onScreen = await page.locator('.pre').count()
    await page.screenshot({ path: `${OUT}/${vp.name}-preloader-lang.png` })
    console.log(`${vp.name}: при смене языка заставка показана — ${onScreen > 0}`)
    await page.waitForTimeout(1500)
    console.log(`${vp.name}: после смены заставки нет — ${(await page.locator('.pre').count()) === 0}`)
  }

  await page.close()
}

await browser.close()
