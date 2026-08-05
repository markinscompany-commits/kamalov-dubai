<!--
  Линия лица с разметкой хирурга - главный рисунок блока операций.

  Основа - контур, обведённый по силуэту из набора, присланного Марком
  (см. заголовок `utils/profileSilhouette.ts`: откуда взят и как обведён).
  Заливкой голова стояла в прошлой версии и не подошла: нужна одна линия -
  лоб, нос, губы, подбородок, шея (правка Марка 04.08).

  Фотографий в этот блок поставить нельзя ни одной: снимки пациентов
  запрещены, операционные кадры запрещены, стоковые лица мы не ставим сами.
  Контур - не человек и не результат, поверх него идёт разметка, которую
  хирург рисует перед операцией.

  ЦВЕТ (схема Марка, 04.08):
  · каждая задача по отдельности размечена ЗОЛОТОМ;
  · в состоянии «вместе» обе разметки становятся СИНИМИ, а золотом
    остаётся только узел на их пересечении и подпись «одна операция».
  Так видно и то, что операций две, и то, ради чего они сходятся в одну.

  Серым - постоянные линии кадра: уровень переносицы и уровень кончика.
  Они не принадлежат ни одной задаче и чертятся один раз.

  Линии не проявляются, а ПРОЧЕРЧИВАЮТСЯ: у каждой группы своя шторка,
  она раскрывается по направлению линии. Сменилось состояние - шторка
  закрывается обратно. Шторками, а не через stroke-dashoffset: штрих у нас
  4/6, и растягивание пути растянуло бы вместе с ним шаг пунктира.

  ⚠️ Вся геометрия привязана к точкам, ЗАМЕРЕННЫМ по обводке, а не
  поставленным на глаз: переносица (101.7, 60), кончик (108.4, 74),
  основание носа (104.4, 79). Прежняя разметка стояла криво именно потому,
  что координаты брались от руки.

  ⚠️ Ось спинки идёт ПО линии профиля и не спрямляет её: прямая рядом
  с изогнутым носом читается как «вот каким он станет», то есть как
  обещание результата (Приложение 2 ST-21, п. 3 и 7).

  ⚠️ Подписи - обычный текст поверх рисунка, а не текст внутри SVG: текст
  внутри SVG сжимается вместе с картинкой, и на телефоне от него остаются
  нечитаемые семь пикселей (block-manifest.md, п. 5).
-->
<script setup lang="ts">
import { PROFILE_PATH } from '~/utils/profileSilhouette'

interface SchemeLabels {
  alt: string
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

/* Шторки адресуются по id, а рисунок стоит на странице не в одном
   экземпляре - идентификаторы обязаны быть разными у каждого */
const uid = useId()

const root = ref<HTMLElement | null>(null)
/* Общий приём сайта: ушло с экрана - стёрлось, вернулось - чертится заново */
const live = useRedrawOnReturn(root, 0.2)

const formOn = computed(() => live.value && props.state !== 'breath')
const breathOn = computed(() => live.value && props.state !== 'form')
const bothOn = computed(() => live.value && props.state === 'both')
/* В «вместе» подписи отдельных линий уступают место названиям двух задач */
const soloOn = computed(() => live.value && !bothOn.value)

/** Кадр обрезан по содержимому: контур + разметка + запас справа под выноску.
    Верх поднят до y=26 - лоб укорочен по правке Марка 04.08 */
const VIEWBOX = '62 26 72 104'
</script>

<template>
  <figure
    ref="root"
    class="ns"
    :class="[`ns--${state}`, { 'is-live': live, 'is-both': bothOn }]"
  >
    <div class="ns__plate">
      <svg class="ns__svg" :viewBox="VIEWBOX" role="img" :aria-label="labels.alt">
        <defs>
          <!-- Шторки. Раскрываются по направлению своей линии, задержки разные:
               линии ложатся одна за другой, а не хором -->
          <!-- Контур лица чертится сверху вниз, ото лба к шее -->
          <clipPath :id="`wl-${uid}`">
            <rect class="ns__wipe ns__wipe--v ns__wipe--slow" :class="{ 'is-on': live }" x="40" y="0" width="140" height="160" />
          </clipPath>
          <clipPath :id="`wf-${uid}`">
            <rect class="ns__wipe ns__wipe--h" :class="{ 'is-on': live }" x="40" y="0" width="140" height="160" />
          </clipPath>
          <clipPath :id="`wd-${uid}`">
            <rect class="ns__wipe ns__wipe--h ns__wipe--d1" :class="{ 'is-on': formOn }" x="40" y="0" width="140" height="160" />
          </clipPath>
          <clipPath :id="`ws-${uid}`">
            <rect class="ns__wipe ns__wipe--v ns__wipe--d1" :class="{ 'is-on': breathOn }" x="40" y="0" width="140" height="160" />
          </clipPath>
          <clipPath :id="`wa-${uid}`">
            <rect class="ns__wipe ns__wipe--h ns__wipe--d2" :class="{ 'is-on': breathOn }" x="40" y="0" width="140" height="160" />
          </clipPath>
        </defs>

