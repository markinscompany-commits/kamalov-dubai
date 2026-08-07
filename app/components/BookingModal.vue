<!--
  Попап записи на консультацию (правка Марка 07.08). Открывается со всех
  кнопок «Записаться» по сайту (useBookingModal), внутри - та же форма-анкета
  (BookingForm) в компактном режиме, с источником блока, откуда пришли.

  ДОСТУПНОСТЬ: role=dialog + aria-modal, фокус при открытии уходит в окно,
  при закрытии возвращается на кнопку, Esc и клик по подложке закрывают.
  Прокрутка страницы под окном заперта (html держит место полосы через
  scrollbar-gutter - страница не прыгает, приём из NavOverlay).

  Teleport в body: у шапки может быть свой контекст наложения (грабля
  из дизайн-системы, раздел 6).
-->
<script setup lang="ts">
const { m } = useLocale()
const { isOpen, source, openSeq, close } = useBookingModal()

const panel = ref<HTMLElement | null>(null)
let lastFocus: HTMLElement | null = null

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

watch(isOpen, (open) => {
  if (!import.meta.client) return
  if (open) {
    lastFocus = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    // Фокус - в первое поле формы, когда окно уже в DOM
    nextTick(() => {
      panel.value?.querySelector<HTMLElement>('input, button')?.focus()
    })
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKey)
    lastFocus?.focus()
    lastFocus = null
  }
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="bkm">
      <div v-if="isOpen" class="bkm" @click.self="close()">
        <div
          ref="panel"
          class="bkm__panel"
          role="dialog"
          aria-modal="true"
          :aria-label="m.booking.title"
        >
          <div class="bkm__head">
            <h2 class="bkm__title">{{ m.booking.title }}</h2>
            <button type="button" class="bkm__close" :aria-label="m.nav.close" @click="close()">
              <span class="bkm__close-mark" aria-hidden="true" />
            </button>
          </div>

          <!-- key по счётчику открытий: каждое открытие - чистая форма
               с актуальным источником -->
          <BookingForm :key="openSeq" :source="source" compact />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.bkm {
  position: fixed;
  inset: 0;
  z-index: 150;
  display: grid;
  place-items: center;
  padding: var(--s-4);
  /* Подложка: чернила, страница под ней угадывается (приём меню) */
  background: color-mix(in srgb, var(--ink) 55%, transparent);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.bkm__panel {
  inline-size: min(34rem, 100%);
  max-block-size: calc(100vh - 2 * var(--s-4));
  max-block-size: calc(100dvh - 2 * var(--s-4));
  overflow-y: auto;
  background: var(--paper);
  padding: clamp(1.5rem, 4vw, 2.5rem);
}

.bkm__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--s-4);
  margin-block-end: var(--s-6);
}

.bkm__title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 2.4vw, 2rem);
  font-weight: 300;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0;
  color: var(--ink);
}

.bkm__close {
  border: 0;
  background: none;
  padding: 0.4rem;
  margin: -0.4rem;
  cursor: pointer;
  color: var(--ink);
  flex: 0 0 auto;
}

.bkm__close:hover {
  color: var(--blue);
}

/* Крестик из двух штрихов тем же пером, что разметка (как в FAQ и меню) */
.bkm__close-mark {
  position: relative;
  display: block;
  inline-size: 17px;
  block-size: 17px;
  rotate: 45deg;
}

.bkm__close-mark::before,
.bkm__close-mark::after {
  content: '';
  position: absolute;
  background: currentColor;
}

.bkm__close-mark::before {
  inset-inline: 0;
  inset-block-start: calc(50% - var(--rule-w) / 2);
  block-size: var(--rule-w);
}

.bkm__close-mark::after {
  inset-block: 0;
  inset-inline-start: calc(50% - var(--rule-w) / 2);
  inline-size: var(--rule-w);
}

/* Появление: подложка проявляется, окно чуть поднимается */
.bkm-enter-active {
  transition: opacity 280ms var(--ease-out);
}

.bkm-leave-active {
  transition: opacity 200ms var(--ease-out);
}

.bkm-enter-from,
.bkm-leave-to {
  opacity: 0;
}

.bkm-enter-active .bkm__panel {
  transition: translate 280ms var(--ease-out);
}

.bkm-enter-from .bkm__panel {
  translate: 0 0.6rem;
}
</style>
