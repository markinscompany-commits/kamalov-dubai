<!--
  Блок [07] «Как проходит лечение» - подача «Маршрут».
  Вариант А, выбран Марком 06.08 из двух собранных вживую; вариант Б
  «Весь путь перед глазами» (прилипшее оглавление) снят, он в истории git.

  Подача: через блок сверху вниз идёт одна пунктирная ломаная - маршрут,
  прочерченный на плане. Линия РИСУЕТСЯ ПО МЕРЕ ПРОКРУТКИ (слушается пальца,
  как караоке в «Подходе»): докрутил - дочертилась, откатил - стёрлась.
  На изломах узлы-крестики тем же пером, что разметка сайта; линия доходит
  до узла - и из него проявляется шаг. Шаги гуляют по сетке влево-вправо,
  линия соединяет их зигзагом.

  ГЕОМЕТРИЯ. Узлы стоят в левом поле каждого шага (гуттер 2.2rem), путь между
  соседними узлами - три отрезка: вниз по гуттеру своего шага → горизонталь
  в ЗАЗОРЕ между шагами → вниз по гуттеру следующего. Так ни один отрезок
  не идёт по тексту (правило манифеста): вертикали живут в пустых гуттерах,
  горизонтали - в пустых зазорах. Фотографии линию перекрывают сами
  (контент z-index 1, линия 0).

  ЗАМЕРЫ. Координаты узлов замеряются РЕДКО - при появлении, по готовности
  шрифтов и при изменении ШИРИНЫ окна (не высоты: на телефоне высота меняется
  от адресной строки десятки раз - грабли из design-system.md, раздел 6).
  Во время прокрутки читается только scrollY - как в KaraokeText.

  ⚠️ Появление шагов - переходами к состоянию .is-live, не «замершими»
  анимациями (правило манифеста для iOS Safari).

  ⚠️ ФОТОГРАФИИ ВРЕМЕННЫЕ - из открытой галереи Dubai London Hospital,
  клиника согласовывает постфактум (решение Марка 02.08).
-->
<script setup lang="ts">
const { m } = useLocale()

const base = useRuntimeConfig().app.baseURL

/* Тот же адрес, что в шапке и первом экране. 🔴 Номер - заглушка до передачи
   номера ОАЭ клиникой (client-request, строка 3.2) */
const whatsapp = 'https://wa.me/79285030807'

const pad = (i: number) => String(i + 1).padStart(2, '0')

const routeEl = ref<HTMLElement | null>(null)
const nodeEls = ref<HTMLElement[]>([])

interface Segment {
  left: number
  top: number
  size: number // длина отрезка, px
  kind: 'v' | 'h-ltr' | 'h-rtl'
  /** С какого «прочитанного» px контейнера отрезок начинает рисоваться и на каком дорисован */
  from: number
  to: number
}

const segments = ref<Segment[]>([])
/** Порог появления каждого узла - его координата по вертикали */
const nodeAt = ref<number[]>([])
/** Сколько px контейнера уже «прочитано» - единственное, что меняется при прокрутке */
const readPx = ref(0)

/** Радиус узла: линия начинается от края крестика, не из центра (как у CrossRules) */
const NODE_GAP = 9
/** Окно прокрутки, за которое дорисовывается горизонтальный отрезок */
const H_WINDOW = 36

function measure() {
  const route = routeEl.value
  if (!route) return
  const routeRect = route.getBoundingClientRect()

  // Узлы идут в порядке шагов - сверху вниз, сортировка не нужна
  const points = nodeEls.value.filter(Boolean).map((el) => {
    const r = el.getBoundingClientRect()
    return { x: r.left + r.width / 2 - routeRect.left, y: r.top + r.height / 2 - routeRect.top }
  })

  nodeAt.value = points.map((p) => p.y)

  const segs: Segment[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!
    const b = points[i + 1]!
    // Горизонталь идёт в зазоре между шагами - посередине между узлами
    const midY = (a.y + b.y) / 2
    const dx = Math.abs(b.x - a.x)

    // Вниз по гуттеру шага i
    segs.push({
      left: a.x,
      top: a.y + NODE_GAP,
      size: midY - a.y - NODE_GAP,
      kind: 'v',
      from: a.y,
      to: midY,
    })
    // Горизонталь в зазоре (на телефоне узлы стоят друг под другом - отрезок пропадает)
    if (dx > 2) {
      segs.push({
        left: Math.min(a.x, b.x),
        top: midY,
        size: dx,
        kind: b.x > a.x ? 'h-ltr' : 'h-rtl',
        from: midY,
        to: midY + H_WINDOW,
      })
    }
    // Вниз по гуттеру шага i+1
    segs.push({
      left: b.x,
      top: midY,
      size: b.y - midY - NODE_GAP,
      kind: 'v',
      from: midY + (dx > 2 ? H_WINDOW : 0),
      to: b.y,
    })
  }
  segments.value = segs
}

