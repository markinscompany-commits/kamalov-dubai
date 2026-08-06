<!--
  Блок [07] «Как проходит лечение» - ВАРИАНТ Б «Весь путь перед глазами».

  Подача: слева прилипает оглавление пути - все шесть шагов столбиком вдоль
  пунктирной линии, по которой растёт сплошная «пройденная» часть. Справа
  проезжают подробности шагов с фотографиями. Пока человек читает, текущий
  шаг в оглавлении наливается чернилами, пройденные остаются залитыми -
  в любой момент видно, где ты и сколько осталось.

  Активный шаг определяется НАБЛЮДАТЕЛЕМ за серединой экрана (как в блоке
  операций), а не расчётом на каждом кадре прокрутки. Сплошная линия прогресса -
  единственное, что считается по прокрутке, и она пишется через style.setProperty
  напрямую, без перерисовки Vue (паттерн KaraokeText: замер редкий, чтение
  только scrollY).

  ⚠️ Честный минус этой подачи (для выбора Марка): механика «слева прилипло,
  справа листается» уже занята блоком [04] «Хирургия носа» - два блока с одной
  механикой на странице читаются как повтор. Записано в манифесте, линза «без
  повторов».

  ⚠️ На телефоне прилипания колонки нет: оглавление сжимается в тонкую
  прилипшую строку «Шаг 02 / 06 - Консультация» с линией прогресса.

  ⚠️ ФОТОГРАФИИ ВРЕМЕННЫЕ - из открытой галереи Dubai London Hospital,
  клиника согласовывает постфактум (решение Марка 02.08).
-->
<script setup lang="ts">
const { m } = useLocale()

const base = useRuntimeConfig().app.baseURL

const pad = (i: number) => String(i + 1).padStart(2, '0')

/** Какой шаг сейчас читают */
const active = ref(0)

const guideEl = ref<HTMLElement | null>(null)
const stepEls: HTMLElement[] = []

function setStepRef(el: unknown, i: number) {
  if (el instanceof HTMLElement) stepEls[i] = el
}

/* Полоса в середине экрана: активен тот шаг, который её пересёк (как в [04]) */
let midWatch: IntersectionObserver | null = null

/*
  Сплошная часть линии прогресса. Замер положения колонки - редкий (появление,
  готовность шрифтов, изменение ШИРИНЫ окна), при прокрутке читается только
  scrollY. Значение пишется CSS-переменной напрямую, минуя перерисовку Vue.
*/
let frame = 0
let nearWatch: IntersectionObserver | null = null
let live = false
let docTop = 0
let blockH = 0
let vh = 0
let lastWidth = 0

function remeasure() {
  const node = guideEl.value
  if (!node) return
  const rect = node.getBoundingClientRect()
  docTop = rect.top + window.scrollY
  blockH = rect.height
  vh = window.innerHeight
  lastWidth = window.innerWidth
  apply()
}

function apply() {
  const node = guideEl.value
  if (!node || !blockH) return
  const reader = window.scrollY + vh * 0.6
  const p = Math.min(1, Math.max(0, (reader - docTop) / blockH))
  node.style.setProperty('--guide-p', `${(p * 100).toFixed(2)}%`)
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
  midWatch = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const i = stepEls.indexOf(entry.target as HTMLElement)
        if (i >= 0) active.value = i
      }
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
  )
  for (const el of stepEls) if (el) midWatch.observe(el)

  remeasure()
  document.fonts?.ready.then(() => remeasure())
  nearWatch = new IntersectionObserver((entries) => listen(entries[0]?.isIntersecting ?? false), {
    rootMargin: '200px 0px',
  })
  if (guideEl.value) nearWatch.observe(guideEl.value)
})

onBeforeUnmount(() => {
  midWatch?.disconnect()
  nearWatch?.disconnect()
  listen(false)
})

function jump(i: number) {
  stepEls[i]?.scrollIntoView({ block: 'start' })
}
</script>

<template>
  <PageSection
    id="treatment-b"
    :label="m.treatment.label"
    tone="deep"
    cross-y="5.5rem"
    :cross-fraction="0.161"
  >
    <SectionTitle :text="m.treatment.title" />

    <p class="guide__lead">{{ m.treatment.lead }}</p>

    <div ref="guideEl" class="guide">
      <!-- Оглавление пути: прилипает, пока справа идут подробности -->
      <nav class="guide__aside" :aria-label="m.treatment.label">
        <ol class="guide__index">
          <li
            v-for="(step, i) in m.treatment.steps"
            :key="i"
            class="guide__item"
            :class="{ 'is-past': i < active, 'is-now': i === active }"
          >
            <button type="button" class="guide__link" @click="jump(i)">
              <span class="guide__marker" aria-hidden="true" />
              <span class="mono guide__index-num">{{ pad(i) }}</span>
              <span class="guide__index-name">{{ step.title }}</span>
            </button>
          </li>
        </ol>
      </nav>

      <!-- Телефон: оглавление сжимается в прилипшую строку с прогрессом -->
      <div class="guide__bar" aria-hidden="true">
        <p class="mono guide__bar-text">
          {{ m.treatment.stepWord }} {{ pad(active) }} / {{ pad(m.treatment.steps.length - 1) }} -
          {{ m.treatment.steps[active]?.title }}
        </p>
        <span class="guide__bar-track"><span class="guide__bar-fill" /></span>
      </div>

      <div class="guide__steps">
        <article
          v-for="(step, i) in m.treatment.steps"
          :key="i"
          :ref="(el) => setStepRef(el, i)"
          class="guide__step"
          :class="{ 'is-now': i === active }"
        >
          <p class="mono guide__num">{{ m.treatment.stepWord }} {{ pad(i) }}</p>
          <h3 class="guide__name">{{ step.title }}</h3>
          <p class="guide__body">{{ step.text }}</p>

          <figure v-if="step.photo" class="guide__figure">
            <img
              :src="`${base}media/clinic/${step.photo}`"
              :alt="step.photoAlt"
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </article>
      </div>
    </div>
  </PageSection>
