/**
 * Логика формы заявки - одна на оба варианта подачи блока [11].
 *
 * Поля по договору: имя, телефон, e-mail. Почта сделана необязательной
 * намеренно: лишнее обязательное поле - лишний повод бросить форму,
 * а связаться с человеком можно и по одному телефону.
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

export function useBookingForm() {
  const { m } = useLocale()

  const name = ref('')
  const phone = ref('')
  const email = ref('')
  const consent = ref(false)

  const status = ref<BookingStatus>('idle')
  const errors = ref<{ name?: string; phone?: string; email?: string; consent?: string }>({})

  function validate(): boolean {
    const f = m.value.booking.form
    const next: typeof errors.value = {}

    if (!name.value.trim()) next.name = f.errName
    // Телефон международный: цифры, пробелы, скобки, дефисы, плюс; минимум 7 знаков
    if (!/^[\d\s()+-]{7,20}$/.test(phone.value.trim())) next.phone = f.errPhone
    // Почта необязательна, но если написана - проверяем форму записи
    if (email.value.trim() && !/^\S+@\S+\.\S+$/.test(email.value.trim())) next.email = f.errEmail
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
            email: email.value.trim(),
          }),
        })
        if (!res.ok) throw new Error(String(res.status))
      } else {
        // 🔴 Имитация: транспорта ещё нет, см. шапку файла
        await new Promise((r) => setTimeout(r, 700))
      }
      status.value = 'done'
    } catch {
      status.value = 'error'
    }
  }

  return { name, phone, email, consent, status, errors, submit }
}
