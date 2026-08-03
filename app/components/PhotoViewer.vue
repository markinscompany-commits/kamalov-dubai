<!--
  Полноэкранный просмотр фотографий: листание, зум, панорамирование.

  Появился для галереи госпиталя (правка Марка 03.08: «кадры по клику на весь
  экран, приближать и отдалять»). Компонент общий - галерея «до/после» этапа 2
  сможет использовать его же.

  Язык - как у меню: чернильное полотно с размытием, ничего не выезжает,
  всё появляется прозрачностью. Управление:
  · колесо мыши / кнопки +- / двойной клик - зум (к точке под курсором);
  · перетаскивание - панорама, на телефоне щипок - зум;
  · свайп при масштабе 1:1 - листание; стрелки клавиатуры - тоже;
  · Esc, клик по фону, крестик - закрыть.

  ⚠️ Прокрутка страницы блокируется через overflow на <body>: место под полосу
  прокрутки уже зарезервировано на <html> (scrollbar-gutter: stable), поэтому
  ничего не прыгает - тот же приём, что у меню.

  ⚠️ Полотно тёмное, поэтому --focus здесь перебит на светлое золото - правило
  дизайн-системы для чернильных поверхностей.
-->
<script setup lang="ts">
interface ViewerItem {
  file: string
  alt: string
  caption: string
}

const props = defineProps<{
  items: ViewerItem[]
  /** Индекс открытого кадра; null - просмотрщик закрыт */
  index: number | null
}>()

const emit = defineEmits<{ 'update:index': [value: number | null] }>()

const { m } = useLocale()
const base = useRuntimeConfig().app.baseURL

const stage = ref<HTMLElement | null>(null)
const img = ref<HTMLImageElement | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)

const scale = ref(1)
const tx = ref(0)
const ty = ref(0)
/** Пока идёт жест, переход у transform отключается - иначе картинка «догоняет» палец */
const gesturing = ref(false)

const MIN = 1
const MAX = 4

