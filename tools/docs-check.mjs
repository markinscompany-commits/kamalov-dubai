import { chromium } from 'playwright-core'
const CHROME = ['C:', 'Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'].join(String.fromCharCode(92))
const b = await chromium.launch({ executablePath: CHROME })
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
await p.goto('http://127.0.0.1:4787/', { waitUntil: 'networkidle' })
await p.evaluate(() => document.fonts.ready)
await p.waitForTimeout(1500)
await p.evaluate(() => {
  const el = document.querySelector('.docs')
  window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 100, behavior: 'instant' })
})
await p.waitForTimeout(700)
const state = async (подпись) => {
  const s = await p.evaluate(() => ({
    слева: document.querySelector('.docs__fade--start').classList.contains('is-on'),
    справа: document.querySelector('.docs__fade--end').classList.contains('is-on'),
    прокрутка: Math.round(document.querySelector('.docs__strip').scrollLeft),
  }))
  console.log(подпись, JSON.stringify(s))
}
await state('в начале ленты:')
await p.evaluate(() => { const el = document.querySelector('.docs__strip'); el.scrollLeft = 150 })
await p.waitForTimeout(600)
await state('прокрутили немного:')
await p.evaluate(() => { const el = document.querySelector('.docs__strip'); el.scrollLeft = el.scrollWidth })
await p.waitForTimeout(600)
await state('долистали до конца:')
await p.screenshot({ path: 'tools/shots-brand/docs-fade-end.png', clip: await p.evaluate(() => { const r = document.querySelector('.docs').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height } }) })
await p.evaluate(() => { const el = document.querySelector('.docs__strip'); el.scrollLeft = 150 })
await p.waitForTimeout(600)
await p.screenshot({ path: 'tools/shots-brand/docs-fade-both.png', clip: await p.evaluate(() => { const r = document.querySelector('.docs').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height } }) })
await b.close()
