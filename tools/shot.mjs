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
    /*
      Элемент внутри горизонтальной ленты выходить за экран ИМЕЕТ ПРАВО: он
      прокручивается внутри своего контейнера, а не растягивает страницу.
      Без этой проверки лента документов даёт ложную тревогу на каждом прогоне.
    */
    const inScroller = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const ox = getComputedStyle(p).overflowX
        if (ox === 'auto' || ox === 'scroll') return true
      }
      return false
    }

    const bad = []
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0) continue
      if (inScroller(el)) continue
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

  // умещается ли первый экран, влезли ли кнопки и цел ли кадр портрета
  const fit = await page.evaluate(() => {
    const r = (sel) => document.querySelector(sel)?.getBoundingClientRect() ?? null
    const hero = r('.hero')
    const text = r('.hero__text')
    const actions = r('.hero__actions')
    const box = r('.hero__photo')
    const img = document.querySelector('.hero__photo img')

    // Куда реально лёг кадр внутри своей области при object-fit: contain
    let drawn = null
    if (img && box && img.naturalWidth) {
      const k = Math.min(box.width / img.naturalWidth, box.height / img.naturalHeight)
      const w = img.naturalWidth * k
      const h = img.naturalHeight * k
      drawn = {
        w: Math.round(w),
        h: Math.round(h),
        // остаток области, не закрытый кадром: он заливается цветом фона снимка
        padX: Math.round(box.width - w),
        padY: Math.round(box.height - h),
        // на сколько кадр вылез бы за область — при contain обязан быть 0
        cut: Math.round(Math.max(0, w - box.width) + Math.max(0, h - box.height)),
      }
    }

    return {
      vh: window.innerHeight,
      heroH: hero ? Math.round(hero.height) : null,
      textBottom: text ? Math.round(text.bottom) : null,
      actionsBottom: actions ? Math.round(actions.bottom) : null,
      heroBottom: hero ? Math.round(hero.bottom) : null,
      drawn,
    }
  })

  console.log(`\n=== ${vp.name} (${vp.width}×${vp.height}) ===`)
  console.log('scrollWidth: doc', overflow.docScrollWidth, '/ body', overflow.bodyScrollWidth)
  if (overflow.bad.length === 0) console.log('переполнения нет')
  for (const b of overflow.bad) {
    console.log(`  ${b.tag}.${b.cls} — left ${b.left}, right ${b.right}, width ${b.width}`)
  }
  console.log(
    `первый экран: высота ${fit.heroH} при окне ${fit.vh}; ` +
      `низ кнопок ${fit.actionsBottom} / низ блока ${fit.heroBottom} — ` +
      `${fit.actionsBottom <= fit.heroBottom + 1 && fit.actionsBottom <= fit.vh + 1 ? 'кнопки целы' : '⚠️ КНОПКИ ОБРЕЗАНЫ'}`,
  )
  if (fit.drawn) {
    console.log(
      `портрет: кадр ${fit.drawn.w}×${fit.drawn.h}, поля ${fit.drawn.padX}×${fit.drawn.padY} — ` +
        `${fit.drawn.cut === 0 ? 'обрезки нет' : '⚠️ ОБРЕЗАН на ' + fit.drawn.cut}`,
    )
  }

  await page.close()
}

await browser.close()
