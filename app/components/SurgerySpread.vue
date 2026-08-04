<!--
  Блок [04] «Операции» - ВАРИАНТ Б: «разворот, две задачи сходятся в одну».

  Подача: блок разделён вертикальным пунктиром надвое, как разворот книги по
  корешку. Слева форма, справа дыхание, у каждой половины свой рисунок профиля
  и свои три строки. Внизу две линии сбегаются к одному узлу - это чертёж,
  а не иллюстрация: «две задачи, одно вмешательство».

  Отличие от варианта А: здесь ничего не прилипает и ничего не переключается.
  Композиция статичная, движение одно - при появлении блока колонки
  прочерчиваются сверху вниз, а затем линии сходятся в узел.

  ⚠️ Риски обеих операций стоят открытым текстом, тем же кеглем, что основной:
  ST-21 п. 7.1.3 требует показывать выгоды и риски наравне.
-->
<script setup lang="ts">
const { m } = useLocale()

const uid = useId()

/* Разворот и линии сведения чертятся заново каждый раз, как вся разметка сайта */
const spreadEl = ref<HTMLElement | null>(null)
const spreadLive = useRedrawOnReturn(spreadEl, 0.2)

const joinEl = ref<HTMLElement | null>(null)
const joinLive = useRedrawOnReturn(joinEl, 0.4)
</script>

<template>
  <PageSection
    id="surgery-b"
    :label="m.surgery.label"
    tone="deep"
    cross-y="5.5rem"
    :cross-fraction="0.161"
  >
    <SectionTitle :text="m.surgery.title" />
    <p class="sp__lead">{{ m.surgery.lead }}</p>

    <div ref="spreadEl" class="sp__spread" :class="{ 'is-live': spreadLive }">
      <!-- Корешок разворота: вертикальный пунктир, прочерчивается сверху вниз -->
      <span class="sp__spine" aria-hidden="true" />

      <section v-for="part in m.surgery.parts" :key="part.state" class="sp__half">
        <NoseScheme class="sp__scheme" :state="part.state" :labels="m.surgery.scheme" />

        <p class="mono sp__step">{{ part.step }}</p>
        <h3 class="sp__name">{{ part.name }}</h3>
        <p class="mono sp__surgery">{{ part.surgery }}</p>

        <p class="sp__half-lead">{{ part.lead }}</p>

        <ul class="sp__facts">
          <li v-for="fact in part.facts" :key="fact.mark" class="sp__fact">
            <span class="mono sp__fact-mark">{{ fact.mark }}</span>
            <span class="sp__fact-text">{{ fact.text }}</span>
          </li>
        </ul>
      </section>
    </div>

    <!-- Сведение: две линии из половин сходятся в один узел и идут дальше одной -->
    <div ref="joinEl" class="sp__join" :class="{ 'is-live': joinLive }">
      <svg class="sp__join-svg sp__join-svg--wide" viewBox="0 0 600 130" aria-hidden="true">
        <defs>
          <!-- Шторки, как в NoseScheme: линия открывается по своему направлению -->
          <clipPath :id="`jl-${uid}`">
            <rect class="sp__wipe sp__wipe--h" x="0" y="0" width="600" height="130" />
          </clipPath>
          <clipPath :id="`jr-${uid}`">
            <rect class="sp__wipe sp__wipe--rev" x="0" y="0" width="600" height="130" />
          </clipPath>
          <clipPath :id="`jd-${uid}`">
            <rect class="sp__wipe sp__wipe--v" x="0" y="0" width="600" height="130" />
          </clipPath>
        </defs>

        <path class="sp__line" :clip-path="`url(#jl-${uid})`" d="M150 0 L300 88" />
        <path class="sp__line" :clip-path="`url(#jr-${uid})`" d="M450 0 L300 88" />
        <path class="sp__line" :clip-path="`url(#jd-${uid})`" d="M300 100 L300 130" />
        <g class="sp__node">
          <path d="M300 80 L300 96 M292 88 L308 88" />
        </g>
      </svg>

      <!-- На телефоне половины стоят друг под другом, сводить нечего:
           остаётся одна вертикаль с тем же узлом -->
      <svg class="sp__join-svg sp__join-svg--narrow" viewBox="0 0 40 120" aria-hidden="true">
        <defs>
          <clipPath :id="`jn-${uid}`">
            <rect class="sp__wipe sp__wipe--v" x="0" y="0" width="40" height="120" />
          </clipPath>
        </defs>
        <path class="sp__line" :clip-path="`url(#jn-${uid})`" d="M20 0 L20 120" />
        <g class="sp__node">
          <path d="M20 52 L20 68 M12 60 L28 60" />
        </g>
      </svg>
    </div>

    <div class="sp__together">
      <p class="mono sp__step">{{ m.surgery.together.step }}</p>
      <h3 class="sp__name sp__name--together">{{ m.surgery.together.name }}</h3>
      <p class="sp__together-lead">{{ m.surgery.together.lead }}</p>
      <ul class="sp__marks">
        <li v-for="mark in m.surgery.together.marks" :key="mark" class="mono sp__mark">{{ mark }}</li>
      </ul>
    </div>

    <div class="sp__risks">
      <p class="mono sp__risks-label">{{ m.surgery.risksLabel }}</p>
      <div class="sp__risks-cols">
        <div v-for="part in m.surgery.parts" :key="part.state" class="sp__risk">
          <p class="mono sp__risk-title">{{ part.risksLabel }}</p>
          <p class="sp__risk-text">{{ part.risks }}</p>
        </div>
      </div>
    </div>

    <div class="sp__action">
      <MarkAction href="#booking">{{ m.action.bookLong }}</MarkAction>
    </div>
  </PageSection>
