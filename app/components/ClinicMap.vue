<!--
  Карта побережья Джумейры для блока «Где принимает».

  Идея принята Марком (вариант «Координата»): разметка хирурга становится
  разметкой карты. То же перо, что во всём сайте, - тонкие линии, пунктир с шагом
  4/6, крестик-узел, - но точка впервые ставится не в пустоту, а на место на карте.

  Никаких Google-карт и скриншотов: свой SVG в цветах сайта. Внешних доменов
  страница не тянет (скорость для ОАЭ + ничего не ломает стиль).

  География настоящая, проверена по OpenStreetMap 03.08.2026:
  · госпиталь - 25.1530° N, 55.2013° E, участок 760 на Jumeirah Beach Road;
  · Бурдж-аль-Араб - 25.1413° N, 55.1854° E, ~2 км юго-западнее, на острове;
  · берег в этом месте идёт с юго-запада на северо-восток, море - на северо-западе.
  Масштаб честный: полоса «1 км» внизу соответствует расстояниям на карте.

  ДВИЖЕНИЕ. Как у CrossRules: берег прочерчивается первым (штрихового рисования
  у сплошной линии нет - работает stroke-dashoffset), дорога открывается слева
  направо через clip-path (пунктир сжимать нельзя - плывёт шаг), затем проявляется
  узел госпиталя с пунктирным кольцом, последними - подписи. Блок ушёл с экрана
  целиком - карта стирается и при возврате чертится заново (правило сайта,
  наблюдатель с запасом WATCH_SLACK - см. design-system.md, раздел 4).

  ⚠️ RTL: карта - географический рисунок, при арабской версии НЕ зеркалится.
  clip-path дороги оставить как есть.
-->
<script setup lang="ts">
interface MapLabels {
  alt: string
  sea: string
  road: string
  hospital: string
  area: string
  coords: string
  burj: string
  scale: string
}

defineProps<{ labels: MapLabels }>()

/** Запас для наблюдателя, px: убирает случай «граница блока = граница экрана» */
const WATCH_SLACK = 4

const root = ref<HTMLElement | null>(null)
const live = ref(false)

let enterWatch: IntersectionObserver | null = null
let leaveWatch: IntersectionObserver | null = null

onMounted(() => {
  // Карта показалась на четверть - чертим
  enterWatch = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) live.value = true
    },
    { threshold: 0.25 },
  )
  // Карта ушла с экрана целиком - стираем, при возврате рисуется заново
  leaveWatch = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) live.value = false
    },
    { threshold: 0, rootMargin: `-${WATCH_SLACK}px` },
  )
  if (root.value) {
    enterWatch.observe(root.value)
    leaveWatch.observe(root.value)
  }
})

onBeforeUnmount(() => {
  enterWatch?.disconnect()
  leaveWatch?.disconnect()
})
</script>

<template>
  <div ref="root" class="map" :class="{ 'map--live': live }">
    <svg
      class="map__svg"
      viewBox="0 0 640 560"
      role="img"
      :aria-label="labels.alt"
      fill="none"
    >
      <!-- Море: подпись и три штриха-волны в верхнем левом углу, над берегом -->
      <g class="map__sea">
        <text class="map__t map__t--soft" x="150" y="140" text-anchor="middle">
          {{ labels.sea }}
        </text>
        <line class="map__wave" x1="66" y1="180" x2="128" y2="180" />
        <line class="map__wave" x1="96" y1="212" x2="150" y2="212" />
        <line class="map__wave" x1="48" y1="244" x2="94" y2="244" />
      </g>

      <!-- Берег: сплошная волосяная линия с юго-запада на северо-восток.
           pathLength=1 - чтобы прочерчивание не зависело от настоящей длины -->
      <path
        class="map__coast"
        d="M -6 556 C 60 528, 140 504, 200 482 C 268 456, 330 330, 387 210 C 424 132, 520 106, 646 60"
        pathLength="1"
      />

      <!-- Jumeirah Beach Road: пунктир тем же шагом 4/6, что вся разметка сайта.
           Проходит через узел госпиталя - участок 760 стоит на этой дороге -->
      <g class="map__roadwrap">
        <path
          id="clinic-road"
          class="map__road"
          d="M 128 610 C 190 560, 240 512, 292 452 C 348 386, 384 296, 420 248 C 458 198, 548 148, 668 92"
        />
      </g>
      <text class="map__t map__t--road" dy="-7">
        <textPath href="#clinic-road" startOffset="12%">{{ labels.road }}</textPath>
      </text>

      <!-- Бурдж-аль-Араб: контур паруса на острове, мостик к берегу.
           Ставит на карте «это Дубай» одним силуэтом -->
      <g class="map__burj">
        <line class="map__hair" x1="176" y1="452" x2="197" y2="476" />
        <path class="map__hair" d="M 174 418 L 174 450 M 174 421 Q 157 434 155 450 L 174 450" />
        <text class="map__t map__t--soft" x="140" y="474" text-anchor="end">
          {{ labels.burj }}
        </text>
      </g>

      <!-- Узел госпиталя: тот же крест, что в CrossRules, + пунктирное кольцо-прицел.
           Единственное кольцо на сайте - это и есть точка, ради которой карта -->
      <g class="map__node">
        <circle class="map__ring" cx="420" cy="248" r="17" />
        <path class="map__cross" d="M 420 234 L 420 262 M 406 248 L 434 248" />
      </g>

      <g class="map__label">
        <text class="map__t map__t--name" x="444" y="242">{{ labels.hospital }}</text>
        <text class="map__t map__t--soft" x="444" y="262">{{ labels.area }}</text>
        <text class="map__t map__t--soft" x="444" y="280">{{ labels.coords }}</text>
      </g>

      <!-- Север и честный масштаб: 1 км по расстояниям карты -->
      <g class="map__north">
        <path class="map__hair" d="M 598 50 L 598 24 M 593 31 L 598 24 L 603 31" />
        <text class="map__t map__t--soft" x="598" y="66" text-anchor="middle">N</text>
      </g>
      <g class="map__scalebar">
        <path class="map__hair" d="M 446 522 L 446 528 M 446 525 L 600 525 M 600 522 L 600 528" />
        <text class="map__t map__t--soft" x="523" y="514" text-anchor="middle">
          {{ labels.scale }}
        </text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.map {
  inline-size: 100%;
}

