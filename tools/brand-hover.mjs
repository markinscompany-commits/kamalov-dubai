/**
 * Снимает состояния наведения в фирменных цветах:
 *  · кнопка записи на чернильной половине первого экрана — заливка уходит в золото;
 *  · кнопка записи в меню (на бумаге) — заливка уходит в фирменный синий;
 *  · пункт меню при наведении.
 *
 * Запуск: node tools/brand-hover.mjs [url]
 */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const URL = process.argv[2] ?? 'http://127.0.0.1:4787/'
const OUT = 'tools/shots-brand'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const browser = await chromium.launch({ executablePath: CHROME })
await mkdir(OUT, { recursive: true })

const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1600)

// --- Кнопка на тёмной половине: наведение даёт золото ---
const heroBtn = page.locator('.hero__actions .action--primary')
await heroBtn.hover()
await page.waitForTimeout(400)
console.log('первый экран, заливка при наведении:', await heroBtn.evaluate((el) => getComputedStyle(el).backgroundColor))
await page.screenshot({ path: `${OUT}/hover-hero-primary.png`, clip: { x: 100, y: 700, width: 700, height: 200 } })

// --- Меню: кнопка на бумаге и пункт списка ---
await page.locator('.header__burger').click()
await page.waitForTimeout(700)
const navBtn = page.locator('.nav__actions .action--primary')
await navBtn.hover()
await page.waitForTimeout(400)
console.log('меню, заливка кнопки при наведении:', await navBtn.evaluate((el) => getComputedStyle(el).backgroundColor))
await page.screenshot({ path: `${OUT}/hover-nav-primary.png`, clip: { x: 100, y: 700, width: 700, height: 200 } })

const navLink = page.locator('.nav__link').first()
await navLink.hover()
await page.waitForTimeout(400)
console.log('меню, пункт при наведении:', await navLink.locator('.nav__label').evaluate((el) => getComputedStyle(el).color))
await page.screenshot({ path: `${OUT}/hover-nav-link.png`, clip: { x: 100, y: 260, width: 900, height: 200 } })

// --- Обводка фокуса на светлом и на тёмном ---
await page.keyboard.press('Escape')
await page.waitForTimeout(600)
await page.evaluate(() => document.querySelector('.hero__actions .action--primary').focus())
await page.waitForTimeout(300)
console.log(
  'фокус на тёмной половине:',
  await page.evaluate(() => getComputedStyle(document.querySelector('.hero__actions .action--primary')).outlineColor),
)
await page.screenshot({ path: `${OUT}/focus-hero.png`, clip: { x: 100, y: 700, width: 700, height: 200 } })

await browser.close()