</template>

<style scoped>
.sp__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(56ch, 100%);
}

/* --- Разворот --- */

.sp__spread {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(2rem, 5vw, 4.5rem);
}

/* Корешок: та же линия, что вся разметка сайта, но открывается сверху вниз
   переходом, а не «замершим кадром» анимации - на iOS такой кадр сбрасывается */
.sp__spine {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 50%;
  inline-size: var(--rule-w);
  background-image: repeating-linear-gradient(
    to bottom,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  clip-path: inset(0 0 100% 0);
  transition: clip-path var(--dur-draw) var(--ease-draw);
  pointer-events: none;
}

.sp__spread.is-live .sp__spine {
  clip-path: inset(0 0 0 0);
}

.sp__half {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}

.sp__scheme {
  margin-block-end: var(--s-4);
  --ns-size: 16rem;
}

.sp__step {
  margin: 0;
}

.sp__name {
  font-size: var(--fs-h2);
  line-height: 1.1;
  color: var(--ink);
}

.sp__surgery {
  margin: 0;
  color: var(--ink);
}

.sp__half-lead {
  font-size: var(--fs-body);
  line-height: 1.65;
  margin-block-start: var(--s-2);
}

/* Факты в колонке разворота стоят столбиком: пометка над строкой.
   Двухколоночный FactList в половине ширины ломается на переносах */
.sp__facts {
  margin: var(--s-4) 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
}

.sp__fact {
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
  padding-block: var(--s-4);
  background-image: repeating-linear-gradient(
    to right,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  background-size: 100% var(--rule-w);
  background-repeat: no-repeat;
  background-position: 0 0;
}

.sp__fact-mark {
  color: var(--ink-soft);
}

.sp__fact-text {
  font-size: var(--fs-body);
  line-height: 1.6;
}

/* --- Сведение --- */

.sp__join {
  display: flex;
  justify-content: center;
}

.sp__join-svg {
  inline-size: 100%;
  block-size: auto;
  overflow: visible;
}

.sp__join-svg--narrow {
  display: none;
  max-inline-size: 2.5rem;
}

.sp__line {
  fill: none;
  stroke: var(--rule);
  stroke-width: var(--rule-w);
  stroke-dasharray: var(--dash-on) var(--dash-off);
  /* Штрих и толщина считаются в экранных пикселях, а не в системе рисунка:
     иначе на широком экране пунктир растягивается и перестаёт совпадать
     с остальной разметкой сайта */
  vector-effect: non-scaling-stroke;
}

.sp__wipe {
  transform-box: view-box;
  transition: transform var(--dur-draw) var(--ease-draw);
}

.sp__wipe--h,
.sp__wipe--rev {
  transform: scaleX(0);
}

.sp__wipe--v {
  transform: scaleY(0);
  transform-origin: 0 0;
  /* Линия вниз идёт после того, как две верхние сошлись */
  transition-delay: 520ms;
}

.sp__wipe--h {
  transform-origin: 0 0;
}

.sp__wipe--rev {
  transform-origin: 600px 0;
}

.sp__join.is-live .sp__wipe {
  transform: scale(1);
}

.sp__node path {
  fill: none;
  stroke: var(--gold-deep);
  stroke-width: 1.4;
  vector-effect: non-scaling-stroke;
}

.sp__node {
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-out);
}

.sp__join.is-live .sp__node {
  opacity: 1;
  transition-delay: 420ms;
}

/* --- Итог --- */

.sp__together {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
  align-items: center;
  text-align: center;
}

.sp__name--together {
  font-size: var(--fs-h2);
}

.sp__together-lead {
  font-size: var(--fs-body);
  line-height: 1.65;
  max-inline-size: min(52ch, 100%);
  /* Абзац стоит по центру колонкой, но набран от края: центрованный текст
     выпадает из журнальной подачи остальной страницы */
  text-align: start;
  margin-block-start: var(--s-2);
}

.sp__marks {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--s-8);
  margin: var(--s-2) 0 0;
  padding: 0;
  list-style: none;
}

.sp__mark {
  padding-block-start: var(--s-4);
  color: var(--ink);
  background-image: repeating-linear-gradient(
    to right,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  background-size: 100% var(--rule-w);
  background-repeat: no-repeat;
  background-position: 0 0;
}

/* --- Риски --- */

.sp__risks {
  display: flex;
  flex-direction: column;
  gap: var(--s-6);
}

.sp__risks-label {
  margin: 0;
}

.sp__risks-cols {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(2rem, 4vw, 4rem);
}

.sp__risk {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
  padding-block-start: var(--s-4);
  background-image: repeating-linear-gradient(
    to right,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  background-size: 100% var(--rule-w);
  background-repeat: no-repeat;
  background-position: 0 0;
}

.sp__risk-title {
  margin: 0;
  color: var(--ink);
}

.sp__risk-text {
  font-size: var(--fs-body);
  color: var(--ink-soft);
}

@media (max-width: 900px) {
  .sp__spread {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-16);
  }

  /* Корешка нет: половины стоят друг под другом */
  .sp__spine {
    display: none;
  }

  .sp__scheme {
    --ns-size-m: 12rem;
  }

  .sp__join-svg--wide {
    display: none;
  }

  .sp__join-svg--narrow {
    display: block;
  }

  .sp__together {
    align-items: start;
    text-align: start;
  }

  .sp__marks {
    justify-content: start;
  }

  .sp__risks-cols {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-8);
  }

  .sp__action :deep(.action) {
    inline-size: 100%;
  }
}
</style>
