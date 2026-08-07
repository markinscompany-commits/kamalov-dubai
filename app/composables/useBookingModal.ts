/**
 * Попап записи на консультацию (правка Марка 07.08).
 *
 * Кнопки «Записаться» по сайту больше НЕ ведут якорем к блоку [11] в конце
 * страницы - каждая открывает модальную форму и передаёт СВОЙ источник:
 * из какого блока пришла заявка. Источник уходит и в данные заявки, и в
 * слой аналитики (см. useBookingForm) - когда подключится GA4, в событии
 * будет видно, какой блок привёл человека.
 *
 * Источники: hero / header / menu / surgery / treatment / booking-section.
 */
export function useBookingModal() {
  const isOpen = useState<boolean>('booking-modal', () => false)
  const source = useState<string>('booking-modal-source', () => 'unknown')
  /** Счётчик открытий: по нему форма пересоздаётся чистой при каждом открытии */
  const openSeq = useState<number>('booking-modal-seq', () => 0)

  function open(from: string) {
    source.value = from
    openSeq.value += 1
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return { isOpen, source, openSeq, open, close }
}
