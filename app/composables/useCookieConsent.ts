/**
 * Согласие на статистику посещений.
 *
 * ЗАЧЕМ ОН ВООБЩЕ ЕСТЬ. В ОАЭ нет отдельного закона о куках - там работает
 * только PDPL (закон о персональных данных), и он включается тогда, когда
 * данные становятся персональными. Пока сайт не ставит кук, баннер не нужен
 * и его не должно быть: лишнее окно на платном трафике - это потерянные заявки.
 *
 * Как только подключается GA4, появляются куки `_ga` - это уже идентификаторы,
 * то есть персональные данные, и вдобавок они уезжают на серверы Google
 * за пределы ОАЭ. Вот с этого момента согласие нужно.
 *
 * ⚠️ ГЛАВНОЕ ПРАВИЛО: счётчик грузится ТОЛЬКО после нажатия «Принять».
 * Нажали «Отклонить» - не грузится вообще, ни одной куки не ставится,
 * и выбор запоминается, чтобы баннер не спрашивал заново. Никаких
 * «нажмите, чтобы продолжить» и предвыбранных галочек: согласие по PDPL
 * должно быть действием человека, а не следствием того, что он листает дальше.
 *
 * Баннер показывается ТОЛЬКО если счётчик настроен (NUXT_PUBLIC_GA_ID).
 * Пока идентификатора нет, кук нет - и спрашивать не о чем.
 */

export type ConsentChoice = 'accepted' | 'declined'

const STORAGE_KEY = 'kamalov-analytics-consent'

export function useCookieConsent() {
  /** null - человек ещё не отвечал */
  const choice = useState<ConsentChoice | null>('cookie-consent', () => null)
  /** Пока не прочитали localStorage, баннер не рисуем - иначе он мигает */
  const ready = useState<boolean>('cookie-consent-ready', () => false)

  const gaId = useRuntimeConfig().public.gaId as string
  /** Счётчик настроен? Нет - значит кук нет и согласие не требуется */
  const analyticsConfigured = computed(() => Boolean(gaId))

  const showBanner = computed(
    () => ready.value && analyticsConfigured.value && choice.value === null,
  )

  function read(): ConsentChoice | null {
    try {
      const v = localStorage.getItem(STORAGE_KEY)
      return v === 'accepted' || v === 'declined' ? v : null
    } catch {
      // приватный режим - живём без запоминания
      return null
    }
  }

  function save(value: ConsentChoice) {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // см. выше
    }
  }

  /** Вызывается один раз при загрузке */
  function restore() {
    if (!import.meta.client) return
    choice.value = read()
    ready.value = true
    if (choice.value === 'accepted') loadAnalytics()
  }

  function accept() {
    choice.value = 'accepted'
    save('accepted')
    loadAnalytics()
  }

  function decline() {
    choice.value = 'declined'
    save('declined')
    // Ничего не грузим и не чистим: до согласия счётчик не подключался,
    // значит и удалять нечего
  }

  /**
   * Подключение счётчика. Один раз за жизнь страницы: повторный вызов
   * (например, если человек примет согласие после перезагрузки) не должен
   * вставлять второй скрипт.
   */
  function loadAnalytics() {
    if (!import.meta.client || !gaId) return
    const w = window as typeof window & {
      dataLayer?: unknown[]
      gtag?: (...args: unknown[]) => void
      __gaLoaded?: boolean
    }
    if (w.__gaLoaded) return
    w.__gaLoaded = true

    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(s)

    w.dataLayer = w.dataLayer || []
    w.gtag = function gtag() {
      // gtag читает СВОЙ arguments, поэтому стрелочная функция здесь не годится
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments)
    }
    w.gtag('js', new Date())
    /*
     * anonymize_ip - IP обрезается на стороне Google. По PDPL это не
     * обязанность, но и не стоит ничего, а объём собираемых данных
     * уменьшает: чем меньше собрали, тем меньше защищать.
     */
    w.gtag('config', gaId, { anonymize_ip: true })
  }

  return { choice, showBanner, analyticsConfigured, restore, accept, decline }
}