/*
  Положение блока в документе замеряется редко, при прокрутке читается только
  scrollY - паттерн KaraokeText, разобран в design-system.md, раздел 6.
*/
let frame = 0
let observer: IntersectionObserver | null = null
let live = false
let docTop = 0
let vh = 0
let lastWidth = 0
let reduced = false

function remeasure() {
  const route = routeEl.value
  if (!route) return
  const rect = route.getBoundingClientRect()
  docTop = rect.top + window.scrollY
  vh = window.innerHeight
  lastWidth = window.innerWidth
  measure()
  apply()
}

function apply() {
  const route = routeEl.value
  if (!route) return
  if (reduced) {
    // Движение отключено настройками - маршрут стоит прочерченным целиком
    readPx.value = Number.MAX_SAFE_INTEGER
    return
  }
  // «Строка чтения» - 72% высоты экрана: линия дочерчивается там, куда смотрят
  const reader = window.scrollY + vh * 0.72
  readPx.value = Math.max(0, reader - docTop)
}

function onScroll() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(apply)
}

/* Изменилась только высота - это адресная строка телефона, раскладку не трогаем */
function onResize() {
  vh = window.innerHeight
  if (window.innerWidth === lastWidth) return
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(remeasure)
}

function listen(on: boolean) {
  if (on === live) return
  live = on
  if (on) {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    remeasure()
  } else {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    cancelAnimationFrame(frame)
  }
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  remeasure()
  // Шрифты доехали - раскладка могла сдвинуться, узлы замеряем заново
  document.fonts?.ready.then(() => remeasure())

  observer = new IntersectionObserver((entries) => listen(entries[0]?.isIntersecting ?? false), {
    rootMargin: '200px 0px',
  })
  if (routeEl.value) observer.observe(routeEl.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  listen(false)
})

/** Насколько отрезок прочерчен: 0 - не начат, 1 - дорисован */
function drawn(s: Segment) {
  if (s.to <= s.from) return readPx.value >= s.to ? 1 : 0
  return Math.min(1, Math.max(0, (readPx.value - s.from) / (s.to - s.from)))
}

function segStyle(s: Segment) {
  const f = drawn(s)
  const cut = `${(1 - f) * 100}%`
  const clip =
    s.kind === 'v'
      ? `inset(0 0 ${cut} 0)`
      : s.kind === 'h-ltr'
        ? `inset(0 ${cut} 0 0)`
        : `inset(0 0 0 ${cut})`
  // Линия стоит на координате узла СЕРЕДИНОЙ, а не краем: при толщине 1px
  // сдвиг на полпикселя заметен на глаз (правило CrossRules)
  return s.kind === 'v'
    ? { left: `${s.left - 0.5}px`, top: `${s.top}px`, height: `${s.size}px`, clipPath: clip }
    : { left: `${s.left}px`, top: `${s.top - 0.5}px`, width: `${s.size}px`, clipPath: clip }
}
</script>

<template>
  <!-- Разметки с узлом и лучами в этом блоке НЕТ (правка Марка 06.08):
       маршрут сам - пунктирная линия, вторая система линий здесь лишняя -->
  <PageSection id="treatment" :label="m.treatment.label" tone="paper" no-rules>
    <SectionTitle :text="m.treatment.title" />

    <p class="path__lead">{{ m.treatment.lead }}</p>

    <div ref="routeEl" class="path">
      <!-- Слой маршрута: ПОД содержимым - фотографии перекрывают линию сами -->
      <div class="path__lines" aria-hidden="true">
        <span
          v-for="(s, i) in segments"
          :key="i"
          class="path__seg"
          :class="`path__seg--${s.kind}`"
          :style="segStyle(s)"
        />
      </div>

      <ol class="path__list">
        <li
          v-for="(step, i) in m.treatment.steps"
          :key="i"
          class="path__step"
          :class="{ 'is-live': readPx >= (nodeAt[i] ?? Infinity) }"
        >
          <div class="path__inner">
            <!-- Узел: сплошной крестик тем же пером, что разметка (CrossRules) -->
            <span
              :ref="(el) => { if (el) nodeEls[i] = el as HTMLElement }"
              class="path__node"
              aria-hidden="true"
            />

            <div class="path__text">
              <p class="mono path__num">{{ m.treatment.stepWord }} {{ pad(i) }}</p>
              <h3 class="path__name">{{ step.title }}</h3>
              <p class="path__body">{{ step.text }}</p>

              <!-- Кнопки прямо в первом шаге (правка Марка 06.08): «оставить
                   заявку» - это и есть шаг 01, действие даётся на месте -->
              <div v-if="i === 0" class="path__actions">
                <MarkAction href="#booking">{{ m.action.bookLong }}</MarkAction>
                <MarkAction variant="ghost" :href="whatsapp">{{ m.action.whatsapp }}</MarkAction>
              </div>
            </div>

            <figure v-if="step.photo" class="path__figure">
              <img
                :src="`${base}media/clinic/${step.photo}`"
                :alt="step.photoAlt"
                width="1200"
                height="800"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </li>
      </ol>
    </div>
  </PageSection>
