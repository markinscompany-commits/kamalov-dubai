import { chromium } from 'playwright-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const browser = await chromium.launch({ executablePath: CHROME })
const page = await browser.newPage({ viewport: { width: 700, height: 900 } })
const files = ['scheme-1-forma 1.svg', 'scheme-2-dyhanie 1.svg', 'scheme-3-vmeste 1.svg']
for (const f of files) {
  await page.goto('file:///C:/Users/Ghost/Desktop/markins_co/Mark/Dr_kamalov_plastic-surgery-dubai/design/scheme-figma-remake/' + encodeURIComponent(f))
  await page.waitForTimeout(400)
  await page.screenshot({ path: 'tools/shots-brand/src-' + f.replace(/\.svg| /g, '') + '.png' })
}
await browser.close()
console.log('ok')