        <!-- Линия лица -->
        <g :clip-path="`url(#wl-${uid})`">
          <path class="ns__face" :d="PROFILE_PATH" />
        </g>

        <!-- Постоянные линии кадра: уровень переносицы и уровень кончика носа -->
        <g :clip-path="`url(#wf-${uid})`">
          <path class="ns__rule" d="M64 60 L118 60" />
          <path class="ns__rule" d="M64 74 L126 74" />
        </g>

        <!-- ЗАДАЧА ФОРМЫ: ось спинки от переносицы через кончик -->
        <g :clip-path="`url(#wd-${uid})`">
          <path class="ns__line ns__line--dorsum" d="M101.7 60 L115 87.8" />
        </g>

        <!-- ЗАДАЧА ДЫХАНИЯ: линия перегородки и путь воздуха -->
        <g :clip-path="`url(#ws-${uid})`">
          <path class="ns__line ns__line--septum" d="M104.4 62 L104.4 92" />
        </g>
        <!-- Путь воздуха: дуга ОТ ноздри наружу и вниз (правка Марка 04.08 -
             прежняя шла поперёк лица внутрь и читалась неанатомично) -->
        <g :clip-path="`url(#wa-${uid})`">
          <path
            class="ns__line ns__line--flow"
            d="M104.8 80.5 C 110 84.5, 117 90, 124 98"
          />
        </g>

        <!-- Узлы. В каждом состоянии горит ровно один -->
        <g class="ns__node" :class="{ 'is-on': state === 'form' && live }">
          <path d="M108.4 70 L108.4 78 M104.4 74 L112.4 74" />
        </g>
        <g class="ns__node" :class="{ 'is-on': state === 'breath' && live }">
          <path d="M104.4 75 L104.4 83 M100.4 79 L108.4 79" />
        </g>
        <!-- «Вместе»: узел стоит на пересечении оси спинки и линии перегородки -
             одна точка на две задачи. Выноска ведёт к подписи на поле -->
        <g class="ns__node ns__node--both" :class="{ 'is-on': bothOn }">
          <path class="ns__leader" d="M106 64 L120 50" />
          <path d="M104.4 61.6 L104.4 69.6 M100.4 65.6 L108.4 65.6" />
        </g>
      </svg>

      <!-- Пометки на полях рисунка. Координаты пересчитаны из системы
           рисунка (кадр 62 26 72 104): доля по ширине = (x - 62) / 0.72,
           доля по высоте = (y - 26) / 1.04 -->
      <span class="mono ns__tag ns__tag--tip" :class="{ 'is-on': formOn && soloOn }">{{ labels.tip }}</span>
      <span class="mono ns__tag ns__tag--dorsum" :class="{ 'is-on': formOn && soloOn }">{{ labels.dorsum }}</span>
      <span class="mono ns__tag ns__tag--septum" :class="{ 'is-on': breathOn && soloOn }">{{ labels.septum }}</span>
      <span class="mono ns__tag ns__tag--airway" :class="{ 'is-on': breathOn && soloOn }">{{ labels.airway }}</span>
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
  max-inline-size: var(--ns-size, 22rem);
  /* Пропорция кадра рисунка - та же, что в viewBox */
  aspect-ratio: 72 / 104;
}

