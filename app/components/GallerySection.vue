<!--
  Блок [05] «Примеры работ» - галерея «до/после». Подача «Журнал случаев»
  (вариант А, выбор Марка 05.08): спокойный вертикальный архив, каждая пара -
  запись. Сравнение держит вертикальный пунктир между «до» и «после» - наша
  разметка вместо запрещённого бегунка-шторки (типовой приём ниши, ST-21).

  Правки Марка 05.08 (вторая итерация): кадры вертикальные 3:4 вместо квадрата,
  заголовок «До и после», лид убран, «Результаты» → «Примеры работ», оговорка
  без точки. Строка про риски ОСТАЛАСЬ: ST-21 п. 9.6.4 требует к «до/после»
  оговорку «and the risks» - убирать нельзя.

  · пары гуляют по сетке влево-вправо - разворот журнала, а не таблица;
  · под КАЖДОЙ парой оговорка кеглем основного текста - дословное требование
    ST-21 п. 9.6, повторяется намеренно, как штамп документа;
  · кадры открываются в PhotoViewer (уголки + значок разворота, как у госпиталя);
  · появление: «до» → пунктир прочерчивается → «после». Переходами к состоянию
    .is-live, не «замершими» анимациями - правило манифеста для iOS.

  ⚠️ КАДРЫ - ЗАГЛУШКА с dr-kamalov.com до материалов клиники с письменными
  согласиями пациентов. Обрезаны до профиля (обе половины пары одинаково),
  цвет и свет не тронуты - ST-21 требует «без обработки». Замена кадров -
  положить новые файлы в public/media/gallery/ с теми же именами.

  Блок снимается одним движением: закомментировать <GallerySection /> в index.vue.
-->
<script setup lang="ts">
const { m } = useLocale()

const base = useRuntimeConfig().app.baseURL

/** Открытый кадр просмотрщика; null - закрыт. Индекс по плоскому списку кадров */
const viewerIndex = ref<number | null>(null)

const pad = (n: number) => String(n).padStart(2, '0')

/** Плоский список для просмотрщика: у каждого случая кадр «до» и кадр «после» */
const viewerItems = computed(() =>
  m.value.results.cases.flatMap((c, i) => [
    {
      file: `gallery/${c.id}-before.jpg`,
      alt: m.value.results.photoAlt.before,
      caption: `${m.value.results.caseWord} ${pad(i + 1)} - ${m.value.results.before}`,
    },
    {
      file: `gallery/${c.id}-after.jpg`,
      alt: m.value.results.photoAlt.after,
      caption: `${m.value.results.caseWord} ${pad(i + 1)} - ${m.value.results.after}`,
    },
  ]),
)

/*
  Появление записей: каждая запись чертится заново при возврате на экран -
  общее правило разметки сайта. Записей шесть, поэтому не композабл на один
  элемент, а пара наблюдателей на все строки разом. Запас -4px у наблюдателя
  ухода обязателен - грабли из design-system.md, раздел 4.
*/
const rows = ref<HTMLElement[]>([])
const liveRows = ref<boolean[]>([])

let enterWatch: IntersectionObserver | null = null
let leaveWatch: IntersectionObserver | null = null

onMounted(() => {
  liveRows.value = m.value.results.cases.map(() => false)

  const indexOf = (el: Element) => Number((el as HTMLElement).dataset.row ?? -1)

  enterWatch = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) liveRows.value[indexOf(e.target)] = true
      }
    },
    { threshold: 0.3 },
  )
  leaveWatch = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) liveRows.value[indexOf(e.target)] = false
      }
    },
    { threshold: 0, rootMargin: '-4px' },
  )
  for (const el of rows.value) {
    enterWatch.observe(el)
    leaveWatch.observe(el)
  }
})

onBeforeUnmount(() => {
  enterWatch?.disconnect()
  leaveWatch?.disconnect()
})
</script>

