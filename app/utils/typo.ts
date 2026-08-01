/**
 * Типограф: убирает висячие предлоги.
 *
 * Короткое слово в конце строки — «в», «на», «и» — читается как обрыв: глаз уже
 * перескочил, а мысль ещё нет. Поэтому такие слова приклеиваются к следующему
 * неразрывным пробелом и переносятся вместе с ним.
 *
 * Работает на обоих языках сайта. Правила применяются к готовым текстам один раз
 * при сборке словаря, а не на каждую отрисовку.
 */

/** Неразрывный пробел */
const NB = ' '

/** Предлоги и союзы длиннее двух букв, которые тоже нельзя оставлять в конце строки */
const LONG_SHORT_WORDS = [
  // русский
  'для',
  'при',
  'про',
  'над',
  'под',
  'без',
  'изо',
  'обо',
  'чем',
  'или',
  'как',
  'что',
  // английский
  'the',
  'and',
  'for',
  'from',
  'with',
  'into',
  'onto',
].join('|')

/** Частицы, которые прилипают к ПРЕДЫДУЩЕМУ слову */
const PARTICLES = /\s+(бы|ли|ль|же|ж)(?=[\s.,;:!?)»]|$)/giu

/**
 * Любое слово из одной-двух букв плюс список выше. Перед ним — начало строки или
 * разделитель, после — пробел и продолжение фразы.
 */
const SHORT_WORD = new RegExp(
  `(^|[\\s("«„'])((?:\\p{L}{1,2}|${LONG_SHORT_WORDS}))[ \\t]+`,
  'giu',
)

/** Число и то, к чему оно относится: «30 лет» не должно разъезжаться по строкам */
const NUMBER_UNIT = /(\d)[ \t]+(?=\p{L})/gu

/** Тире остаётся в конце строки, а не начинает новую */
const DASH = /(\S)[ \t]+-[ \t]+/g

export function typo(input: string): string {
  let out = input

  out = out.replace(DASH, `$1${NB}- `)
  out = out.replace(NUMBER_UNIT, `$1${NB}`)
  out = out.replace(PARTICLES, `${NB}$1`)

  // Два прохода: замена съедает пробел после слова, поэтому подряд идущие короткие
  // слова («и в», «а не») за один проход не склеиваются
  out = out.replace(SHORT_WORD, `$1$2${NB}`)
  out = out.replace(SHORT_WORD, `$1$2${NB}`)

  return out
}

/** Ключи, которые трогать нельзя: это не текст, а адреса и коды */
const SKIP = new Set(['href', 'code'])

/** Прогоняет типограф по всему словарю: строки, массивы строк, вложенные объекты */
export function typoDeep<T>(value: T): T {
  if (typeof value === 'string') return typo(value) as unknown as T
  if (Array.isArray(value)) return value.map((v) => typoDeep(v)) as unknown as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = SKIP.has(key) ? val : typoDeep(val)
    }
    return out as unknown as T
  }
  return value
}
