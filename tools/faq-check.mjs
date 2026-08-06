/*
 * Проверка аккордеона [10]: раскрытие/закрытие ответа, aria-expanded,
 * чистая консоль. Запуск: node tools/faq-check.mjs [url]
 */
import { chromium } from 'playwright-core'

const URL = process.argv[2] ?? 'http://localhost:4787/'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const browser = await chromium.launch({ executablePath: CHROME })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })

await page.goto(URL + '#faq', { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)

await page.locator('#faq .faq__q').first().click()
await page.waitForTimeout(500)
const answer = await page.locator('#faq .faq__a-text').first().textContent().catch(() => null)
console.log('Ответ раскрылся:', answer ? answer.slice(0, 60) + '...' : 'НЕТ')
console.log('aria-expanded:', await page.locator('#faq .faq__q').first().getAttribute('aria-expanded'))

await page.locator('#faq .faq__q').first().click()
await page.waitForTimeout(400)
console.log('Ответов в HTML после закрытия:', await page.locator('#faq .faq__a-text').count())

console.log('Ошибки консоли:', errors.length ? errors : 'нет')
await browser.close()
