<!--
  Профиль с разметкой хирурга - главный рисунок блока операций.

  Основа - силуэт головы из набора, присланного Марком (см. заголовок
  `utils/profileSilhouette.ts`: откуда взят, что с ним сделано и почему это
  проходит по правилам). Фотографий в этот блок поставить нельзя ни одной:
  снимки пациентов запрещены, операционные кадры запрещены, стоковые лица мы
  не ставим сами. Силуэт - не человек и не результат, поверх него идёт
  разметка, которую хирург рисует перед операцией.

  ЦВЕТ РАЗЛИЧАЕТ ОПЕРАЦИИ (правка Марка 04.08):
  · золото - задача формы, ринопластика (ось спинки);
  · синий  - задача дыхания, септопластика (линия перегородки, путь воздуха);
  · серая разметка - общие оси лица, они ничьи.
  Поэтому в состоянии «вместе», где обе разметки лежат на одном профиле,
  сразу видно, что это ДВЕ операции, а не одна каша из линий.

  ⚠️ Каждая цветная линия нарисована ДВАЖДЫ: внутри тёмного силуэта светлым
  оттенком, снаружи на бумаге - тёмным. Одним цветом нельзя: золото на
  чернильном читается (5.47:1), а на бумаге даёт 2.05:1 и пропадает. Тот же
  приём, что у разметки первого экрана, - там она тоже двухслойная.

  Линии не проявляются, а ПРОЧЕРЧИВАЮТСЯ: у каждой группы своя шторка,
  она раскрывается по направлению линии. Сменилось состояние - шторка
  закрывается обратно, линия убирается тем же движением, каким пришла.
  Шторками, а не через stroke-dashoffset: штрих у нас 4/6, и растягивание
  пути растянуло бы вместе с ним шаг пунктира.

  ⚠️ Подписи - обычный текст поверх рисунка, а не текст внутри SVG: текст
  внутри SVG сжимается вместе с картинкой, и на телефоне от него остаются
  нечитаемые семь пикселей (block-manifest.md, п. 5).
-->
<script setup lang="ts">
import { PROFILE_PATH, PROFILE_TRANSFORM, PROFILE_VIEWBOX } from '~/utils/profileSilhouette'

interface SchemeLabels {
  alt: string
  axes: string
  dorsum: string
  tip: string
  septum: string
  airway: string
  form: string
  breath: string
  both: string
}

interface Props {
  state?: 'form' | 'breath' | 'both'
  labels: SchemeLabels
}

const props = withDefaults(defineProps<Props>(), { state: 'form' })

/* Маски адресуются по id, а рисунок стоит на странице не в одном экземпляре -
   идентификаторы обязаны быть разными у каждого */
const uid = useId()

const root = ref<HTMLElement | null>(null)
/* Общий приём сайта: ушло с экрана - стёрлось, вернулось - чертится заново */
const live = useRedrawOnReturn(root, 0.2)

const formOn = computed(() => live.value && props.state !== 'breath')
const breathOn = computed(() => live.value && props.state !== 'form')
const bothOn = computed(() => live.value && props.state === 'both')
/* В «вместе» подписи отдельных линий уступают место названиям двух задач */
const soloOn = computed(() => live.value && !bothOn.value)
</script>