</template>

<style scoped>
.guide__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(52ch, 100%);
}

.guide {
  display: grid;
  grid-template-columns: minmax(12rem, 16rem) minmax(0, 1fr);
  gap: var(--s-12);
  margin-block-start: var(--s-8);
  /* Сплошная часть линии прогресса, пишется из JS */
  --guide-p: 0%;
}

/* --- Оглавление пути --- */

.guide__aside {
  min-inline-size: 0;
}

.guide__index {
  position: sticky;
  inset-block-start: calc(var(--header-h) + var(--s-8));
  list-style: none;
  margin: 0;
  padding: 0 0 0 1.4rem;
  display: flex;
  flex-direction: column;
  gap: var(--s-5);

  /* Вдоль оглавления - пунктирный путь, по нему растёт сплошная пройденная часть */
  background-image:
    linear-gradient(to bottom, var(--ink) 0 var(--guide-p), transparent var(--guide-p)),
    repeating-linear-gradient(
      to bottom,
      var(--rule) 0 var(--dash-on),
      transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
    );
  background-repeat: no-repeat;
  background-size:
    var(--rule-w) 100%,
    var(--rule-w) 100%;
  background-position:
    0 0,
    0 0;
}

.guide__item {
  min-inline-size: 0;
}

.guide__link {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: var(--s-3);
  align-items: baseline;
  padding: 0;
  text-align: start;
  color: var(--ink-faint);
  transition: color var(--dur-base) var(--ease-out);
}

/* Пройденное и текущее - налито чернилами */
.guide__item.is-past .guide__link,
.guide__item.is-now .guide__link {
  color: var(--ink);
}

.guide__link:hover,
.guide__link:focus-visible {
  color: var(--blue);
}

.guide__index-num {
  color: inherit;
}

.guide__index-name {
  font-size: var(--fs-body);
  line-height: 1.35;
}

/* Метка текущего шага: короткий сплошной штрих золотом - одно золотое
   пятно на экран (правило дизайн-системы) */
.guide__marker {
  position: absolute;
  inset-inline-start: -1.4rem;
  inset-block-start: 0.55em;
  inline-size: 0;
  block-size: var(--rule-w);
  background: var(--gold-deep);
  transition: inline-size var(--dur-base) var(--ease-out);
}

.guide__item {
  position: relative;
}

.guide__item.is-now .guide__marker {
  inline-size: 0.9rem;
}

/* --- Подробности шагов --- */

.guide__steps {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(4rem, 8vh, 6.5rem);
}

.guide__step {
  min-inline-size: 0;
  scroll-margin-block-start: calc(var(--header-h) + var(--s-8));
  /* Непрочитанные шаги приглушены, читаемый - в полную силу: взгляд сам
     держится за текущее место. Прозрачностью, не цветом */
  opacity: 0.45;
  transition: opacity var(--dur-slow) var(--ease-out);
}

.guide__step.is-now {
  opacity: 1;
}

.guide__num {
  margin: 0 0 var(--s-2);
}

.guide__name {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0 0 var(--s-3);
}

.guide__body {
  font-size: var(--fs-body);
  line-height: 1.65;
  margin: 0;
  max-inline-size: min(54ch, 100%);
}

.guide__figure {
  margin: var(--s-6) 0 0;
  max-inline-size: 26rem;
  padding: var(--s-2);
  background: var(--paper-raised);
}

.guide__figure img {
  display: block;
  inline-size: 100%;
  block-size: auto;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}

/* --- Телефонная строка прогресса (на десктопе скрыта) --- */

.guide__bar {
  display: none;
}

@media (max-width: 900px) {
  .guide {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-8);
  }

  .guide__aside {
    display: none;
  }

  /*
    Прилипшая строка: какой шаг читается и сколько пройдено. Фон непрозрачный -
    под ней проезжает контент. Прилипает под шапку: её высота на телефоне
    постоянна (var(--header-h)), медиазапросов по высоте нет.
  */
  .guide__bar {
    display: block;
    position: sticky;
    inset-block-start: var(--header-h);
    z-index: 5;
    background: var(--paper-deep);
    padding-block: var(--s-3);
  }

  .guide__bar-text {
    margin: 0 0 var(--s-2);
    color: var(--ink);
  }

  .guide__bar-track {
    display: block;
    block-size: var(--rule-w);
    background-image: repeating-linear-gradient(
      to right,
      var(--rule) 0 var(--dash-on),
      transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
    );
  }

  .guide__bar-fill {
    display: block;
    block-size: 100%;
    inline-size: var(--guide-p);
    background: var(--ink);
  }

  .guide__figure {
    max-inline-size: 24rem;
  }
}
</style>