</template>

<style scoped>
.path__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(52ch, 100%);
}

.path {
  position: relative;
  margin-block-start: var(--s-8);
}

.path__lines {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* Отрезки маршрута: тот же пунктир, что вся разметка. Штрихи идут ОТ узла -
   направление градиента у каждого вида своё, иначе шаг пунктира не совпадает
   по фазе (правило CrossRules) */
.path__seg {
  position: absolute;
  display: block;
}

.path__seg--v {
  inline-size: var(--rule-w);
  background-image: repeating-linear-gradient(
    to bottom,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

.path__seg--h-ltr,
.path__seg--h-rtl {
  block-size: var(--rule-w);
}

.path__seg--h-ltr {
  background-image: repeating-linear-gradient(
    to right,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

.path__seg--h-rtl {
  background-image: repeating-linear-gradient(
    to left,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

.path__list {
  position: relative;
  z-index: 1;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  /* Зазор щедрый: в нём живут горизонтали маршрута */
  gap: clamp(4.5rem, 9vh, 7rem);
}

/* Шаги гуляют по сетке: нечётные к началу, чётные со сдвигом - зигзаг маршрута.
   Асимметрия по сетке, не на глаз (design-system.md, раздел 3) */
.path__step {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.path__inner {
  grid-column: 1 / span 9;
  position: relative;
  min-inline-size: 0;
  /* Гуттер слева: в нём стоит узел и идёт вертикаль маршрута - текст линию не встречает */
  padding-inline-start: 2.2rem;
  display: flex;
  align-items: flex-start;
  gap: var(--s-8);
}

.path__step:nth-child(even) .path__inner {
  grid-column: 4 / span 9;
}

/* Узел: сплошной крест 11px тем же пером, что лучи разметки */
.path__node {
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0.1rem;
  inline-size: 11px;
  block-size: 11px;
}

.path__node::before,
.path__node::after {
  content: '';
  position: absolute;
  background: var(--rule);
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-out);
}

.path__node::before {
  inset-inline-start: calc(50% - var(--rule-w) / 2);
  inset-block: 0;
  inline-size: var(--rule-w);
}

.path__node::after {
  inset-block-start: calc(50% - var(--rule-w) / 2);
  inset-inline: 0;
  block-size: var(--rule-w);
}

.path__step.is-live .path__node::before,
.path__step.is-live .path__node::after {
  opacity: 1;
}

.path__text {
  min-inline-size: 0;
  flex: 1 1 24rem;
}

.path__num {
  margin: 0 0 var(--s-2);
}

.path__name {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0 0 var(--s-3);
}

.path__body {
  font-size: var(--fs-body);
  line-height: 1.65;
  margin: 0;
  max-inline-size: min(46ch, 100%);
}

.path__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-3);
  margin-block-start: var(--s-6);
}

.path__figure {
  margin: 0;
  flex: 0 0 clamp(13rem, 20vw, 17rem);
  padding: var(--s-2);
  background: var(--paper-raised);
}

.path__figure img {
  display: block;
  inline-size: 100%;
  block-size: auto;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}

/* Появление шага: линия дошла до узла - шаг проявляется. Переходами к состоянию,
   не «замершими» анимациями (iOS сбрасывает animation both - правило манифеста) */
.path__text,
.path__figure {
  opacity: 0;
  translate: 0 0.4rem;
  transition:
    opacity var(--dur-slow) var(--ease-out),
    translate var(--dur-slow) var(--ease-out);
}

.path__step.is-live .path__text {
  opacity: 1;
  translate: 0 0;
  transition-delay: 100ms;
}

.path__step.is-live .path__figure {
  opacity: 1;
  translate: 0 0;
  transition-delay: 260ms;
}

@media (max-width: 900px) {
  /* Колонок нет: шаги во всю ширину, узлы встают друг под другом -
     маршрут сам превращается в прямую вертикаль по левому полю */
  .path__inner,
  .path__step:nth-child(even) .path__inner {
    grid-column: 1 / -1;
  }

  .path__inner {
    flex-direction: column;
    gap: var(--s-4);
    padding-inline-start: 1.9rem;
  }

  /* ⚠️ flex-basis 24rem в колонке становится ВЫСОТОЙ и раздувает шаг пустотой -
     на телефоне базис снимается и тексту, и фотографии */
  .path__text {
    flex: initial;
  }

  .path__figure {
    flex: initial;
    inline-size: 100%;
    max-inline-size: 24rem;
  }

  .path__list {
    gap: clamp(3.5rem, 7vh, 5rem);
  }
}
</style>