<template>
  <figure ref="root" class="ns" :class="[`ns--${state}`, { 'is-live': live }]">
    <div class="ns__plate">
      <svg class="ns__svg" :viewBox="PROFILE_VIEWBOX" role="img" :aria-label="labels.alt">
        <defs>
          <!-- Силуэт как область: внутри него цвета светлые, снаружи тёмные -->
          <clipPath :id="`in-${uid}`">
            <path :d="PROFILE_PATH" :transform="PROFILE_TRANSFORM" />
          </clipPath>
          <mask :id="`out-${uid}`" maskUnits="userSpaceOnUse" x="-30" y="-30" width="220" height="220">
            <rect x="-30" y="-30" width="220" height="220" fill="#fff" />
            <path :d="PROFILE_PATH" :transform="PROFILE_TRANSFORM" fill="#000" />
          </mask>

          <!-- Шторки. Раскрываются по направлению своей линии, задержки разные:
               линии ложатся одна за другой, а не хором -->
          <clipPath :id="`wv-${uid}`">
            <rect class="ns__wipe ns__wipe--v" :class="{ 'is-on': formOn }" x="-30" y="-30" width="220" height="220" />
          </clipPath>
          <clipPath :id="`wh-${uid}`">
            <rect class="ns__wipe ns__wipe--h ns__wipe--d1" :class="{ 'is-on': formOn }" x="-30" y="-30" width="220" height="220" />
          </clipPath>
          <clipPath :id="`wd-${uid}`">
            <rect class="ns__wipe ns__wipe--h ns__wipe--d2" :class="{ 'is-on': formOn }" x="-30" y="-30" width="220" height="220" />
          </clipPath>
          <clipPath :id="`ws-${uid}`">
            <rect class="ns__wipe ns__wipe--v" :class="{ 'is-on': breathOn }" x="-30" y="-30" width="220" height="220" />
          </clipPath>
          <clipPath :id="`wf-${uid}`">
            <rect class="ns__wipe ns__wipe--rev ns__wipe--d2" :class="{ 'is-on': breathOn }" x="-30" y="-30" width="220" height="220" />
          </clipPath>
        </defs>

        <!-- Силуэт -->
        <path class="ns__head" :d="PROFILE_PATH" :transform="PROFILE_TRANSFORM" />

        <!-- Общие оси: ничьи, поэтому обычной серой разметкой и одним слоем -
             она читается и на чернильном силуэте, и на бумаге -->
        <g class="ns__axes">
          <!-- Вертикаль от переносицы -->
          <path class="ns__rule" :clip-path="`url(#wv-${uid})`" d="M101.5 22 L101.5 126" />
          <!-- Горизонталь на уровне кончика носа -->
          <path class="ns__rule" :clip-path="`url(#wh-${uid})`" d="M56 74 L124 74" />
        </g>

        <!-- ЛИНИИ ЗАДАЧ. Каждая нарисована дважды: на бумаге и на силуэте -->
        <g :mask="`url(#out-${uid})`">
          <g :clip-path="`url(#wd-${uid})`">
            <path class="ns__gold ns__gold--paper" d="M97 54.3 L121 95.2" />
          </g>
          <g :clip-path="`url(#ws-${uid})`">
            <path class="ns__blue ns__blue--paper" d="M105 64 L105 122" />
          </g>
          <g :clip-path="`url(#wf-${uid})`">
            <path
              class="ns__blue ns__blue--paper ns__flow"
              d="M130 70 C 118 73, 110 76, 106 80 C 101 85, 96 95, 95 112"
            />
          </g>
        </g>
        <g :clip-path="`url(#in-${uid})`">
          <g :clip-path="`url(#wd-${uid})`">
            <path class="ns__gold ns__gold--head" d="M97 54.3 L121 95.2" />
          </g>
          <g :clip-path="`url(#ws-${uid})`">
            <path class="ns__blue ns__blue--head" d="M105 64 L105 122" />
          </g>
          <g :clip-path="`url(#wf-${uid})`">
            <path
              class="ns__blue ns__blue--head ns__flow"
              d="M130 70 C 118 73, 110 76, 106 80 C 101 85, 96 95, 95 112"
            />
          </g>
        </g>

        <!-- Узлы. В каждом состоянии горит ровно один -->
        <g class="ns__node ns__node--gold" :class="{ 'is-on': state === 'form' && live }">
          <path d="M108.6 70 L108.6 78 M104.6 74 L112.6 74" />
        </g>
        <g class="ns__node ns__node--blue" :class="{ 'is-on': state === 'breath' && live }">
          <path d="M105 76 L105 84 M101 80 L109 80" />
        </g>
        <!-- «Вместе»: узел стоит на пересечении оси спинки и линии перегородки -
             одна точка на две задачи. Выноска ведёт к подписи на поле -->
        <g class="ns__node ns__node--both" :class="{ 'is-on': bothOn }">
          <path class="ns__leader" d="M106.5 66.5 L124 51" />
          <path d="M105 64 L105 72 M101 68 L109 68" />
        </g>
      </svg>

      <!-- Пометки на полях рисунка -->
      <span class="mono ns__tag ns__tag--axes" :class="{ 'is-on': formOn && soloOn }">{{ labels.axes }}</span>
      <span class="mono ns__tag ns__tag--tip" :class="{ 'is-on': formOn && soloOn }">{{ labels.tip }}</span>
      <span class="mono ns__tag ns__tag--dorsum" :class="{ 'is-on': formOn && soloOn }">{{ labels.dorsum }}</span>
      <span class="mono ns__tag ns__tag--airway" :class="{ 'is-on': breathOn && soloOn }">{{ labels.airway }}</span>
      <span class="mono ns__tag ns__tag--septum" :class="{ 'is-on': breathOn && soloOn }">{{ labels.septum }}</span>
      <!-- В «вместе» подписаны не линии, а задачи: сразу видно, что операций две -->
      <span class="mono ns__tag ns__tag--form" :class="{ 'is-on': bothOn }">{{ labels.form }}</span>
      <span class="mono ns__tag ns__tag--breath" :class="{ 'is-on': bothOn }">{{ labels.breath }}</span>
      <span class="mono ns__tag ns__tag--both" :class="{ 'is-on': bothOn }">{{ labels.both }}</span>
    </div>
  </figure>
</template>

<style scoped>
.ns {
  margin: 0;
}

.ns__plate {
  position: relative;
  inline-size: 100%;
  max-inline-size: var(--ns-size, 21rem);
  /* Пропорция кадра рисунка - та же, что в viewBox */
  aspect-ratio: 114.59 / 145.42;
}

.ns__svg {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  /* Разметка и подписи выходят за силуэт вправо - обрезать нечем */
  overflow: visible;
}

/* --- Силуэт --- */

.ns__head {
  fill: var(--ink);
  opacity: 0;
  transition: opacity var(--dur-slow) var(--ease-out);
}

.ns.is-live .ns__head {
  opacity: 1;
}

/* --- Разметка --- */

