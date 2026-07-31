/**
 * Заставка.
 *
 * Показывается в двух случаях:
 *   · при первой загрузке страницы — пока грузятся шрифты и портрет;
 *   · при смене языка — за ней подменяются все тексты сразу.
 *
 * Состояние по умолчанию — «показана»: заставка попадает уже в готовый HTML,
 * поэтому человек не видит ни голого текста без шрифтов, ни пустого места
 * под ещё не загруженной фотографией.
 */
export function usePreloader() {
  const visible = useState<boolean>('preloader', () => true)

  /** Показать заставку на заданное время (для смены языка) */
  async function hold(ms: number) {
    visible.value = true
    await new Promise((r) => setTimeout(r, ms))
  }

  function hide() {
    visible.value = false
  }

  /**
   * Первая загрузка: ждём шрифты и первый экран, но не дольше разумного.
   * Нижняя граница нужна, чтобы на быстром соединении заставка не мигала,
   * верхняя — чтобы сайт не заперся, если что-то не догрузилось.
   */
  async function boot(minMs = 900, maxMs = 3500) {
    if (!import.meta.client) return

    const started = performance.now()

    const ready = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise<void>((resolve) => {
        const img = document.querySelector<HTMLImageElement>('.hero__photo img')
        if (!img || img.complete) return resolve()
        img.addEventListener('load', () => resolve(), { once: true })
        img.addEventListener('error', () => resolve(), { once: true })
      }),
    ])

    await Promise.race([ready, new Promise((r) => setTimeout(r, maxMs))])

    const left = minMs - (performance.now() - started)
    if (left > 0) await new Promise((r) => setTimeout(r, left))

    hide()
  }

  return { visible, boot, hold, hide }
}
