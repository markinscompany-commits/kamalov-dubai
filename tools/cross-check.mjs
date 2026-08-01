/**
 * Проверка узла разметки: стоит ли крестик ровно в точке пересечения и остаётся ли
 * разметка на месте после ухода блока с экрана.
 *
 * Снимает увеличенный кадр вокруг точки (масштаб 4×) — на обычном скриншоте
 * смещение в полпикселя не видно.
 *
 * Запуск: node tools/cross-check.mjs [url]
 */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const URL = process.argv[2] ?? 'http://127.0.0.1:4787/'
const OUT = 'tools/shots-brand'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const browser = await chromium.launch({ executablePath: CHROME })
await mkdir(OUT, { recursive: true })

for (const vp of [
  { name: 'desktop', width: 1600, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 4,
  })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1600)

  // Долистываем до блока «Подход», ждём, пока разметка прочертится
  // Ставим точку примерно в середину экрана, чтобы в кадр не попала черта под шапкой
  await page.evaluate(() => {
    const r = document.querySelector('.manifest').getBoundingClientRect()
    window.scrollTo({ top: window.scrollY + r.top - window.innerHeight * 0.35, behavior: 'instant' })
  })
  await page.waitForTimeout(2200)

  // Где реально лежат линии и узел
  const geom = await page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { x: r.x, y: r.y, w: r.width, h: r.height, cx: r.x + r.width / 2, cy: r.y + r.height / 2 }
    }
    return {
      node: box('.cross__node'),
      up: box('.cross__ray--up'),
      down: box('.cross__ray--down'),
      start: box('.cross__ray--start'),
      end: box('.cross__ray--end'),
      nodeOpacity: getComputedStyle(document.querySelector('.cross__node')).opacity,
    }
  })

  const round = (n) => Math.round(n * 100) / 100
  console.log(`\n=== ${vp.name} ===`)
  console.log('узел виден (прозрачность):', geom.nodeOpacity)
  console.log('центр узла:', round(geom.node.cx), round(geom.node.cy))
  console.log('вертикаль (середина по X):', round(geom.up.x + geom.up.w / 2), '/', round(geom.down.x + geom.down.w / 2))
  console.log('горизонталь (середина по Y):', round(geom.start.y + geom.start.h / 2), '/', round(geom.end.y + geom.end.h / 2))
  console.log(
    'зазор узел↔луч, px:',
    'сверху', round(geom.node.y - (geom.up.y + geom.up.h)),
    'снизу', round(geom.down.y - (geom.node.y + geom.node.h)),
    'слева', round(geom.node.x - (geom.start.x + geom.start.w)),
    'справа', round(geom.end.x - (geom.node.x + geom.node.w)),
  )

  // Увеличенный кадр вокруг точки
  const pad = 22
  await page.screenshot({
    path: `${OUT}/cross-node-${vp.name}.png`,
    clip: { x: geom.node.cx - pad, y: geom.node.cy - pad, width: pad * 2, height: pad * 2 },
  })

  // Ушли далеко вниз и вернулись: разметка должна остаться нарисованной
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(700)
  await page.evaluate(() => document.querySelector('.manifest').scrollIntoView())
  await page.waitForTimeout(300)
  const after = await page.evaluate(() => ({
    класс: document.querySelector('.cross').classList.contains('cross--on'),
    прозрачностьУзла: getComputedStyle(document.querySelector('.cross__node')).opacity,
    обрезкаЛуча: getComputedStyle(document.querySelector('.cross__ray--down')).clipPath,
  }))
  console.log('после возврата:', JSON.stringify(after))

  await page.close()
}

await browser.close()
