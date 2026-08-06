/* Проверка формы заявки: пустая отправка → ошибки; заполненная → подтверждение */
import { chromium } from 'playwright-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const browser = await chromium.launch({ executablePath: CHROME })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })

await page.goto('http://localhost:4787/', { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1000)

// --- Вариант А: пустая отправка ---
await page.locator('#booking button[type="submit"]').click()
await page.waitForTimeout(300)
const errCount = await page.locator('#booking .bka__error').count()
console.log('А: ошибок при пустой отправке:', errCount)

// --- Вариант А: заполняем и отправляем ---
await page.fill('#bka-name', 'Проверка Проверкина')
await page.fill('#bka-phone', '+971 50 123 45 67')
await page.fill('#bka-email', 'test@example.com')
await page.check('#bka-consent')
await page.locator('#booking button[type="submit"]').click()
await page.waitForTimeout(1400)
const doneA = await page.locator('#booking .bka__done-title').textContent().catch(() => null)
console.log('А: подтверждение:', doneA)

// --- Вариант Б: пустая отправка ---
await page.locator('#booking-b button[type="submit"]').click()
await page.waitForTimeout(300)
const errB = await page.locator('#bkb-errors').textContent().catch(() => null)
console.log('Б: строка ошибок:', errB)

// --- Вариант Б: заполняем и отправляем ---
await page.fill('#booking-b input[name="name"]', 'Проверка')
await page.fill('#booking-b input[name="phone"]', '+971501234567')
await page.check('#bkb-consent')
await page.locator('#booking-b button[type="submit"]').click()
await page.waitForTimeout(1400)
const doneB = await page.locator('#booking-b .bkb__done-title').textContent().catch(() => null)
console.log('Б: подтверждение:', doneB)

console.log('Ошибки консоли:', errors.length ? errors : 'нет')
await browser.close()
