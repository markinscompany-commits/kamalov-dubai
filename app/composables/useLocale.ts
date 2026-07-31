import { messages, type Locale } from '~/i18n/messages'

const STORAGE_KEY = 'kamalov-locale'

/**
 * Язык сайта.
 *
 * Держим своё, а не подключаем модуль перевода: контента на странице немного, а
 * лишний модуль на этапе, когда тексты ещё не утверждены, только мешает.
 * Когда дойдём до сдачи (блок 4), переключатель переедет на отдельные адреса
 * /ru и /en — это нужно поисковикам и рекламе, одним состоянием там не обойтись.
 *
 * Переключение НЕ мгновенное: сначала опускается заставка, за ней подменяются все
 * тексты сразу, потом заставка уходит. Иначе буквы скачут на глазах, а длина строк
 * на английском другая — выглядит как сбой.
 */
export function useLocale() {
  const locale = useState<Locale>('locale', () => 'ru')
  /** true, пока идёт подмена текстов */
  const swapping = useState<boolean>('locale-swapping', () => false)

  const m = computed(() => messages[locale.value])

  async function setLocale(next: Locale) {
    if (next === locale.value || swapping.value) return

    const { hold, hide } = usePreloader()

    swapping.value = true
    // Полотно должно успеть закрыть страницу целиком, прежде чем меняются буквы
    await hold(520)

    locale.value = next
    if (import.meta.client) {
      document.documentElement.lang = next
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // приватный режим — молча живём без запоминания
      }
    }

    await nextTick()
    // Держим ещё немного: иначе заставка мигает и смена читается как сбой,
    // а не как решение
    await new Promise((r) => setTimeout(r, 420))

    hide()
    swapping.value = false
  }

  /** Вызывается один раз при загрузке: вспоминаем выбор человека */
  function restoreLocale() {
    if (!import.meta.client) return
    let saved: string | null = null
    try {
      saved = localStorage.getItem(STORAGE_KEY)
    } catch {
      saved = null
    }
    const next = saved === 'en' || saved === 'ru' ? saved : null
    if (next && next !== locale.value) {
      locale.value = next
    }
    document.documentElement.lang = locale.value
  }

  return { locale, swapping, m, setLocale, restoreLocale }
}
