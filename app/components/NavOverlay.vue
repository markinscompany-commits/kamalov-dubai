<!--
  Меню разделов. Открывается бургером в шапке.

  Меню лежит ПОВЕРХ шапки и полностью её закрывает, поэтому верхнюю строку оно
  повторяет у себя: тот же логотип слева, тот же переключатель языка справа, а на
  месте бургера — крестик закрытия. Иначе при открытом меню логотип пропадает,
  и человек теряет опору.

  Появление собрано по слоям, а не одной прозрачностью: сначала сверху вниз
  раскрывается полотно, затем по очереди выезжают пункты и кнопки. Закрывается тем же
  движением обратно — резкое исчезновение читается как сбой.
-->
<script setup lang="ts">
import { locales, type Locale } from '~/i18n/messages'

interface Props {
  open: boolean
  /** Шапка сейчас в сжатом состоянии — верхняя строка меню должна повторить её высоту */
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), { compact: false })
const emit = defineEmits<{ close: [] }>()

const { m, locale, setLocale } = useLocale()

// TODO: подставить реальный номер клиники, когда клиника его передаст
const whatsapp = 'https://wa.me/79285030807'

const closeBtn = ref<HTMLElement | null>(null)

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

function pick(code: Locale) {
  setLocale(code)
  emit('close')
}

/**
 * Блокировка прокрутки под меню.
 *
 * Отступ под полосу прокрутки здесь НЕ добавляется — за это отвечает
 * `scrollbar-gutter: stable` в base.css. Разница принципиальная: отступ на <body>
 * закреплённые элементы не двигает, поэтому шапка при открытии меню всё равно
 * уезжала вправо на ширину полосы. Зарезервированное место полосы решает это разом:
 * ширина окна не меняется вообще, и ничего не прыгает.
 */
function lockScroll(on: boolean) {
  if (typeof document === 'undefined') return
  document.body.style.overflow = on ? 'hidden' : ''
}

watch(
  () => props.open,
  (isOpen) => {
    lockScroll(isOpen)
    if (isOpen) nextTick(() => closeBtn.value?.focus())
  },
)

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  lockScroll(false)
})
</script>

<template>
  <!--
    ⚠️ Teleport обязателен. Меню закреплено на весь экран, а живёт оно внутри шапки —
    и у шапки стоит собственный слой отрисовки (transform). Любой transform у родителя
    делает его точкой отсчёта для закреплённых потомков: без переноса меню схлопывается
    до высоты шапки. На этом уже обожглись.
  -->
  <Teleport to="body">
    <Transition name="nav">
      <div
        v-if="open"
        class="nav"
        :class="{ 'nav--compact': compact }"
        role="dialog"
        aria-modal="true"
        :aria-label="m.nav.sections"
      >
        <!-- Повтор шапки: логотип, языки, крестик на месте бургера -->
        <div class="nav__top page">
          <a class="nav__logo brackets" href="#top" :aria-label="m.nav.toTop" @click="emit('close')">
            <span>dr.</span>
            <span>Kamalov</span>
          </a>

          <div class="nav__top-right">
            <div class="mono nav__lang" role="group" :aria-label="m.nav.language">
              <template v-for="(item, i) in locales" :key="item.code">
                <span v-if="i" aria-hidden="true">/</span>
                <button
                  class="nav__lang-btn"
                  :class="{ 'nav__lang-btn--on': locale === item.code }"
                  type="button"
                  :aria-current="locale === item.code ? 'true' : undefined"
                  @click="pick(item.code)"
                >
                  {{ item.label }}
                </button>
              </template>
            </div>

            <button
              ref="closeBtn"
              class="nav__close"
              type="button"
              :aria-label="m.nav.close"
              @click="emit('close')"
            >
              <span class="nav__close-box" aria-hidden="true">
                <span class="nav__close-line" />
                <span class="nav__close-line" />
              </span>
            </button>
          </div>
        </div>

        <div class="nav__panel page">
          <ul class="nav__list">
            <li
              v-for="(link, i) in m.nav.links"
              :key="link.href"
              class="nav__item nav__step"
              :style="{ '--i': i }"
            >
              <DashedRule orientation="h" pos="0" :delay="180 + i * 70" faint />
              <a class="nav__link" :href="link.href" @click="emit('close')">
                <span class="mono nav__num">[{{ String(i + 1).padStart(2, '0') }}]</span>
                <span class="nav__label">{{ link.label }}</span>
              </a>
            </li>
            <li class="nav__item nav__item--last">
              <DashedRule orientation="h" pos="0" :delay="180 + m.nav.links.length * 70" faint />
            </li>
          </ul>

          <div class="nav__actions nav__step" :style="{ '--i': m.nav.links.length }">
            <MarkAction href="#booking" @click="emit('close')">{{ m.action.bookLong }}</MarkAction>
            <MarkAction variant="ghost" :href="whatsapp">{{ m.action.whatsapp }}</MarkAction>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.nav {
  position: fixed;
  inset: 0;
  z-index: 120;
  /* Слегка прозрачное полотно с размытием: страница под меню угадывается, но не
     мешает читать (правка Марка) */
  background: color-mix(in srgb, var(--paper-deep) 82%, transparent);
  backdrop-filter: blur(22px) saturate(1.15);
  display: flex;
  flex-direction: column;
  /* Если пунктов станет больше и они перестанут помещаться, меню прокрутится,
     а не обрежется. margin-block: auto у полотна центрирует его, пока место есть */
  overflow-y: auto;
  overscroll-behavior: contain;
  /* Свой слой: полотно во весь экран иначе перерисовывается вместе со страницей */
  will-change: opacity;
}

