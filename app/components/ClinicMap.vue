<!--
  Карта Джумейры для блока «Где принимает» - настоящая география.

  После правки Марка (03.08, «нарисуй как реально выглядит») карта строится из
  данных OpenStreetMap: берег с маринами, остров Бурдж-аль-Араба, реальная сетка
  кварталов Umm Suqeim, Jumeirah Beach Road (в OSM - Jumeira St, D94) проходит
  точно через точку госпиталя. Пути сгенерированы скриптом и лежат в
  utils/clinicMapPaths.ts - руками их не править, только перегенерация.

  Стиль - перо сайта: земля цвета бумаги, море тонировано разбелом разметочного
  цвета, улицы волосяными линиями трёх весов, наша дорога - пунктир 4/6, узел
  госпиталя - крест с пунктирным кольцом (тот же язык, что CrossRules).

  Подписи важных мест идут с «подложкой» цвета земли (paint-order: stroke) -
  иначе они нечитаемы поверх уличной сетки.

  ДВИЖЕНИЕ: карта проявляется слоями, как рисунок - море, сетка кварталов от
  мелкой к крупной, затем прочерчивается наша дорога, ставится узел, подписи.
  Блок ушёл с экрана целиком - стирается и при возврате рисуется заново
  (правило разметки сайта, наблюдатель с запасом WATCH_SLACK).

  ⚠️ RTL: карта - географический рисунок, при арабской версии НЕ зеркалится.
  ⚠️ Пунктир и размеры узла на телефоне задаются отдельными значениями: SVG
  сжимается вместе с содержимым, и десктопные величины превращаются в гребёнку.
-->
<script setup lang="ts">
import {
  VB,
  HOSPITAL,
  BURJ,
  KM,
  water,
  islands,
  roadAccent,
  roadsMain,
  roadsMid,
  roadsMinor,
} from '~/utils/clinicMapPaths'

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

const root = ref<HTMLElement | null>(null)
// Рисуется при появлении, стирается при уходе - общий приём разметки сайта
const live = useRedrawOnReturn(root, 0.25)

/* Геометрия узла и мелочей считается от настоящих координат */
const H = HOSPITAL
const B = BURJ
const scaleX0 = 60
const scaleY = VB.h - 34
</script>

<template>
  <div ref="root" class="map" :class="{ 'map--live': live }">
    <svg
      class="map__svg"
      :viewBox="`0 0 ${VB.w} ${VB.h}`"
      role="img"
      :aria-label="labels.alt"
      fill="none"
    >
      <!-- Море: тонированный полигон. Обводка рисует только линию берега:
           замыкающие отрезки полигона лежат далеко за рамкой -->
      <g class="map__water-wrap">
        <path class="map__water" :d="water" />
        <path v-for="(d, i) in islands" :key="`i${i}`" class="map__island" :d="d" />
        <text class="map__t map__t--sea" :x="175" :y="205">{{ labels.sea }}</text>

        <!-- Север и честный масштаб: 1 км в единицах карты, оба над водой -->
        <g class="map__hairgroup">
          <path class="map__hair" d="M 64 76 L 64 46 M 58 54 L 64 46 L 70 54" />
          <text class="map__t map__t--soft" x="64" y="94" text-anchor="middle">N</text>
          <path
            class="map__hair"
            :d="`M ${scaleX0} ${scaleY - 4} V ${scaleY + 4} M ${scaleX0} ${scaleY} H ${scaleX0 + KM} M ${scaleX0 + KM} ${scaleY - 4} V ${scaleY + 4}`"
          />
          <text class="map__t map__t--soft" :x="scaleX0 + KM / 2" :y="scaleY - 12" text-anchor="middle">
            {{ labels.scale }}
          </text>
        </g>
      </g>

      <!-- Кварталы: три веса, от жилой сетки к артериям -->
      <g class="map__minor">
        <path v-for="(d, i) in roadsMinor" :key="`n${i}`" :d="d" />
      </g>
      <g class="map__mid">
        <path v-for="(d, i) in roadsMid" :key="`m${i}`" :d="d" />
      </g>
      <g class="map__main">
        <path v-for="(d, i) in roadsMain" :key="`a${i}`" :d="d" />
      </g>

      <!-- Jumeirah Beach Road: непрерывная нить D94, пунктир языка сайта.
           Открывается клипом слева направо - пунктир сжимать нельзя, плывёт шаг -->
      <g class="map__accent-wrap">
        <path id="clinic-road" class="map__accent" :d="roadAccent ?? ''" />
      </g>
      <text class="map__t map__t--road" dy="-7">
        <textPath href="#clinic-road" startOffset="46%">{{ labels.road }}</textPath>
      </text>

      <!-- Бурдж-аль-Араб: контур паруса на своём острове -->
      <g class="map__burj">
        <path
          class="map__hair"
          :d="`M ${B.x} ${B.y - 4} L ${B.x} ${B.y - 36} M ${B.x} ${B.y - 33} Q ${B.x - 17} ${B.y - 20} ${B.x - 18} ${B.y - 4} L ${B.x} ${B.y - 4}`"
        />
        <text class="map__t map__t--soft" :x="B.x - 2" :y="B.y + 26" text-anchor="middle">
          {{ labels.burj }}
        </text>
      </g>

      <!-- Узел госпиталя: крест и пунктирное кольцо-прицел. Размер на телефоне
           свой - десктопный узел при сжатии SVG превращается в точку -->
      <g class="map__node map__node--wide">
        <circle class="map__ring" :cx="H.x" :cy="H.y" r="17" />
        <path class="map__cross" :d="`M ${H.x} ${H.y - 13} V ${H.y + 13} M ${H.x - 13} ${H.y} H ${H.x + 13}`" />
      </g>
      <g class="map__node map__node--narrow" aria-hidden="true">
        <circle class="map__ring map__ring--narrow" :cx="H.x" :cy="H.y" r="30" />
        <path class="map__cross" :d="`M ${H.x} ${H.y - 22} V ${H.y + 22} M ${H.x - 22} ${H.y} H ${H.x + 22}`" />
      </g>

      <!-- Подпись узла: на широких экранах справа от кольца, на телефоне слева
           и без координат - справа она упиралась в край карты -->
      <g class="map__label map__label--wide">
        <text class="map__t map__t--name" :x="H.x + 30" :y="H.y - 8">{{ labels.hospital }}</text>
        <text class="map__t map__t--soft" :x="H.x + 30" :y="H.y + 12">{{ labels.area }}</text>
        <text class="map__t map__t--soft" :x="H.x + 30" :y="H.y + 30">{{ labels.coords }}</text>
      </g>
      <g class="map__label map__label--narrow" aria-hidden="true">
        <text class="map__t map__t--name" :x="H.x - 42" :y="H.y - 4" text-anchor="end">{{ labels.hospital }}</text>
        <text class="map__t map__t--soft" :x="H.x - 42" :y="H.y + 24" text-anchor="end">{{ labels.area }}</text>
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

