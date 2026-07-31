/**
 * Снимает скриншоты страницы и заодно ищет элементы, которые вылезают за ширину экрана.
 *
 * Запуск:  node tools/shot.mjs [url] [outDir]
 * Нужен установленный Chrome — браузер не скачиваем, берём системный.
 */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const URL = process.argv[2] ?? 'http://127.0.0.1:4787/'
const OUT = process.argv[3] ?? 'tools/shots'

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
]

const VIEWPORTS = [
  { name: 'desktop', width: 1600, height: 1000 },
  { name: 'laptop', width: 1280, height: 800 },
  // Низкий и широкий: тут фотографии достаётся больше всего вертикальной подрезки
  { name: 'wide-short', width: 1920, height: 720 },
  { name: 'mobile', width: 390, height: 844 },
  // Высокий и узкий, и наоборот маленький — крайние случаи телефонов
  { name: 'mobile-tall', width: 430, height: 932 },
  { name: 'mobile-small', width: 360, height: 640 },
]

const browser = await chromium.launch({ executablePath: CHROME[0], channel: undefined })

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1600) // дать доиграть появлению

  await mkdir(OUT, { recursive: true })
  await page.screenshot({ path: `${OUT}/${vp.name}.png` })
  await page.screenshot({ path: `${OUT}/${vp.name}-full.png`, fullPage: true })

  // кто шире экрана
  const overflow = await page.evaluate((limit) => {
    const bad = []
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0) continue
      if (r.right > limit + 1 || r.left < -1) {
        bad.push({
          tag: el.tagName.toLowerCase(),
          cls: el.className?.baseVal ?? String(el.className ?? ''),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
        })
      }
    }
    return {
      docScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      bad: bad.slice(0, 14),
    }
  }, vp.width)

  // умещается ли первый экран и не срезана ли голова
  const fit = await page.evaluate(() => {
    const text = document.querySelector('.hero__text')?.getBoundingClientRect()
    const photo = document.querySelector('.hero__photo')?.getBoundingClientRect()
    return {
      textBottom: text ? Math.round(text.bottom) : null,
      vh: window.innerHeight,
      photoTop: photo ? Math.round(photo.top) : null,
      photoBottom: photo ? Math.round(photo.bottom) : null,
    }
  })

  console.log(`\n=== ${vp.name} (${vp.width}×${vp.height}) ===`)
  console.log('scrollWidth: doc', overflow.docScrollWidth, '/ body', overflow.bodyScrollWidth)
  if (overflow.bad.length === 0) console.log('переполнения нет')
  for (const b of overflow.bad) {
    console.log(`  ${b.tag}.${b.cls} — left ${b.left}, right ${b.right}, width ${b.width}`)
  }
  console.log(
    `первый экран: низ текста ${fit.textBottom} из ${fit.vh} — ` +
      `${fit.textBottom <= fit.vh + 1 ? 'уместился' : '⚠️ НЕ УМЕСТИЛСЯ'}`,
  )

  await page.close()
}

await browser.close()