.ns__svg {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  /* Выноска и подписи выходят за кадр вправо - обрезать нечем */
  overflow: visible;
}

/* --- Линия лица --- */

/*
  ⚠️ Контур открывается ШТОРКОЙ, как и вся остальная разметка.
  Через stroke-dashoffset нельзя: вместе с vector-effect: non-scaling-stroke
  штрих считается в экранных пикселях, а pathLength приводит длину пути
  к единице - линия разваливается на куски. На этом уже обожглись.
*/
.ns__face {
  fill: none;
  stroke: var(--ink);
  stroke-width: 1.7px;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

/* --- Разметка --- */

.ns__rule,
.ns__line {
  fill: none;
  stroke-dasharray: var(--dash-on) var(--dash-off);
  /* Штрих и толщина считаются в экранных пикселях, а не в системе рисунка:
     кадр 72 единицы растянут до 300 px, и без этого шаг пунктира разъехался бы
     с разметкой всей остальной страницы */
  vector-effect: non-scaling-stroke;
}

/* Постоянные линии кадра - обычной серой разметкой сайта */
.ns__rule {
  stroke: var(--rule);
  stroke-width: var(--rule-w);
}

/*
  Линии задач вдвое толще: тонкий цветной пунктир на прокрутке сливается
  с фоном (правка Марка 04.08). По отдельности задача размечена золотом,
  в состоянии «вместе» обе уходят в синий - золото остаётся только на узле.
*/
.ns__line {
  stroke: var(--gold-deep);
  stroke-width: 2px;
  transition: stroke var(--dur-base) var(--ease-out);
}

.ns.is-both .ns__line {
  stroke: var(--blue);
}

/* У пути воздуха шаг крупнее: это движение, а не измерение */
.ns__line--flow {
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

/* Отсчёт при transform-box: view-box идёт от левого верхнего угла КАДРА,
   то есть от точки (62, 16) системы рисунка */
.ns__wipe--h,
.ns__wipe--v {
  transform-origin: 0 0;
}

/* Контур чертится дольше линеек: он длиннее и он главный на рисунке */
.ns__wipe--slow {
  transition-duration: 1500ms;
}

.ns__wipe--d1 {
  transition-delay: 160ms;
}

.ns__wipe--d2 {
  transition-delay: 320ms;
}

.ns__wipe.is-on {
  transform: scale(1);
}

/* --- Узлы --- */

.ns__node path {
  fill: none;
  stroke: var(--gold-deep);
  stroke-width: 1.6px;
  vector-effect: non-scaling-stroke;
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
  /* Узел появляется после того, как линии легли, а не вместе с ними */
  transition-delay: 700ms;
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
  transition-delay: 840ms;
}

/* Подписи стоят у концов своих линий, справа от рисунка: слева от него
   идёт колонка с номером раздела, места там нет */
.ns__tag--tip {
  inset-inline-start: 92%;
  inset-block-start: 41%;
}

.ns__tag--dorsum {
  inset-inline-start: 76%;
  inset-block-start: 62%;
  color: var(--gold-deep);
}

.ns__tag--septum {
  inset-inline-start: 62%;
  inset-block-start: 65%;
  color: var(--gold-deep);
}

/* Подпись пути воздуха стоит ПОД концом дуги, ступенькой ниже подписи
   перегородки - на одной высоте они налезали друг на друга */
.ns__tag--airway {
  inset-inline-start: 84%;
  inset-block-start: 74%;
  color: var(--gold-deep);
}

/* «Вместе»: задачи подписаны синим, узел - золотом */
.ns__tag--form {
  inset-inline-start: 76%;
  inset-block-start: 62%;
  color: var(--blue);
}

.ns__tag--breath {
  inset-inline-start: 84%;
  inset-block-start: 74%;
  color: var(--blue);
}

.ns__tag--both {
  inset-inline-start: 83%;
  inset-block-start: 18%;
  color: var(--gold-deep);
}

@media (max-width: 900px) {
  .ns__plate {
    max-inline-size: var(--ns-size-m, 11rem);
  }
}
</style>