/* --- Слои воды и суши --- */

.map__water {
  /* Разбел разметочного цвета: море того же пера, что весь сайт, но заметно */
  fill: color-mix(in srgb, var(--ink-faint) 19%, var(--paper-deep));
  stroke: var(--ink-faint);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.map__island {
  fill: var(--paper-deep);
  stroke: var(--ink-faint);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

/* --- Улицы: волосяные линии трёх весов --- */

.map__minor path,
.map__mid path,
.map__main path {
  stroke: var(--ink-faint);
  vector-effect: non-scaling-stroke;
}

.map__minor path {
  stroke-width: 0.55px;
  opacity: 0.4;
}

.map__mid path {
  stroke-width: 0.7px;
  opacity: 0.6;
}

.map__main path {
  stroke-width: 1px;
  opacity: 0.8;
}

/* --- Наша дорога и узел --- */

.map__accent {
  stroke: var(--ink);
  stroke-width: var(--rule-w);
  vector-effect: non-scaling-stroke;
  stroke-dasharray: var(--dash-on) var(--dash-off);
}

.map__accent-wrap {
  clip-path: inset(0 100% 0 0);
}

.map__hair {
  stroke: var(--ink-soft);
  stroke-width: 1px;
  vector-effect: non-scaling-stroke;
}

.map__cross {
  stroke: var(--ink);
  stroke-width: var(--rule-w);
  vector-effect: non-scaling-stroke;
}

.map__ring {
  stroke: var(--ink);
  stroke-width: var(--rule-w);
  vector-effect: non-scaling-stroke;
  stroke-dasharray: var(--dash-on) var(--dash-off);
}

/* Узлы и подписи узла: на широких экранах свои, на телефоне свои */
.map__node--narrow,
.map__label--narrow {
  display: none;
}

/* --- Подписи --- */

.map__t {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  fill: var(--ink-soft);
  /* Подложка цвета земли: подпись остаётся читаемой поверх уличной сетки */
  stroke: var(--paper-deep);
  stroke-width: 4px;
  paint-order: stroke;
  stroke-linejoin: round;
}

.map__t--sea {
  letter-spacing: 0.22em;
  stroke: none;
}

.map__t--name {
  font-size: 12px;
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

/* --- Покой: до появления видно только фон секции --- */

.map__water-wrap,
.map__minor,
.map__mid,
.map__main,
.map__burj,
.map__node,
.map__label,
.map__t--road {
  opacity: 0;
}

/* --- Появление: карта собирается слоями, как рисунок --- */

.map--live .map__water-wrap {
  animation: map-in var(--dur-slow) var(--ease-out) both;
}

.map--live .map__minor {
  animation: map-in var(--dur-slow) var(--ease-out) 250ms both;
}

.map--live .map__mid {
  animation: map-in var(--dur-slow) var(--ease-out) 420ms both;
}

.map--live .map__main {
  animation: map-in var(--dur-slow) var(--ease-out) 590ms both;
}

.map--live .map__accent-wrap {
  animation: map-road var(--dur-draw) var(--ease-draw) 700ms both;
}

.map--live .map__burj {
  animation: map-in var(--dur-slow) var(--ease-out) 1000ms both;
}

.map--live .map__t--road {
  animation: map-in var(--dur-slow) var(--ease-out) 1250ms both;
}

.map--live .map__node--wide,
.map--live .map__node--narrow {
  transform-box: fill-box;
  transform-origin: center;
  animation: map-node var(--dur-base) var(--ease-out) 1500ms both;
}

.map--live .map__label {
  animation: map-in var(--dur-base) var(--ease-out) 1750ms both;
}

@keyframes map-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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

/*
  Телефон: SVG сжимается примерно в 2.4 раза, поэтому у пунктира, узла и
  подписей свои крупные значения - иначе гребёнка и нечитаемый бисер.
  Кегли посчитаны так, чтобы на экране 375px выходило ~8px.
*/
@media (max-width: 700px) {
  .map__accent {
    stroke-dasharray: 10 14;
  }

  .map__ring {
    stroke-dasharray: 9 13;
  }

  .map__node--wide,
  .map__label--wide {
    display: none;
  }

  .map__node--narrow,
  .map__label--narrow {
    display: initial;
  }

  .map__t {
    font-size: 19px;
    stroke-width: 7px;
  }

  .map__t--name {
    font-size: 20px;
    letter-spacing: 0.05em;
  }

  .map__t--soft {
    font-size: 17px;
  }

  .map__t--road {
    font-size: 16px;
  }
}
</style>