<template>
  <PageSection id="results" :label="m.results.label" tone="paper" cross-y="5.5rem">
    <SectionTitle :text="m.results.title" />

    <ol class="gal__list">
      <li
        v-for="(c, i) in m.results.cases"
        :key="c.id"
        :ref="(el) => { if (el) rows[i] = el as HTMLElement }"
        :data-row="i"
        class="gal__case"
        :class="{ 'is-live': liveRows[i] }"
      >
        <div class="gal__inner">
          <p class="mono gal__caseline">
            // {{ m.results.caseWord }} {{ pad(i + 1) }}<template v-if="c.term"> · {{ c.term }}</template>
          </p>

          <div class="gal__pair">
            <figure class="gal__half gal__half--before">
              <figcaption class="mono gal__tag">{{ m.results.before }}</figcaption>
              <button
                type="button"
                class="gal__shot brackets"
                :aria-label="`${m.results.caseWord} ${pad(i + 1)} - ${m.results.before}`"
                @click="viewerIndex = i * 2"
              >
                <span class="gal__frame">
                  <img
                    :src="`${base}media/gallery/${c.id}-before.jpg`"
                    :alt="m.results.photoAlt.before"
                    width="720"
                    height="960"
                    loading="lazy"
                  />
                  <span class="gal__expand" aria-hidden="true">
                    <svg viewBox="0 0 16 16">
                      <path d="M9.5 2 H14 V6.5 M14 2 L9.5 6.5 M6.5 14 H2 V9.5 M2 14 L6.5 9.5" />
                    </svg>
                  </span>
                </span>
              </button>
            </figure>

            <span class="gal__divider" aria-hidden="true" />

            <figure class="gal__half gal__half--after">
              <figcaption class="mono gal__tag">{{ m.results.after }}</figcaption>
              <button
                type="button"
                class="gal__shot brackets"
                :aria-label="`${m.results.caseWord} ${pad(i + 1)} - ${m.results.after}`"
                @click="viewerIndex = i * 2 + 1"
              >
                <span class="gal__frame">
                  <img
                    :src="`${base}media/gallery/${c.id}-after.jpg`"
                    :alt="m.results.photoAlt.after"
                    width="720"
                    height="960"
                    loading="lazy"
                  />
                  <span class="gal__expand" aria-hidden="true">
                    <svg viewBox="0 0 16 16">
                      <path d="M9.5 2 H14 V6.5 M14 2 L9.5 6.5 M6.5 14 H2 V9.5 M2 14 L6.5 9.5" />
                    </svg>
                  </span>
                </span>
              </button>
            </figure>
          </div>

          <!-- ⚠️ Оговорка у каждой пары, кеглем основного текста - ST-21 п. 9.6.
               В мелкий серый не уводить: требование регулятора, не вопрос вкуса -->
          <p class="gal__disclaimer">{{ m.results.disclaimer }}</p>
        </div>
      </li>
    </ol>

    <p class="gal__risks">{{ m.results.risksNote }}</p>

    <PhotoViewer v-model:index="viewerIndex" :items="viewerItems" />
  </PageSection>
</template>

<style scoped>
/* --- Журнал случаев --- */

.gal__list {
  margin: var(--s-8) 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: clamp(4rem, 8vh, 7rem);
}

/* Запись гуляет по сетке: нечётные прижаты к началу, чётные уходят вправо -
   разворот журнала, а не таблица. Асимметрия по сетке, не на глаз */
.gal__case {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.gal__inner {
  grid-column: 1 / span 9;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
}

.gal__case:nth-child(even) .gal__inner {
  grid-column: 4 / span 9;
}

.gal__caseline {
  margin: 0;
}

/* --- Пара кадров с пунктиром между ними --- */

.gal__pair {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr);
  column-gap: clamp(0.875rem, 2.2vw, 2rem);
  align-items: stretch;
}

.gal__half {
  margin: 0;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}

.gal__tag {
  margin: 0;
}

.gal__shot {
  --brackets-inset: 0;
  position: relative;
  display: block;
  padding: 0;
  cursor: zoom-in;
  color: var(--ink);
}

