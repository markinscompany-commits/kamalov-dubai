/**
 * Логика формы заявки - одна на оба варианта подачи блока [11].
 *
 * Поля: имя и телефон.
 *
 * ⚠️ ПОЧТА УБРАНА (правка Марка 07.08). Раньше она стояла рядом с телефоном
 * необязательным полем, и это сбивало: человек не понимал, что заполнять и
 * нужно ли оба. Клиника перезванивает, так что почта ничего не решала.
 *
 * 🔴 ТРАНСПОРТ НЕ ПОДКЛЮЧЁН. Адрес почты и Telegram для заявок клиника
 * не передала (срок по договору п. 5.2 вышел 06.08, задержка зафиксирована
 * письменно). Пока конечной точки нет, отправка ИМИТИРУЕТСЯ: форма проходит
 * весь путь (валидация → отправка → подтверждение), но заявка никуда
 * не уходит - это рабочая версия для показа, не боевая страница.
 * К запуску сюда встаёт реальный адрес relay-сервиса, который разносит
 * заявку на почту и в Telegram (этап 5 плана).
 */

export type BookingStatus = 'idle' | 'sending' | 'done' | 'error'

/** Конечная точка отправки. Пусто = транспорта ещё нет, отправка имитируется */
const SUBMIT_ENDPOINT = ''

/**
 * Версия текста политики конфиденциальности - уходит вместе с заявкой.
 * Меняется при каждой правке политики: тогда по заявке видно, с какой
 * именно редакцией согласился человек. Формат - дата правки.
 */
const POLICY_VERSION = '2026-08-06'

/**
 * @param source из какого блока пришла заявка (правка Марка 07.08):
 * hero / header / menu / surgery / treatment / booking-section.
 * Уходит в данные заявки и в слой аналитики.
 */
export function useBookingForm(source: string) {
  const { m } = useLocale()

  const name = ref('')
  const phone = ref('')
  const consent = ref(false)

  const status = ref<BookingStatus>('idle')
  const errors = ref<{ name?: string; phone?: string; consent?: string }>({})

  function validate(): boolean {
    const f = m.value.booking.form
    const next: typeof errors.value = {}

    if (!name.value.trim()) next.name = f.errName
    // Телефон международный: цифры, пробелы, скобки, дефисы, плюс; минимум 7 знаков
    if (!/^[\d\s()+-]{7,20}$/.test(phone.value.trim())) next.phone = f.errPhone
    if (!consent.value) next.consent = f.errConsent

    errors.value = next
    return Object.keys(next).length === 0
  }

  async function submit() {
    if (status.value === 'sending') return
    if (!validate()) return

    status.value = 'sending'
    try {
      if (SUBMIT_ENDPOINT) {
        const res = await fetch(SUBMIT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.value.trim(),
            phone: phone.value.trim(),
            // Из какого блока пришла заявка - видно и клинике, и аналитике
            source,
            /*
             * Отметка о согласии уходит вместе с заявкой.
             * Зачем: по закону ОАЭ о персональных данных (PDPL, ст. 6) доказывать
             * факт согласия обязана клиника как оператор данных. Галочка, которая
             * живёт только в браузере, ничего не доказывает - в заявке должно
             * остаться, что человек согласился и когда именно.
             */
            consent: consent.value,
            consent_at: new Date().toISOString(),
            // Версия текста политики, с которой человек согласился
            policy_version: POLICY_VERSION,
          }),
        })
        if (!res.ok) throw new Error(String(res.status))
      } else {
        // 🔴 Имитация: транспорта ещё нет, см. шапку файла
        await new Promise((r) => setTimeout(r, 700))
      }
      status.value = 'done'

      /*
       * Слой аналитики. GTM/GA4 подключаются на этапе 5 - пуш в dataLayer
       * безопасен и до того (обычный массив). Имя события НЕЙТРАЛЬНОЕ,
       * не «Заявка» (решение проекта: медицинские домены - Health & Wellness,
       * см. PROJECT.md, раздел 5). Источник - требование Марка 07.08:
       * в событии видно, из какого блока записались.
       */
      if (import.meta.client) {
        const w = window as typeof window & { dataLayer?: Record<string, unknown>[] }
        w.dataLayer = w.dataLayer || []
        w.dataLayer.push({ event: 'request_sent', request_source: source })
      }
    } catch {
      status.value = 'error'
    }
  }

  return { name, phone, consent, status, errors, submit }
}
