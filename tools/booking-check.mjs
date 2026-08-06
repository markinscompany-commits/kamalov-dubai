/*
 * Проверка формы заявки [11] (подача «Анкета») и страницы политики:
 * пустая отправка → ошибки; заполненная → подтверждение; /privacy открывается.
 * Запуск: node tools/booking-check.mjs [url]
 */
import { chromium } from 'playwright-core'

const URL = process.argv[2] ?? 'http://localhost:4787/'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const browser = await chromium.launch({ executablePath: CHROME })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })

await page.goto(URL, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1000)

// Пустая отправка → строка ошибок
await page.locator('#booking button[type="submit"]').click()
await page.waitForTimeout(300)
const errLine = await page.locator('#bkb-errors').textContent().catch(() => null)
console.log('Строка ошибок при пустой отправке:', errLine)

// Длинные данные помещаются: поле тянется до конца строки
await page.fill('#bkb-name', 'Александра Константинопольская')
await page.fill('#bkb-phone', '+971 50 123 45 67')
await page.fill('#bkb-email', 'aleksandra.k@example.com')
const nameWidth = await page.locator('#bkb-name').evaluate((el) => el.getBoundingClientRect().width)
console.log('Ширина поля имени, px:', Math.round(nameWidth))

// Согласие + отправка → подтверждение
await page.check('#bkb-consent')
await page.locator('#booking button[type="submit"]').click()
await page.waitForTimeout(1400)
const done = await page.locator('#booking .bkb__done-title').textContent().catch(() => null)
console.log('Подтверждение:', done)

// Ссылка на политику ведёт на страницу, страница отвечает
await page.goto(URL.replace(/\/$/, '') + '/privacy', { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
const ppTitle = await page.locator('h1').textContent().catch(() => null)
console.log('Страница политики, заголовок:', ppTitle)

console.log('Ошибки консоли:', errors.length ? errors : 'нет')
await browser.close()