/* --- Верхняя строка: повтор шапки --- */

.nav__top {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-6);
  block-size: var(--header-h);
  color: var(--ink);
}

/* Шапка была сжата после прокрутки — верхняя строка меню повторяет её высоту
   один в один, иначе логотип и крестик прыгают в момент открытия */
.nav--compact .nav__top {
  block-size: var(--header-h-scrolled);
}

@media (max-width: 900px) {
  /* На телефоне высота шапки не меняется вообще */
  .nav--compact .nav__top {
    block-size: var(--header-h);
  }
}

/* Логотип один в один как в шапке, включая сдвиг на ширину уголка:
   при открытии меню он обязан остаться ровно на своём месте */
.nav__logo {
  flex: none;
  display: inline-flex;
  align-items: baseline;
  gap: 0.24em;
  font-family: var(--font-display);
  font-weight: 300;
  font-size: 1.5rem;
  line-height: 1;
  letter-spacing: 0.04em;
  --brackets-inset: -0.55rem -0.7rem;
  margin-inline-start: 0.7rem;
}

.nav__top-right {
  display: flex;
  align-items: center;
  gap: var(--s-4);
}

.nav__lang {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  color: var(--ink-faint);
}

/* Подчёркивания у языков нет (правка Марка): выбранный отличается только цветом */
.nav__lang-btn {
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  color: var(--ink-faint);
  transition: color var(--dur-fast) var(--ease-out);
}

.nav__lang-btn--on,
.nav__lang-btn:hover {
  color: var(--ink);
}

/* --- Крестик: стоит ровно там, где был бургер --- */

.nav__close {
  flex: none;
  display: grid;
  place-items: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  margin-inline-end: -0.6rem;
  color: var(--ink);
  transition: color var(--dur-fast) var(--ease-out);
  /* Появляется навстречу уходящему бургеру — тем же поворотом, только в другую сторону */
  animation: close-in var(--dur-base) var(--ease-out) 120ms both;
}

.nav__close-box {
  position: relative;
  inline-size: 22px;
  block-size: 22px;
}

.nav__close-line {
  position: absolute;
  inset-block-start: 50%;
  inset-inline: 0;
  block-size: 1px;
  background: currentColor;
  transition: transform var(--dur-base) var(--ease-out);
}

.nav__close-line:first-child {
  transform: rotate(45deg);
}

.nav__close-line:last-child {
  transform: rotate(-45deg);
}

.nav__close:hover {
  color: var(--plum-deep);
}

.nav__close:hover .nav__close-line:first-child {
  transform: rotate(135deg);
}

.nav__close:hover .nav__close-line:last-child {
  transform: rotate(45deg);
}

@keyframes close-in {
  from {
    opacity: 0;
    transform: rotate(-45deg) scale(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* --- Список --- */

.nav__panel {
  inline-size: 100%;
  margin-block: auto;
  padding-block: var(--s-8);
}

.nav__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav__item {
  position: relative;
}

/* Пункты выезжают по очереди. Двигаем только прозрачность и сдвиг — их видеокарта
   считает сама, поэтому даже на слабом телефоне движение остаётся ровным */
.nav__step {
  animation: step-in var(--dur-slow) var(--ease-out) calc(140ms + 55ms * var(--i, 0)) both;
}

@keyframes step-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.nav__link {
  display: flex;
  align-items: baseline;
  gap: var(--s-6);
  padding-block: clamp(var(--s-4), 2.2vh, var(--s-8));
  transition: color var(--dur-fast) var(--ease-out);
}

.nav__num {
  flex: none;
  color: var(--ink-faint);
  transition: color var(--dur-fast) var(--ease-out);
}

.nav__label {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(1.75rem, 5vw, 3.5rem);
  line-height: 1.1;
}

.nav__link:hover .nav__num {
  color: var(--plum);
}

.nav__link:hover .nav__label {
  color: var(--plum-deep);
}

.nav__item--last {
  block-size: 1px;
}

.nav__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-4);
  padding-block-start: var(--s-12);
}

/* --- Появление и уход полотна ---

   Полотно НЕ выезжает: оно стоит на месте и просто перестаёт быть прозрачным
   (правка Марка). Вместе с прозрачностью нарастает и размытие фона — эффект
   получается «страница ушла из фокуса», а не «сверху что-то приехало».

   Закрытие чуть быстрее открытия: уходить интерфейс должен охотнее, чем приходит. */

.nav-enter-active {
  transition: opacity 420ms var(--ease-out);
}

.nav-leave-active {
  transition: opacity 320ms var(--ease-out);
}

.nav-enter-from,
.nav-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .nav-enter-active,
  .nav-leave-active {
    transition-duration: 0.01ms;
  }
}

@media (max-width: 720px) {
  .nav__logo {
    font-size: 1.25rem;
  }
}
</style>
