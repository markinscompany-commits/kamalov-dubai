<!--
  Блок [08] «Восстановление» - подача «Шкала». ВАРИАНТ А на выборе Марка,
  второй вариант - RecoveryHorizonSection.vue («Горизонт»). Непринятый
  снимается, он останется в истории git.

  ПОДАЧА. Слева вдоль блока идёт вертикальная измерительная шкала - линейка
  с делениями, как на инструменте. По мере прокрутки вдоль линейки поднимается
  сплошная чернильная линия - «уровень времени»: докрутил - поднялась, откатил -
  опустилась (слушается пальца, паттерн маршрута [07] и караоке). Когда линия
  доходит до засечки этапа, срок наливается чернилами (до этого стоит бледным,
  как незалитое караоке), и проявляется текст. Человек видит и пройденное,
  и то, что впереди.

  Чем отличается от маршрута [07]: там пунктирная ломаная РИСУЕТСЯ из ничего
  и гуляет зигзагом; здесь шкала с делениями стоит целиком с самого начала,
  а по ней движется уровень. Разные инструменты: план пути - и линейка.

  ЗАМЕРЫ. Координаты засечек замеряются РЕДКО - при появлении, по готовности
  шрифтов и при изменении ШИРИНЫ окна (не высоты: на телефоне высота меняется
  от адресной строки - грабли из design-system.md, раздел 6). Во время
  прокрутки читается только scrollY.

  ⚠️ Появление текста - переходами к состоянию .is-live, не «замершими»
  анимациями (правило манифеста для iOS Safari).

  ⚠️ Срок до «оживания» набран --ink-faint - это НЕ нарушение правила
  «ink-faint текстом не ставить»: тот же случай, что незалитое караоке
  в «Подходе», текст доливается до --ink на глазах у человека.

  ⚠️ ДВА ТРЕБОВАНИЯ РЕГУЛЯТОРА, КОТОРЫЕ НЕЛЬЗЯ НАРУШИТЬ ПРИ ПРАВКАХ:
  1. Оговорка об индивидуальности - ТЕМ ЖЕ КЕГЛЕМ, что основной текст
     (ST-21 п. 9.6 и 7.1.5). Увести в мелкий серый нельзя.
  2. Сроки - ориентир, не обещание: только «обычно», «зависит».

  🔴 САМИ ЦИФРЫ - ЗАГЛУШКА до подтверждения доктором, см. messages.ts.

  Разметки (узел + 4 луча) в блоке нет: шкала сама - система линий,
  вторая рядом лишняя (то же решение, что в [07]).
-->
<script setup lang="ts">
const { m } = useLocale()

const scaleEl = ref<HTMLElement | null>(null)
const tickEls = ref<HTMLElement[]>([])

/** Порог «оживания» строки - вертикаль её засечки внутри шкалы, px */
const tickAt = ref<number[]>([])
/** Сколько px шкалы «прочитано» - единственное, что меняется при прокрутке */
const readPx = ref(0)
/** Полная высота шкалы - от неё считается заливка чернильной линии */
const totalPx = ref(1)

let frame = 0
let observer: IntersectionObserver | null = null
let live = false
let docTop = 0
let vh = 0
let lastWidth = 0
let reduced = false

function measure() {
  const root = scaleEl.value
  if (!root) return
  const rect = root.getBoundingClientRect()
  totalPx.value = Math.max(1, rect.height)
  tickAt.value = tickEls.value.filter(Boolean).map((el) => {
    const r = el.getBoundingClientRect()
    return r.top + r.height / 2 - rect.top
  })
}

/*
  Положение блока в документе замеряется редко, при прокрутке читается только
  scrollY - паттерн KaraokeText и маршрута [07] (design-system.md, раздел 6).
*/
function remeasure() {
  const root = scaleEl.value
  if (!root) return
  const rect = root.getBoundingClientRect()
  docTop = rect.top + window.scrollY
  vh = window.innerHeight
  lastWidth = window.innerWidth
  measure()
  apply()
}

