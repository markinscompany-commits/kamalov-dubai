/**
 * «Чертится заново каждый раз» - общий приём разметки сайта.
 *
 * Возвращает флаг live: true, когда элемент показался на экране (порог задаётся),
 * false - когда элемент целиком ушёл с экрана. Блок вернулся - анимация появления
 * отрабатывает заново, как у CrossRules.
 *
 * ⚠️ Наблюдатель за уходом обязан иметь запас (WATCH_SLACK): секции у нас часто
 * ровно в высоту окна, и совпадение границ браузер не засчитывает за «ушёл».
 * Грабли разобраны в design-system.md, раздел 4.
 *
 * Третье появление паттерна (CrossRules, карта, печати госпиталя) - стал композаблом.
 */
export function useRedrawOnReturn(
  target: Ref<HTMLElement | null>,
  threshold = 0.25,
  /**
   * true - нарисоваться один раз и больше НЕ стираться.
   * Для элементов с длинной цепочкой появления: у карты госпиталя маркер и
   * подпись приходят последними (1.5-1.75 с), и при каждом возврате блока
   * они это время стояли пустыми - Марк видел это как «подпись появляется
   * и исчезает» (правка 05.08). Одноразовым элементам наблюдатели после
   * первого срабатывания не нужны - отключаемся.
   */
  once = false,
) {
  const WATCH_SLACK = 4
  const live = ref(false)

  let enterWatch: IntersectionObserver | null = null
  let leaveWatch: IntersectionObserver | null = null

  onMounted(() => {
    enterWatch = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          live.value = true
          if (once) {
            enterWatch?.disconnect()
            leaveWatch?.disconnect()
          }
        }
      },
      { threshold },
    )
    leaveWatch = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) live.value = false
      },
      { threshold: 0, rootMargin: `-${WATCH_SLACK}px` },
    )
    if (target.value) {
      enterWatch.observe(target.value)
      if (!once) leaveWatch.observe(target.value)
    }
  })

  onBeforeUnmount(() => {
    enterWatch?.disconnect()
    leaveWatch?.disconnect()
  })

  return live
}