.gal__frame {
  position: relative;
  display: block;
  overflow: hidden;
}

/* Кадры вертикальные 3:4 - лицо целиком (правка Марка 05.08: не квадрат) */
.gal__shot img {
  display: block;
  inline-size: 100%;
  block-size: auto;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  background: var(--paper-raised);
  transition: transform var(--dur-base) var(--ease-out);
}

.gal__shot:hover img,
.gal__shot:focus-visible img {
  transform: scale(1.035);
}

/* Значок разворота - как у кадров госпиталя: без наведения (телефон) виден всегда */
.gal__expand {
  position: absolute;
  inset-block-end: var(--s-2);
  inset-inline-end: var(--s-2);
  display: grid;
  place-items: center;
  inline-size: 1.9rem;
  block-size: 1.9rem;
  background: color-mix(in srgb, var(--ink) 55%, transparent);
  opacity: 0;
  transition: opacity var(--dur-fast) var(--ease-out);
}

.gal__expand svg {
  inline-size: 0.85rem;
  block-size: 0.85rem;
  stroke: var(--paper);
  stroke-width: 1.2;
  fill: none;
}

.gal__shot:hover .gal__expand,
.gal__shot:focus-visible .gal__expand {
  opacity: 1;
}

@media (hover: none) {
  .gal__expand {
    opacity: 0.85;
  }
}

/* Пунктир между «до» и «после»: тот же шаг, что вся разметка. Тянется на
   высоту кадров - от строки подписей его отступает их высота */
.gal__divider {
  align-self: stretch;
  inline-size: 1px;
  margin-block-start: calc(var(--fs-mono) * 1.4 + var(--s-3));
  background-image: repeating-linear-gradient(
    to bottom,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

/* --- Оговорка и отсылка к рискам --- */

/* Кегль основного текста - требование ST-21 п. 9.6, не уменьшать */
.gal__disclaimer {
  margin: 0;
  font-size: var(--fs-body);
  line-height: 1.5;
  color: var(--ink-soft);
  max-inline-size: min(62ch, 100%);
}

.gal__risks {
  margin: clamp(3rem, 6vh, 5rem) 0 0;
  font-size: var(--fs-body);
  line-height: 1.5;
  color: var(--ink-soft);
  max-inline-size: min(62ch, 100%);
}

/* --- Появление записи: «до» → пунктир → «после», переходами к состоянию --- */

.gal__half,
.gal__caseline,
.gal__disclaimer {
  opacity: 0;
  translate: 0 0.4rem;
  transition:
    opacity var(--dur-slow) var(--ease-out),
    translate var(--dur-slow) var(--ease-out);
}

.gal__divider {
  clip-path: inset(0 0 100% 0);
  transition: clip-path var(--dur-draw) var(--ease-draw) 200ms;
}

.gal__case.is-live .gal__caseline {
  opacity: 1;
  translate: 0 0;
}

.gal__case.is-live .gal__half--before {
  opacity: 1;
  translate: 0 0;
  transition-delay: 120ms;
}

.gal__case.is-live .gal__divider {
  clip-path: inset(0 0 0 0);
}

.gal__case.is-live .gal__half--after {
  opacity: 1;
  translate: 0 0;
  transition-delay: 420ms;
}

.gal__case.is-live .gal__disclaimer {
  opacity: 1;
  translate: 0 0;
  transition-delay: 640ms;
}

/* RTL: направление прочерчивания пунктира вертикальное - переворачивать нечего */

@media (max-width: 900px) {
  /* Записи во всю ширину: колонок нет, асимметрию делать не из чего */
  .gal__inner,
  .gal__case:nth-child(even) .gal__inner {
    grid-column: 1 / -1;
  }

  .gal__pair {
    column-gap: clamp(0.625rem, 2.5vw, 1rem);
  }

  .gal__list {
    gap: clamp(3.5rem, 7vh, 5rem);
  }
}
</style>
