/**
 * Замеряет, совпадают ли центры лучей разметки и крестика на пересечении.
 * Запуск:  node tools/node-align.mjs [url]
 */
import { chromium } from 'playwright-core'

const URL = process.argv[2] ?? 'http://127.0.0.1:4787/'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const browser = await chromium.launch({ executablePath: CHROME })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForTimeout(2600)

const data = await page.evaluate(() => {
  const box = (sel) => {
    const el = document.querySelector(sel)
    if (!el) return null
    const r = el.getBoundingClientRect()
    return {
      cx: +(r.left + r.width / 2).toFixed(2),
      cy: +(r.top + r.height / 2).toFixed(2),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
    }
  }
  return {
    node: box('.cross__node'),
    rayEnd: box('.cross__ray--end'),
    rayDown: box('.cross__ray--down'),
  }
})

console.log('крестик       :', JSON.stringify(data.node))
console.log('луч вправо    :', JSON.stringify(data.rayEnd), `толщина ${data.rayEnd?.h}`)
console.log('луч вниз      :', JSON.stringify(data.rayDown), `толщина ${data.rayDown?.w}`)
console.log(
  'расхождение   :',
  `по вертикали ${(data.node.cy - data.rayEnd.cy).toFixed(2)} px,`,
  `по горизонтали ${(data.node.cx - data.rayDown.cx).toFixed(2)} px`,
)

await browser.close()