.map__svg {
  display: block;
  inline-size: 100%;
  block-size: auto;
}

/* --- Перо: всё нарисовано тем же цветом и толщиной, что разметка --- */

.map__coast {
  stroke: var(--rule);
  stroke-width: var(--rule-w);
  /* Прочерчивание сплошной линии: вся длина = 1 штрих, сдвиг открывает её */
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}

.map__road {
  stroke: var(--rule);
  stroke-width: var(--rule-w);
  stroke-dasharray: var(--dash-on) var(--dash-off);
}

.map__roadwrap {
  /* Пунктир открываем клипом, не длиной: иначе шаг штрихов плывёт */
  clip-path: inset(0 100% 0 0);
}

.map__hair {
  stroke: var(--rule);
  stroke-width: var(--rule-w);
}

.map__wave {
  stroke: var(--rule-faint);
  stroke-width: var(--rule-w);
  stroke-dasharray: var(--dash-on) var(--dash-off);
}

.map__cross {
  stroke: var(--ink);
  stroke-width: var(--rule-w);
}

.map__ring {
  stroke: var(--ink);
  stroke-width: var(--rule-w);
  stroke-dasharray: var(--dash-on) var(--dash-off);
}

/* --- Подписи: моношрифт полей, как везде на сайте --- */

.map__t {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  fill: var(--ink-soft);
}

.map__t--name {
  font-size: 11.5px;
  font-weight: 500;
  fill: var(--ink);
}

.map__t--soft {
  font-size: 9.5px;
}

.map__t--road {
  font-size: 9.5px;
  letter-spacing: 0.14em;
}

/*
  На телефоне SVG сжимается вместе с текстом, и подписи в 9-11px виртуальных
  единиц становятся нечитаемыми. Кегль поднимается в единицах viewBox - карта
  во всю ширину экрана, поэтому места хватает (проверено: имя госпиталя при
  14.5px заканчивается на 633 из 640).
*/
@media (max-width: 700px) {
  .map__t {
    font-size: 14px;
  }

  /* Имя не крупнее 13.5px: при 14.5px последние буквы выходили за viewBox
     (444 + 21 знак x 9.6px = 645 > 640) и обрезались */
  .map__t--name {
    font-size: 13.5px;
    letter-spacing: 0.04em;
  }

  .map__t--soft {
    font-size: 13px;
  }

  .map__t--road {
    font-size: 12.5px;
  }
}

/* --- Покой: до появления на экране видно только фон --- */

.map__sea,
.map__burj,
.map__node,
.map__label,
.map__north,
.map__scalebar,
.map__t--road {
  opacity: 0;
}

/* --- Появление. Порядок: берег → дорога → окрестности → узел → подписи --- */

.map--live .map__coast {
  animation: map-coast var(--dur-draw) var(--ease-draw) both;
}

.map--live .map__roadwrap {
  animation: map-road var(--dur-draw) var(--ease-draw) 300ms both;
}

.map--live .map__sea,
.map--live .map__burj,
.map--live .map__north,
.map--live .map__scalebar {
  animation: map-in var(--dur-slow) var(--ease-out) 900ms both;
}

.map--live .map__t--road {
  animation: map-in var(--dur-slow) var(--ease-out) 1100ms both;
}

.map--live .map__node {
  transform-box: fill-box;
  transform-origin: center;
  animation: map-node var(--dur-base) var(--ease-out) 1300ms both;
}

.map--live .map__label {
  animation: map-in var(--dur-base) var(--ease-out) 1550ms both;
}

@keyframes map-coast {
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes map-road {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0);
  }
}

@keyframes map-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes map-node {
  from {
    opacity: 0;
    transform: scale(0.72);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
