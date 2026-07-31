/**
 * Проверяет переключение языка и меню: ловит ошибки в консоли, снимает состояния.
 *
 * Запуск:  node tools/lang-check.mjs [url] [outDir]
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
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (e) => errors.push(String(e)))

  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1800)

  console.log(`\n=== ${vp.name} (${vp.width}×${vp.height}) ===`)

  // --- язык ---
  const before = await page.textContent('.hero__title')
  const langBtn = page.locator('button', { hasText: /^En$/ }).first()
  const hasSwitcher = (await langBtn.count()) > 0

  if (hasSwitcher && (await langBtn.isVisible())) {
    await langBtn.click()
    await page.waitForTimeout(120)
    await page.screenshot({ path: `${OUT}/${vp.name}-lang-fade.png` })
    await page.waitForTimeout(900)
    const after = await page.textContent('.hero__title')
    const lang = await page.getAttribute('html', 'lang')
    console.log(`язык: «${before?.trim()}» → «${after?.trim()}», html lang = ${lang}`)
    await page.screenshot({ path: `${OUT}/${vp.name}-en.png` })
    console.log(`заголовок вкладки: ${await page.title()}`)
    // назад на русский
    await page.locator('button', { hasText: /^Ru$/ }).first().click()
    await page.waitForTimeout(900)
  } else {
    console.log('переключатель в шапке скрыт — проверяем через меню')
  }

  // --- меню ---
  await page.locator('.header__burger').click()
  await page.waitForTimeout(260)
  await page.screenshot({ path: `${OUT}/${vp.name}-menu-mid.png` })
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${OUT}/${vp.name}-menu.png` })

  const menuLang = page.locator('.nav__lang-btn', { hasText: /^En$/ })
  if (await menuLang.count()) {
    await menuLang.first().click()
    await page.waitForTimeout(1000)
    const after = await page.textContent('.hero__title')
    console.log(`язык из меню: «${after?.trim()}», меню закрылось: ${!(await page.locator('.nav').count())}`)
    await page.locator('.header__burger').click()
    await page.waitForTimeout(700)
    await page.locator('.nav__lang-btn', { hasText: /^Ru$/ }).first().click()
    await page.waitForTimeout(900)
  }

  console.log(errors.length ? `⚠️ ошибки в консоли:\n  ${errors.join('\n  ')}` : 'ошибок в консоли нет')
  await page.close()
}

await browser.close()
