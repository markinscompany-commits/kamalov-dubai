/**
 * Проверка блока операций: ошибки консоли, переполнение по ширине,
 * переключение состояний рисунка при прокрутке (вариант А).
 */
import { chromium } from 'playwright-core'

const URL = 'http://127.0.0.1:4787/'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const browser = await chromium.launch({ executablePath: CHROME })

for (const vp of [
  { name: 'desktop', width: 1600, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') errors.push(`${msg.type()}: ${msg.text()}`)
  })
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))

  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1500)

  // Переполнение по ширине
  const over = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth
    const bad = []
    for (const el of document.querySelectorAll('#surgery *')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0) continue
      if (r.right > docW + 1 || r.left < -1) {
        bad.push(`${el.tagName}.${el.className?.toString().slice(0, 40)} → ${Math.round(r.left)}..${Math.round(r.right)} (окно ${docW})`)
      }
    }
    return { docW, scrollW: document.documentElement.scrollWidth, bad: bad.slice(0, 12) }
  })

  // Высоты блоков
  const sizes = await page.evaluate(() =>
    ['surgery'].map((id) => {
      const el = document.getElementById(id)
      return { id, height: el ? Math.round(el.getBoundingClientRect().height) : null }
    }),
  )

  // Вариант А: прокручиваем через блок и смотрим, какое состояние на рисунке
  const states = []
  const box = await page.evaluate(() => {
    const el = document.getElementById('surgery')
    return { top: window.scrollY + el.getBoundingClientRect().top, height: el.getBoundingClientRect().height }
  })
  for (let f = 0.1; f < 1; f += 0.15) {
    await page.evaluate((y) => window.scrollTo(0, y), box.top + box.height * f)
    await page.waitForTimeout(700)
    const s = await page.evaluate(() => {
      const el = document.querySelector('#surgery .ns')
      if (!el) return 'нет рисунка (телефон - свой у каждого прохода)'
      return [...el.classList].find((c) => c.startsWith('ns--')) ?? '?'
    })
    states.push(`${Math.round(f * 100)}% → ${s}`)
  }

  console.log(`\n=== ${vp.name} (${vp.width}×${vp.height}) ===`)
  console.log('ширина документа:', over.docW, '| прокрутка вширь:', over.scrollW)
  console.log('вылезает за край:', over.bad.length ? over.bad : 'ничего')
  console.log('высоты:', sizes.map((s) => `${s.id}: ${s.height}px`).join(' | '))
  console.log('состояния рисунка (вариант А):', states.join(' · '))
  console.log('консоль:', errors.length ? errors.slice(0, 8) : 'чисто')
  await page.close()
}

await browser.close()
