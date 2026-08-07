/*
 * Проверка записи на консультацию:
 * 1) форма блока [11]: пустая отправка → ошибки; заполненная → подтверждение;
 * 2) попап с кнопки в первом экране: открытие, отправка, источник в dataLayer,
 *    закрытие по Esc;
 * 3) /privacy открывается.
 * Запуск: node tools/booking-check.mjs [url]
 */
import { chromium } from 'playwright-core'

const URL = process.argv[2] ?? 'http://localhost:4787/'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const browser = await chromium.launch({ executablePath: CHROME })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })

await page.goto(URL, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1000)

// --- Блок [11]: пустая отправка → ошибки ---
await page.locator('#booking button[type="submit"]').click()
await page.waitForTimeout(300)
console.log('Блок: ошибки при пустой отправке:', await page.locator('#booking .bkf__error').first().textContent().catch(() => 'НЕТ'))

// --- Блок [11]: заполненная → подтверждение, источник booking-section ---
await page.fill('#booking input[name="name"]', 'Александра Константинопольская')
await page.fill('#booking input[name="phone"]', '+971 50 123 45 67')
await page.check('#booking input[type="checkbox"]')
await page.locator('#booking button[type="submit"]').click()
await page.waitForTimeout(1400)
console.log('Блок: подтверждение:', await page.locator('#booking .bkf__done-title').textContent().catch(() => 'НЕТ'))

// --- Попап из первого экрана ---
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
await page.waitForTimeout(400)
await page.locator('.hero__actions button[type="submit"], .hero__actions button').first().click()
await page.waitForTimeout(600)
const dialogVisible = await page.locator('[role="dialog"]').isVisible().catch(() => false)
console.log('Попап открылся:', dialogVisible)

await page.fill('[role="dialog"] input[name="name"]', 'Проверка')
await page.fill('[role="dialog"] input[name="phone"]', '+971501234567')
await page.check('[role="dialog"] input[type="checkbox"]')
await page.locator('[role="dialog"] button[type="submit"]').click()
await page.waitForTimeout(1400)
console.log('Попап: подтверждение:', await page.locator('[role="dialog"] .bkf__done-title').textContent().catch(() => 'НЕТ'))

const dl = await page.evaluate(() => (window.dataLayer || []).filter((e) => e.event === 'request_sent'))
console.log('dataLayer события:', JSON.stringify(dl))

await page.keyboard.press('Escape')
await page.waitForTimeout(400)
console.log('Закрылся по Esc:', !(await page.locator('[role="dialog"]').isVisible().catch(() => false)))

// --- Политика ---
await page.goto(URL.replace(/\/$/, '') + '/privacy', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
console.log('Страница политики:', await page.locator('h1').textContent().catch(() => 'НЕТ'))

console.log('Ошибки консоли:', errors.length ? errors : 'нет')
await browser.close()