const current = computed(() => (props.index === null ? null : props.items[props.index]))
const counter = computed(() => {
  if (props.index === null) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(props.index + 1)} / ${pad(props.items.length)}`
})

function close() {
  emit('update:index', null)
}

function step(dir: 1 | -1) {
  if (props.index === null) return
  const n = props.items.length
  emit('update:index', (props.index + dir + n) % n)
}

function resetView() {
  scale.value = 1
  tx.value = 0
  ty.value = 0
}

/* Панораму держим в пределах кадра: за край утащить нельзя */
function clampPan() {
  const st = stage.value
  const el = img.value
  if (!st || !el) return
  const maxX = Math.max(0, (el.offsetWidth * scale.value - st.clientWidth) / 2)
  const maxY = Math.max(0, (el.offsetHeight * scale.value - st.clientHeight) / 2)
  tx.value = Math.min(maxX, Math.max(-maxX, tx.value))
  ty.value = Math.min(maxY, Math.max(-maxY, ty.value))
}

/** Зум к точке: точка под курсором остаётся на месте */
function zoomAt(clientX: number, clientY: number, factor: number) {
  const st = stage.value
  if (!st) return
  const rect = st.getBoundingClientRect()
  const px = clientX - rect.left - rect.width / 2
  const py = clientY - rect.top - rect.height / 2
  const next = Math.min(MAX, Math.max(MIN, scale.value * factor))
  const k = next / scale.value
  tx.value = px - (px - tx.value) * k
  ty.value = py - (py - ty.value) * k
  scale.value = next
  if (next === MIN) {
    tx.value = 0
    ty.value = 0
  }
  clampPan()
}

function zoomCenter(factor: number) {
  const st = stage.value
  if (!st) return
  const rect = st.getBoundingClientRect()
  zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor)
}

function onWheel(e: WheelEvent) {
  gesturing.value = false
  zoomAt(e.clientX, e.clientY, Math.pow(1.0015, -e.deltaY))
}

function onDblClick(e: MouseEvent) {
  zoomAt(e.clientX, e.clientY, scale.value > 1.05 ? MIN / scale.value : 2.4)
}

/* --- Жесты: один палец - панорама или свайп, два - щипок --- */

const pointers = new Map<number, { x: number; y: number }>()
let swipeDX = 0

function onPointerDown(e: PointerEvent) {
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  swipeDX = 0
  gesturing.value = true
}

function onPointerMove(e: PointerEvent) {
  const prev = pointers.get(e.pointerId)
  if (!prev) return
  const cur = { x: e.clientX, y: e.clientY }

  if (pointers.size === 2) {
    // Щипок: масштаб по изменению расстояния, панорама по сдвигу середины
    const other = [...pointers.entries()].find(([id]) => id !== e.pointerId)?.[1]
    if (other) {
      const dPrev = Math.hypot(prev.x - other.x, prev.y - other.y)
      const dCur = Math.hypot(cur.x - other.x, cur.y - other.y)
      const mid = { x: (cur.x + other.x) / 2, y: (cur.y + other.y) / 2 }
      if (dPrev > 0) zoomAt(mid.x, mid.y, dCur / dPrev)
      tx.value += (cur.x - prev.x) / 2
      ty.value += (cur.y - prev.y) / 2
      clampPan()
    }
  } else if (scale.value > 1.02) {
    tx.value += cur.x - prev.x
    ty.value += cur.y - prev.y
    clampPan()
  } else {
    // Масштаб 1:1 - копим горизонтальный сдвиг под свайп-листание
    swipeDX += cur.x - prev.x
  }

  pointers.set(e.pointerId, cur)
}

function onPointerUp(e: PointerEvent) {
  pointers.delete(e.pointerId)
  if (!pointers.size) gesturing.value = false
  if (Math.abs(swipeDX) > 60 && scale.value <= 1.02) {
    step(swipeDX < 0 ? 1 : -1)
    swipeDX = 0
  }
}

function onKey(e: KeyboardEvent) {
  if (props.index === null) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
  else if (e.key === '+' || e.key === '=') zoomCenter(1.4)
  else if (e.key === '-') zoomCenter(1 / 1.4)
}

watch(
  () => props.index,
  (val, old) => {
    resetView()
    if (val !== null) {
      // Соседние кадры подгружаются заранее - листание без белых пауз
      const n = props.items.length
      for (const d of [1, -1]) {
        const it = props.items[(val + d + n) % n]
        if (it) new Image().src = `${base}media/${it.file}`
      }
    }
    if (val !== null && old === null) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
      nextTick(() => closeBtn.value?.focus())
    } else if (val === null && old !== null) {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})

const imgStyle = computed(() => ({
  transform: `translate(${tx.value}px, ${ty.value}px) scale(${scale.value})`,
  transition: gesturing.value ? 'none' : undefined,
}))
</script>

<template>
  <Teleport to="body">
    <Transition name="viewer">
      <div
        v-if="index !== null"
        class="viewer"
        role="dialog"
        aria-modal="true"
        :aria-label="current?.alt"
      >
        <div class="viewer__backdrop" @click="close" />

        <header class="viewer__top">
          <p class="mono viewer__caption">{{ current?.caption }}</p>
          <div class="viewer__side">
            <span class="mono viewer__count">{{ counter }}</span>
            <button ref="closeBtn" class="viewer__btn" :aria-label="m.viewer.close" @click="close">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2 L14 14 M14 2 L2 14" /></svg>
            </button>
          </div>
        </header>

        <div
          ref="stage"
          class="viewer__stage"
          @wheel.prevent="onWheel"
          @dblclick="onDblClick"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <img
            ref="img"
            class="viewer__img"
            :src="current ? `${base}media/${current.file}` : ''"
            :alt="current?.alt"
            :style="imgStyle"
            draggable="false"
          />
        </div>

        <button class="viewer__btn viewer__nav viewer__nav--prev" :aria-label="m.viewer.prev" @click="step(-1)">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 2 L4 8 L10 14" /></svg>
        </button>
        <button class="viewer__btn viewer__nav viewer__nav--next" :aria-label="m.viewer.next" @click="step(1)">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 2 L12 8 L6 14" /></svg>
        </button>

        <div class="viewer__zoom">
          <button class="viewer__btn" :aria-label="m.viewer.zoomOut" @click="zoomCenter(1 / 1.4)">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8 H13" /></svg>
          </button>
          <span class="mono viewer__zoom-val">{{ Math.round(scale * 100) }}%</span>
          <button class="viewer__btn" :aria-label="m.viewer.zoomIn" @click="zoomCenter(1.4)">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3 V13 M3 8 H13" /></svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.viewer {
  position: fixed;
  inset: 0;
  z-index: 140;
  display: grid;
  grid-template-rows: auto 1fr;
  /* Тёмная поверхность: фокус - светлым золотом, правило дизайн-системы */
  --focus: var(--gold-light);
}

.viewer__backdrop {
  position: absolute;
  inset: 0;
  background: var(--overlay);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.viewer__top {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-6);
  padding-block: var(--s-5);
  padding-inline: var(--page-pad);
}

/* Моноширинные подписи на чернильном: цвет перебиваем и держим ступень крупнее -
   тонкий Plex Mono на тёмном гаснет (правило из дизайн-системы) */
.viewer__caption,
.viewer__count,
.viewer__zoom-val {
  color: var(--paper);
  font-size: 0.8125rem;
  font-weight: 500;
}

.viewer__caption {
  margin: 0;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.viewer__side {
  display: flex;
  align-items: center;
  gap: var(--s-5);
  flex: 0 0 auto;
}

.viewer__count {
  letter-spacing: 0.18em;
}

/* --- Сцена с кадром --- */

.viewer__stage {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  overflow: hidden;
  touch-action: none;
  cursor: grab;
}

.viewer__stage:active {
  cursor: grabbing;
}

.viewer__img {
  max-inline-size: min(1200px, calc(100% - 2 * var(--page-pad)));
  max-block-size: calc(100% - var(--s-8));
  object-fit: contain;
  user-select: none;
  will-change: transform;
  transition: transform var(--dur-fast) var(--ease-out);
}

/* --- Кнопки: перо сайта на тёмном --- */

.viewer__btn {
  display: grid;
  place-items: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  color: var(--paper);
  transition: color var(--dur-fast) var(--ease-out);
}

.viewer__btn svg {
  inline-size: 1rem;
  block-size: 1rem;
  stroke: currentColor;
  stroke-width: 1.2;
  fill: none;
}

/* Тёплое на тёмном: наведение уводит в золото, как кнопки чернильной половины */
.viewer__btn:hover,
.viewer__btn:focus-visible {
  color: var(--gold-light);
}

.viewer__nav {
  position: absolute;
  z-index: 2;
  inset-block-start: 50%;
  transform: translateY(-50%);
}

.viewer__nav--prev {
  inset-inline-start: calc(var(--page-pad) - var(--s-4));
}

.viewer__nav--next {
  inset-inline-end: calc(var(--page-pad) - var(--s-4));
}

.viewer__zoom {
  position: absolute;
  z-index: 2;
  inset-block-end: var(--s-6);
  inset-inline-end: var(--page-pad);
  display: flex;
  align-items: center;
  gap: var(--s-2);
}

.viewer__zoom-val {
  min-inline-size: 3.2rem;
  text-align: center;
  letter-spacing: 0.12em;
}

/* --- Появление и уход: только прозрачность, кадр чуть подрастает --- */

.viewer-enter-active {
  transition: opacity 420ms var(--ease-out);
}

.viewer-leave-active {
  transition: opacity 320ms var(--ease-out);
}

.viewer-enter-from,
.viewer-leave-to {
  opacity: 0;
}

.viewer-enter-active .viewer__img {
  animation: viewer-img 420ms var(--ease-out) both;
}

@keyframes viewer-img {
  from {
    scale: 0.975;
  }
  to {
    scale: 1;
  }
}

@media (max-width: 700px) {
  /* На телефоне стрелки мешают кадру - листание свайпом, зум щипком */
  .viewer__nav {
    display: none;
  }

  .viewer__zoom {
    inset-inline-end: 50%;
    transform: translateX(50%);
  }
}
</style>
