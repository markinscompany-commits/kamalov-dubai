/**
 * Ищет подёргивания при прокрутке — замером, а не на глаз.
 *
 * Как работает: телефонный размер экрана, процессор замедлен вчетверо (примерно как
 * средний телефон против ноутбука), страница прокручивается небольшими шагами, и на
 * каждом кадре пишется его длительность. Ровная прокрутка — это кадры по 16 мс.
 * Всё, что длиннее 32 мс, человек видит как рывок.
 *
 * Дальше тот же прогон повторяется с выключенными по одному подозреваемыми — так
 * видно, кто именно из них стоит денег.
 *
 * Запуск:  node tools/scroll-jank.mjs [url]
 */
import { chromium } from 'playwright-core'

const URL = process.argv[2] ?? 'http://127.0.0.1:4787/'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

/** Подозреваемые: что выключаем и как */
const VARIANTS = [
  { name: 'как есть', css: '' },
  { name: 'без шапки', css: '.header { display: none !important }' },
  { name: 'без караоке-текста', css: '.karaoke { display: none !important }' },
  { name: 'без портрета', css: '.hero__photo { display: none !important }' },
  { name: 'без зерна', css: '.grain { display: none !important }' },
  {
    name: 'без разметки',
    css: '.cross { display: none !important }',
  },
]

const browser = await chromium.launch({ executablePath: CHROME })

async function run(variant) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  })

  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })

  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(2600)
  if (variant.css) await page.addStyleTag({ content: variant.css })
  await page.waitForTimeout(400)

  const frames = await page.evaluate(async () => {
    const times = []
    let last = performance.now()
    let running = true

    function tick(now) {
      times.push(now - last)
      last = now
      if (running) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    // Прокрутка мелкими шагами — так же, как её ведёт палец
    const total = document.body.scrollHeight - window.innerHeight
    const steps = 90
    for (let i = 0; i <= steps; i++) {
      window.scrollTo(0, Math.round((total * i) / steps))
      await new Promise((r) => setTimeout(r, 24))
    }

    running = false
    await new Promise((r) => setTimeout(r, 60))
    return times.slice(2)
  })

  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 })
  await page.close()

  const sorted = [...frames].sort((a, b) => a - b)
  const p50 = sorted[Math.floor(sorted.length * 0.5)] ?? 0
  const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? 0
  const worst = sorted.at(-1) ?? 0
  const bad = frames.filter((t) => t > 32).length

  return { p50, p95, worst, bad, total: frames.length }
}

console.log('кадров всего / медиана / 95-й / худший / длиннее 32 мс\n')
for (const v of VARIANTS) {
  const r = await run(v)
  console.log(
    `${v.name.padEnd(22)} ${String(r.total).padStart(4)}  ` +
      `${r.p50.toFixed(1).padStart(6)}  ${r.p95.toFixed(1).padStart(6)}  ` +
      `${r.worst.toFixed(1).padStart(7)}  ${String(r.bad).padStart(4)}`,
  )
}

await browser.close()