.ns__rule,
.ns__gold,
.ns__blue {
  fill: none;
  stroke-width: var(--rule-w);
  /* Тот же шаг пунктира, что у разметки блоков: 4 через 6 */
  stroke-dasharray: var(--dash-on) var(--dash-off);
  /* Штрих и толщина считаются в экранных пикселях, а не в системе рисунка:
     кадр 114 единиц растянут до 330 px, и без этого шаг пунктира разъехался бы
     с разметкой всей остальной страницы */
  vector-effect: non-scaling-stroke;
}

.ns__rule {
  stroke: var(--rule);
}

/* Линии задач вдвое толще общих осей: по ним читается, где чья операция.
   Тоньше нельзя - на прокрутке тонкий цветной пунктир сливается с фоном
   (правка Марка 04.08) */
.ns__gold,
.ns__blue {
  stroke-width: 2px;
}

.ns__gold--paper {
  stroke: var(--gold-deep); /* 5.55:1 на бумаге */
}

.ns__gold--head {
  stroke: var(--gold); /* 5.47:1 на чернильном */
}

.ns__blue--paper {
  stroke: var(--blue); /* 6.75:1 на бумаге */
}

.ns__blue--head {
  stroke: var(--blue-light); /* 5.76:1 на чернильном */
}

/* У пути воздуха шаг крупнее: это движение, а не измерение */
.ns__flow {
  stroke-dasharray: 6 8;
  stroke-linecap: round;
}

/* --- Шторки, которыми линии прочерчиваются --- */

.ns__wipe {
  transform-box: view-box;
  transition: transform var(--dur-draw) var(--ease-draw);
}

.ns__wipe--h,
.ns__wipe--rev {
  transform: scaleX(0);
}

.ns__wipe--v {
  transform: scaleY(0);
}

.ns__wipe--h,
.ns__wipe--v {
  transform-origin: 0 0;
}

/* Путь воздуха идёт снаружи внутрь, поэтому его шторка открывается справа -
   от начала самой линии (x = 130), а не от края кадра: иначе треть движения
   уходит на пустое место.
   ⚠️ Отсчёт при transform-box: view-box идёт от левого верхнего угла кадра */
.ns__wipe--rev {
  transform-origin: 130px 0;
}

.ns__wipe--d1 {
  transition-delay: 140ms;
}

.ns__wipe--d2 {
  transition-delay: 280ms;
}

.ns__wipe.is-on {
  transform: scale(1);
}

/* --- Узлы --- */

.ns__node path {
  fill: none;
  stroke-width: 1.4px;
  vector-effect: non-scaling-stroke;
}

.ns__node--gold path {
  stroke: var(--gold-deep);
}

.ns__node--blue path {
  stroke: var(--blue);
}

.ns__node--both path {
  stroke: var(--gold-deep);
}

/* Выноска от узла к подписи - тоньше самого узла и тем же пунктиром,
   что вся разметка сайта */
.ns__node--both .ns__leader {
  stroke-width: var(--rule-w);
  stroke-dasharray: var(--dash-on) var(--dash-off);
}

.ns__node {
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-out);
}

.ns__node.is-on {
  opacity: 1;
  /* Узел появляется после того, как линии сошлись, а не вместе с ними */
  transition-delay: 620ms;
}

/* --- Пометки на полях --- */

.ns__tag {
  position: absolute;
  white-space: nowrap;
  color: var(--ink-soft);
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-out);
  pointer-events: none;
}

.ns__tag.is-on {
  opacity: 1;
  /* Подпись приходит последней - когда линии уже легли */
  transition-delay: 760ms;
}

/*
  Координаты пересчитаны из системы рисунка (кадр 114.59 × 145.42):
  доля по ширине = x / 1.1459, доля по высоте = y / 1.4542.

  Подписи стоят СПРАВА от своих линий и частью выходят за кадр рисунка -
  там пустое поле до колонки с текстом. Слева ставить нельзя: там колонка
  с номером раздела.
*/
.ns__tag--axes {
  inset-inline-start: 91%;
  inset-block-start: 11%;
}

.ns__tag--tip {
  inset-inline-start: 110%;
  inset-block-start: 47%;
}

.ns__tag--dorsum {
  inset-inline-start: 104%;
  inset-block-start: 58%;
  color: var(--gold-deep);
}

.ns__tag--airway {
  inset-inline-start: 105%;
  inset-block-start: 42%;
  color: var(--blue);
}

.ns__tag--septum {
  inset-inline-start: 94%;
  inset-block-start: 80%;
  color: var(--blue);
}

/* «Вместе»: две задачи подписаны своими цветами, узел - выноской */
.ns__tag--form {
  inset-inline-start: 104%;
  inset-block-start: 59%;
  color: var(--gold-deep);
}

.ns__tag--breath {
  inset-inline-start: 105%;
  inset-block-start: 41%;
  color: var(--blue);
}

.ns__tag--both {
  inset-inline-start: 110%;
  inset-block-start: 32%;
  color: var(--gold-deep);
}

@media (max-width: 900px) {
  .ns__plate {
    max-inline-size: var(--ns-size-m, 12rem);
  }
}
</style>
