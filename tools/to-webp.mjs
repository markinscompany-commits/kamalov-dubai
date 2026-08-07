/**
 * Перевод всех снимков сайта в WebP.
 *
 * Зачем. Страница тянула около мегабайта картинок, причём почти половину веса
 * давали четыре логотипа вузов: они лежали PNG-файлами 360x360, а показываются
 * размером с ноготь. WebP при том же качестве весит в разы меньше, а поддержан
 * всеми браузерами, которые вообще открывают этот сайт.
 *
 * Что делает:
 *  · проходит public/media, берёт .jpg/.jpeg/.png;
 *  · логотипы и значки заодно ужимает по размеру - показывать 360 px там,
 *    где на экране 40, смысла нет;
 *  · сохраняет .webp рядом и УДАЛЯЕТ исходник;
 *  · портрет врача дополнительно остаётся в JPEG (doctor-portrait.jpg):
 *    это og:image, карточка ссылки в соцсетях, а там WebP до сих пор
 *    обрабатывается не везде одинаково. Единственное исключение.
 *
 * SVG не трогаем - они и так лёгкие и масштабируются.
 *
 * Запуск: node tools/to-webp.mjs [--dry]
 */
import { readdir, stat, unlink, copyFile } from 'node:fs/promises'
import { join, extname, basename, dirname } from 'node:path'
import sharp from 'sharp'

const ROOT = 'public/media'
const DRY = process.argv.includes('--dry')

/** Потолок по ширине для мелкой графики: больше на экране не показывается */
const MAX_WIDTH = {
  logos: 240,
  docs: 1600,
  gallery: 1200,
  clinic: 1800,
}

/** Качество: у сканов документов выше - их открывают и разглядывают */
const QUALITY = {
  docs: 88,
  default: 82,
}

/** Портрет остаётся ещё и в JPEG - он уходит в og:image */
const KEEP_JPEG = new Set(['doctor-portrait.jpg'])

async function walk(dir) {
  const out = []
  for (const name of await readdir(dir)) {
    const full = join(dir, name)
    if ((await stat(full)).isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

const files = (await walk(ROOT)).filter((f) => /\.(jpe?g|png)$/i.test(f))

let before = 0
let after = 0
const renames = []

for (const file of files) {
  const folder = basename(dirname(file))
  const srcSize = (await stat(file)).size
  before += srcSize

  const target = file.replace(/\.(jpe?g|png)$/i, '.webp')
  const maxW = MAX_WIDTH[folder]
  const quality = QUALITY[folder] ?? QUALITY.default

  let img = sharp(file)
  const meta = await img.metadata()
  if (maxW && meta.width > maxW) img = img.resize({ width: maxW, withoutEnlargement: true })

  const buf = await img.webp({ quality, effort: 6 }).toBuffer()

  /*
   * ⚠️ Переводим ТОЛЬКО если стало легче. Часть сканов документов - обычные
   * фотоснимки, уже плотно сжатые JPEG-ом; WebP на них выходит тяжелее
   * исходника. Менять формат ради формата смысла нет, поэтому такие файлы
   * остаются как есть.
   */
  const better = buf.length < srcSize * 0.95
  after += better ? buf.length : srcSize

  const pct = Math.round((1 - buf.length / srcSize) * 100)
  console.log(
    `${file.padEnd(46)} ${String(Math.round(srcSize / 1024)).padStart(5)} KB → ` +
      `${String(Math.round(buf.length / 1024)).padStart(5)} KB  ` +
      (better ? `(-${pct}%)` : '(оставлен как был)'),
  )

  if (!DRY && better) {
    await sharp(buf).toFile(target)
    if (KEEP_JPEG.has(basename(file))) {
      // Оставляем исходник: он нужен карточке ссылки в соцсетях
      console.log(`   ↑ ${basename(file)} оставлен и в JPEG - для og:image`)
    } else {
      await unlink(file)
    }
    renames.push([basename(file), basename(target)])
  }
}

if (renames.length) {
  console.log('\nПереименовано (обновить ссылки в app/):')
  for (const [from, to] of renames) console.log(`  ${from} → ${to}`)
}

console.log(
  `\nИтого: ${Math.round(before / 1024)} KB → ${Math.round(after / 1024)} KB ` +
    `(-${Math.round((1 - after / before) * 100)}%), файлов: ${files.length}`,
)
if (DRY) console.log('Пробный прогон - ничего не записано и не удалено')