function apply() {
  if (reduced) {
    // Движение отключено настройками - шкала стоит залитой целиком
    readPx.value = Number.MAX_SAFE_INTEGER
    return
  }
  // «Строка чтения» - 72% высоты экрана: уровень там, куда смотрят
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
  // Шрифты доехали - раскладка могла сдвинуться, засечки замеряем заново
  document.fonts?.ready.then(() => remeasure())

  observer = new IntersectionObserver((entries) => listen(entries[0]?.isIntersecting ?? false), {
    rootMargin: '200px 0px',
  })
  if (scaleEl.value) observer.observe(scaleEl.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  listen(false)
})

/** Чернильная линия открывается сверху вниз ровно на «прочитанную» долю шкалы */
const inkClip = computed(() => {
  const f = Math.min(1, readPx.value / totalPx.value)
  return `inset(0 0 ${(1 - f) * 100}% 0)`
})
</script>

<template>
  <PageSection id="recovery" :label="m.recovery.label" tone="deep" no-rules>
    <SectionTitle :text="m.recovery.title" />

    <p class="rec-a__lead">{{ m.recovery.lead }}</p>

    <div ref="scaleEl" class="rec-a">
      <!-- Линейка: деления стоят всегда, чернильная линия поднимается по прокрутке -->
      <div class="rec-a__ruler" aria-hidden="true">
        <span class="rec-a__marks rec-a__marks--minor" />
        <span class="rec-a__marks rec-a__marks--major" />
        <span class="rec-a__ink" :style="{ clipPath: inkClip }" />
      </div>

      <ol class="rec-a__list">
        <li
          v-for="(row, i) in m.recovery.rows"
          :key="i"
          class="rec-a__row"
          :class="{ 'is-live': readPx >= (tickAt[i] ?? Infinity) }"
        >
          <p class="rec-a__when">
            <!-- Засечка этапа: длинное деление линейки, от линии к сроку -->
            <span
              :ref="(el) => { if (el) tickEls[i] = el as HTMLElement }"
              class="rec-a__tick"
              aria-hidden="true"
            />
            {{ row.when }}
          </p>
          <p class="rec-a__what">{{ row.what }}</p>
        </li>
      </ol>
    </div>

    <!-- Оговорка об индивидуальности. Кегль основного текста - требование DHA -->
    <div class="rec-a__notes">
      <div class="rec-a__note">
        <p class="mono rec-a__note-label">{{ m.recovery.noteLabel }}</p>
        <p class="rec-a__note-text">{{ m.recovery.note }}</p>
      </div>
      <!-- Про солнце отдельно: для аудитории в ОАЭ это не мелочь -->
      <div class="rec-a__note">
        <p class="mono rec-a__note-label">{{ m.recovery.sunLabel }}</p>
        <p class="rec-a__note-text">{{ m.recovery.sun }}</p>
      </div>
    </div>
  </PageSection>
</template>

<style scoped>
.rec-a__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(52ch, 100%);
}

/* Гуттер слева: в нём живёт линейка, текст её не встречает */
.rec-a {
  --rec-gutter: 3.1rem;
  position: relative;
  padding-inline-start: var(--rec-gutter);
  margin-block-start: var(--s-8);
  max-inline-size: 68ch;
}

.rec-a__ruler {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  inline-size: var(--rec-gutter);
  pointer-events: none;
}

/*
  Деления линейки - тонкие горизонтальные риски. Два слоя: частые короткие
  и каждое пятое длиннее, оба от одного верха, поэтому фазы совпадают.
*/
.rec-a__marks {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
}

.rec-a__marks--minor {
  inline-size: 0.55rem;
  background-image: repeating-linear-gradient(
    to bottom,
    var(--rule) 0 1px,
    transparent 1px 14px
  );
}

