import { messages, type Locale } from '~/i18n/messages'

const STORAGE_KEY = 'kamalov-locale'

/**
 * Язык сайта.
 *
 * С 07.08 у языков ОТДЕЛЬНЫЕ АДРЕСА, и основной язык - АНГЛИЙСКИЙ:
 * `/` - английская версия, `/ru` - русская. Обе лежат в статике готовым
 * HTML - поисковики и модерация Meta видят каждую по своему адресу.
 * Кто главный по языку - маршрут: app.vue выставляет locale по пути
 * страницы (и на сервере, и при переходах).
 *
 * На страницах ВНЕ языковых маршрутов (например /privacy) язык живёт
 * состоянием, как раньше, - там переключение не меняет адрес.
 *
 * Переключение НЕ мгновенное: сначала опускается заставка, за ней происходит
 * переход на другой адрес (или подмена текстов), потом заставка уходит.
 * Иначе буквы скачут на глазах - выглядит как сбой.
 */
export function useLocale() {
  // Значение по умолчанию - английский: он же лежит на корневом адресе
  const locale = useState<Locale>('locale', () => 'en')
  /** true, пока идёт подмена текстов */
  const swapping = useState<boolean>('locale-swapping', () => false)

  const m = computed(() => messages[locale.value])

  async function setLocale(next: Locale) {
    if (next === locale.value || swapping.value) return

    const { hold, hide } = usePreloader()
    const route = useRouter().currentRoute.value
    /* Языковые маршруты: переключение = переход на другой адрес.
       Слэш на конце снимаем - хостинг отдаёт /ru как /ru/ */
    const path = route.path.replace(/\/+$/, '') || '/'
    const onLangRoute = path === '/' || path === '/ru'

    swapping.value = true
    // Полотно должно успеть закрыть страницу целиком, прежде чем меняются буквы
    await hold(520)

    if (onLangRoute) {
      await navigateTo(next === 'ru' ? '/ru' : '/')
    }
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

  /**
   * Вызывается один раз при загрузке: если человек в прошлый раз выбрал
   * русский и пришёл на корневой (английский) адрес - тихо переводим его
   * на /ru. Обратного увода нет: английский основной, и человека, пришедшего
   * по рекламной ссылке, никуда не уносит.
   */
  function restoreLocale() {
    if (!import.meta.client) return
    let saved: string | null = null
    try {
      saved = localStorage.getItem(STORAGE_KEY)
    } catch {
      saved = null
    }
    const path = useRouter().currentRoute.value.path.replace(/\/+$/, '') || '/'
    if (saved === 'ru' && path === '/') {
      navigateTo('/ru', { replace: true })
      return
    }
    document.documentElement.lang = locale.value
  }

  return { locale, swapping, m, setLocale, restoreLocale }
}
