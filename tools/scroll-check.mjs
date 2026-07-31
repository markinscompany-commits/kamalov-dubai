/**
 * Проверка того, что видно только в движении: состояния шапки, меню, заливка текста,
 * наведение на кнопку.
 *
 * Запуск: node tools/scroll-check.mjs [url]
 */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const URL = process.argv[2] ?? 'http://127.0.0.1:4787/'
const OUT = 'tools/shots'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const browser = await chromium.launch({ executablePath: CHROME })
await mkdir(OUT, { recursive: true })

// ============ Десктоп ============
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1600)

// --- Шапка вверху страницы ---
await page.screenshot({ path: `${OUT}/header-top.png`, clip: { x: 0, y: 0, width: 1600, height: 110 } })

// --- Шапка после прокрутки ---
await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }))
await page.waitForTimeout(900)
await page.screenshot({
  path: `${OUT}/header-scrolled.png`,
  clip: { x: 0, y: 0, width: 1600, height: 110 },
})

const headerState = await page.evaluate(() => {
  const h = document.querySelector('.header')
  const actions = getComputedStyle(document.querySelector('.header__actions'))
  const nav = getComputedStyle(document.querySelector('.header__nav'))
  return {
    scrolledClass: h.classList.contains('header--scrolled'),
    actionsOpacity: actions.opacity,
    navOpacity: nav.opacity,
    headerHeight: Math.round(document.querySelector('.header__inner').getBoundingClientRect().height),
  }
})
console.log('шапка после прокрутки:', JSON.stringify(headerState))

// --- Меню ---
await page.locator('.header__burger').click()
await page.waitForTimeout(900)
await page.screenshot({ path: `${OUT}/menu-open.png` })
const menuLinks = await page.locator('.nav__link').count()
console.log('пунктов в меню:', menuLinks)
await page.keyboard.press('Escape')
await page.waitForTimeout(600)
const menuClosed = (await page.locator('.nav').count()) === 0
console.log('меню закрывается по Esc:', menuClosed)

// --- Караоке ---
const manifest = await page.locator('.manifest').boundingBox()
for (const [i, k] of [0.4, 0.75].entries()) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), manifest.y * k + 300)
  await page.waitForTimeout(900)
  const filled = await page.evaluate(() => document.querySelectorAll('.karaoke__word--on').length)
  const total = await page.evaluate(() => document.querySelectorAll('.karaoke__word').length)
  console.log(`караоке, шаг ${i + 1}: залито ${filled} из ${total}`)
}

// --- Наведение на кнопку в первом экране ---
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
await page.waitForTimeout(500)
const ghost = page.locator('.hero .action--ghost')
const gb = await ghost.boundingBox()
await ghost.hover()
await page.waitForTimeout(700)
await page.screenshot({
  path: `${OUT}/hover-ghost.png`,
  clip: { x: gb.x - 60, y: gb.y - 30, width: 480, height: 120 },
})

// --- Умещается ли первый экран ---
const fits = await page.evaluate(() => {
  const text = document.querySelector('.hero__text').getBoundingClientRect()
  const head = document.querySelector('.header__inner').getBoundingClientRect()
  return {
    высотаОкна: window.innerHeight,
    верхТекста: Math.round(text.top),
    низТекста: Math.round(text.bottom),
    подШапкой: text.top >= head.bottom - 1,
    уместилось: text.bottom <= window.innerHeight + 1,
  }
})
console.log('первый экран:', JSON.stringify(fits))

await page.close()

// ============ Телефон ============
const m = await browser.newPage({ viewport: { width: 390, height: 844 } })
await m.goto(URL, { waitUntil: 'networkidle' })
await m.evaluate(() => document.fonts.ready)
await m.waitForTimeout(1600)
await m.screenshot({ path: `${OUT}/m-top.png` })

const mFits = await m.evaluate(() => {
  const text = document.querySelector('.hero__text').getBoundingClientRect()
  return {
    высотаОкна: window.innerHeight,
    низТекста: Math.round(text.bottom),
    уместилось: text.bottom <= window.innerHeight + 1,
  }
})
console.log('первый экран (телефон):', JSON.stringify(mFits))

await m.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }))
await m.waitForTimeout(900)
await m.screenshot({ path: `${OUT}/m-header-scrolled.png`, clip: { x: 0, y: 0, width: 390, height: 90 } })

await m.locator('.header__burger').click()
await m.waitForTimeout(900)
await m.screenshot({ path: `${OUT}/m-menu.png` })

await m.close()
await browser.close()