.rec-a__marks--major {
  inline-size: 1rem;
  background-image: repeating-linear-gradient(
    to bottom,
    var(--rule) 0 1px,
    transparent 1px 70px
  );
}

/* «Уровень времени»: сплошная чернильная линия по кромке линейки.
   Стоит на координате серединой (сдвиг на полтолщины - правило CrossRules) */
.rec-a__ink {
  position: absolute;
  inset-block: 0;
  inset-inline-start: calc(var(--rule-w) / -2);
  inline-size: var(--rule-w);
  background: var(--ink);
}

.rec-a__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(2.5rem, 5vh, 4rem);
}

.rec-a__row {
  display: grid;
  grid-template-columns: 11rem minmax(0, 1fr);
  column-gap: var(--s-8);
  align-items: start;
}

/*
  Кегль свой, меньше --fs-h2: на общем размере «6-12 месяцев» не влезало
  в колонку и диапазон рвался пополам (грабли первой сборки блока).
*/
.rec-a__when {
  position: relative;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 2.3vw, 2.1rem);
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin: 0;
  /* Бледный до «оживания» - как незалитое караоке; доливается чернилами,
     когда уровень доходит до засечки */
  color: var(--ink-faint);
  transition: color 600ms var(--ease-out);
}

.rec-a__row.is-live .rec-a__when {
  color: var(--ink);
}

/* Засечка этапа: длинное деление от линии линейки к сроку */
.rec-a__tick {
  position: absolute;
  inset-inline-start: calc(-1 * var(--rec-gutter));
  inset-block-start: 0.52em;
  inline-size: 1.3rem;
  block-size: var(--rule-w);
  background: var(--rule);
  transition:
    background-color 600ms var(--ease-out),
    inline-size 600ms var(--ease-out);
}

.rec-a__row.is-live .rec-a__tick {
  background: var(--ink);
  inline-size: 1.9rem;
}

/* Появление текста: переходом к состоянию, не «замершей» анимацией (iOS) */
.rec-a__what {
  font-size: var(--fs-body);
  line-height: 1.65;
  margin: 0;
  padding-block-start: 0.4rem;
  color: var(--ink-soft);
  max-inline-size: min(46ch, 100%);
  opacity: 0;
  translate: 0 0.4rem;
  transition:
    opacity var(--dur-slow) var(--ease-out),
    translate var(--dur-slow) var(--ease-out);
}

.rec-a__row.is-live .rec-a__what {
  opacity: 1;
  translate: 0 0;
  transition-delay: 120ms;
}

/* ⚠️ Кегль основного текста, а не мелкий: ST-21 п. 9.6 и 7.1.5 */
.rec-a__notes {
  margin-block-start: var(--s-12);
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
  max-inline-size: 68ch;
}

.rec-a__note {
  display: grid;
  grid-template-columns: 11rem minmax(0, 1fr);
  gap: var(--s-8);
  align-items: start;
}

.rec-a__note-label {
  margin: 0;
  padding-block-start: 0.2rem;
}

.rec-a__note-text {
  font-size: var(--fs-body);
  line-height: 1.65;
  margin: 0;
  color: var(--ink-soft);
  max-inline-size: min(58ch, 100%);
}

@media (max-width: 900px) {
  .rec-a {
    --rec-gutter: 1.9rem;
  }

  .rec-a__marks--minor {
    inline-size: 0.4rem;
  }

  .rec-a__marks--major {
    inline-size: 0.75rem;
  }

  /* Колонок нет: срок над текстом, всё во всю ширину */
  .rec-a__row {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-2);
  }

  .rec-a__when {
    font-size: 1.5rem;
  }

  .rec-a__tick {
    inline-size: 1rem;
  }

  .rec-a__row.is-live .rec-a__tick {
    inline-size: 1.4rem;
  }

  .rec-a__what {
    padding-block-start: 0;
  }

  .rec-a__note {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-2);
  }

  .rec-a__note-label {
    padding-block-start: 0;
  }
}
</style>
