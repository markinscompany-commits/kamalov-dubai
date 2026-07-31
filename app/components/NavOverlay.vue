<!--
  Меню разделов. Открывается бургером в шапке.
  Оформлено в языке сайта: пунктирные разделители, номера разделов моноширинным,
  названия — крупной антиквой.

  Появление собрано по слоям, а не одной прозрачностью: сначала сверху вниз
  раскрывается полотно, затем по очереди выезжают пункты, кнопки и подвал.
  Закрытие быстрее открытия — уходить интерфейс должен охотнее, чем приходит.
-->
<script setup lang="ts">
import { locales, type Locale } from '~/i18n/messages'

interface Props {
  open: boolean
}

const props = defineProps<Props>()
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
 * Полосу прокрутки нужно компенсировать отступом: без этого на десктопе страница
 * при открытии меню прыгает вправо на её ширину, и это читается как рывок.
 */
function lockScroll(on: boolean) {
  if (typeof document === 'undefined') return
  const body = document.body
  if (on) {
    const gap = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingInlineEnd = `${gap}px`
  } else {
    body.style.overflow = ''
    body.style.paddingInlineEnd = ''
  }
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
      <div v-if="open" class="nav" role="dialog" aria-modal="true" :aria-label="m.nav.sections">
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

        <div class="nav__foot nav__step" :style="{ '--i': m.nav.links.length + 1 }">
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
          <p class="mono nav__place">{{ m.nav.place }}</p>
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
  background: var(--paper-deep);
  display: flex;
  flex-direction: column;
  /* Если пунктов станет больше и они перестанут помещаться, меню прокрутится,
     а не обрежется. margin-block: auto у полотна центрирует его, пока место есть */
  overflow-y: auto;
  overscroll-behavior: contain;
  /* Свой слой: полотно во весь экран иначе перерисовывается вместе со страницей */
  will-change: opacity, clip-path;
}

/* --- Крестик --- */

.nav__close {
  position: absolute;
  z-index: 1;
  inset-block-start: calc((var(--header-h) - 2.75rem) / 2);
  inset-inline-end: calc(var(--page-pad) - 0.6rem);
  display: grid;
  place-items: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
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
  padding-block: var(--header-h) var(--s-8);
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

.nav__foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--s-4);
  padding-block-start: var(--s-8);
}

.nav__lang {
  display: flex;
  align-items: center;
  gap: var(--s-2);
}

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

.nav__place {
  margin: 0;
}

/* --- Появление и уход полотна ---
   Открывается раскрытием сверху вниз, закрывается прозрачностью: уходить меню
   должно быстрее, чем приходит, иначе кажется, что оно «залипает» */

.nav-enter-active {
  transition: clip-path 520ms var(--ease-out);
}

.nav-leave-active {
  transition: opacity 240ms var(--ease-out);
}

.nav-enter-from {
  clip-path: inset(0 0 100% 0);
}

.nav-enter-to {
  clip-path: inset(0);
}

.nav-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .nav-enter-active,
  .nav-leave-active {
    transition-duration: 0.01ms;
  }
}
</style>
