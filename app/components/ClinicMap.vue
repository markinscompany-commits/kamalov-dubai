<!--
  Карта для блока «Где принимает» - настоящая география из OpenStreetMap.

  Кадр задан Марком по скриншоту (03.08): в кадре Пальма Джумейра целиком,
  Бурдж-аль-Араб и госпиталь - так человек мгновенно понимает, где это.
  Масштаб обзорный: только берег, острова и артерии города, без жилой сетки.
  Пути сгенерированы скриптом и лежат в utils/clinicMapPaths.ts - руками не
  править, только перегенерация.

  КОНТРАСТ (правка Марка: «карта тусклая, точку не найти»):
  · карта лежит на подложке светлее фона секции - читается как отдельный лист;
  · вода заметно темнее суши;
  · узел госпиталя - красный маркер (конвенция карт) с красной подписью,
    заметно крупнее волосяных линий: точка находится за долю секунды.

  ДВИЖЕНИЕ: слои проявляются по очереди (вода → дороги → наша дорога
  прочерчивается → узел → подписи). Блок ушёл с экрана - рисуется заново
  (useRedrawOnReturn, общий приём разметки).

  ⚠️ RTL: карта - географический рисунок, НЕ зеркалится.
  ⚠️ Пунктиры, узел и кегли на телефоне свои: SVG сжимается втрое, десктопные
  значения превращаются в бисер. Подписи Бурджа и дороги на телефоне скрыты -
  на ширине 360px они нечитаемы и налезают друг на друга.
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
  palm: string
  scale: string
}

const props = defineProps<{ labels: MapLabels }>()

const root = ref<HTMLElement | null>(null)
/*
  ⚠️ Карта рисуется ОДИН раз и не стирается (правка Марка 05.08).
  Общий приём «стёрлось - чертится заново» здесь вредил: маркер госпиталя
  и его подпись приходят в конце цепочки появления (1.5-1.75 с), и при
  каждом возврате блока имя госпиталя это время отсутствовало - выглядело
  как «появляется и исчезает».
*/
const live = useRedrawOnReturn(root, 0.25, true)

/*
  Имя госпиталя для телефона - двумя строками: одной строкой оно на части
  устройств вылезало за обрезанный край карты (правка Марка).
  «Dubai London Hospital» → «Dubai London» + «Hospital».
*/
const nameParts = computed(() => {
  const words = props.labels.hospital.split(' ')
  return [words.slice(0, -1).join(' '), words[words.length - 1] ?? '']
})

const H = HOSPITAL
const B = BURJ
/* Полоса масштаба: 5 км, на воде в левом нижнем углу, левее Марины */
const scaleX0 = 60
const scaleY = VB.h - 56
const scaleLen = KM * 5

/*
  Имя госпиталя - HTML-слой поверх карты, а НЕ <text> внутри SVG.

  ⚠️ Причина - баг WebKit на iPhone (правка Марка 05.08): после каскада
  переходов карты текстовый слой SVG иногда выпадал из отрисовки - маркер
  оставался, а название исчезало. Фигуры (кольцо, точка) этому не подвержены,
  текст - да. Обычному HTML-абзацу поверх карты пропадать нечем.

  Позиции пересчитаны из прежних SVG-координат в проценты кадра.
  ⚠️ NARROW_W = ширина видимого кадра на телефоне - число обязано совпадать
  с aspect-ratio в @media (max-width: 700px) ниже.
*/
const NARROW_W = 830

const nameWideStyle = {
  insetInlineStart: `${(((H.x + 34) / VB.w) * 100).toFixed(2)}%`,
  insetBlockStart: `${(((H.y - 13) / VB.h) * 100).toFixed(2)}%`,
}

/* На телефоне подпись стоит ПОД маркером, правым краем к 745 (см. прежнее
   пояснение у SVG-подписи: запас ~85 единиц от кромки - видимая ширина гуляет) */
const nameNarrowStyle = {
  insetInlineEnd: `${(((NARROW_W - 745) / NARROW_W) * 100).toFixed(2)}%`,
  insetBlockStart: `${(((H.y + 48) / VB.h) * 100).toFixed(2)}%`,
}
</script>

<template>
  <div ref="root" class="map" :class="{ 'map--live': live }">
    <svg
      class="map__svg"
      :viewBox="`0 0 ${VB.w} ${VB.h}`"
      preserveAspectRatio="xMinYMin slice"
      role="img"
      :aria-label="labels.alt"
      fill="none"
    >
      <!-- Лист карты: светлее фона секции, с волосяной рамкой -->
      <rect class="map__sheet" x="0" y="0" :width="VB.w" :height="VB.h" />

      <!-- Море и острова. Обводка воды рисует только берег: замыкающие отрезки
           полигона лежат далеко за рамкой -->
      <g class="map__water-wrap">
        <path class="map__water" :d="water" />
        <path v-for="(d, i) in islands" :key="`i${i}`" class="map__island" :d="d" />

        <text class="map__t map__t--sea" x="235" y="112">{{ labels.sea }}</text>
        <!-- Подпись Пальмы: на широких экранах внутри полумесяца, на телефоне -
             на воде под островом, чтобы не закрывать сам силуэт (правка Марка) -->
        <text class="map__t map__t--sea map__t--palm map__t--palm-wide" x="392" y="302">{{ labels.palm }}</text>
        <!-- ⚠️ y в пределах viewBox (576), x с запасом от левой рамки: на 130
             первую букву срезало краем -->
        <text class="map__t map__t--sea map__t--palm map__t--palm-narrow" x="165" y="392">{{ labels.palm }}</text>

        <!-- Север и честный масштаб -->
        <g class="map__hairgroup">
          <path class="map__hair" d="M 70 76 L 70 46 M 64 54 L 70 46 L 76 54" />
          <text class="map__t map__t--soft" x="70" y="94" text-anchor="middle">N</text>
          <path
            class="map__hair"
            :d="`M ${scaleX0} ${scaleY - 4} V ${scaleY + 4} M ${scaleX0} ${scaleY} H ${scaleX0 + scaleLen} M ${scaleX0 + scaleLen} ${scaleY - 4} V ${scaleY + 4}`"
          />
          <text class="map__t map__t--soft" :x="scaleX0 + scaleLen / 2" :y="scaleY - 12" text-anchor="middle">
            {{ labels.scale }}
          </text>
        </g>
      </g>

      <!-- Дороги: артерии города тремя весами -->
      <g class="map__minor">
        <path v-for="(d, i) in roadsMinor" :key="`n${i}`" :d="d" />
      </g>
      <g class="map__mid">
        <path v-for="(d, i) in roadsMid" :key="`m${i}`" :d="d" />
      </g>
      <g class="map__main">
        <path v-for="(d, i) in roadsMain" :key="`a${i}`" :d="d" />
      </g>

      <!-- Jumeirah Beach Road: пунктир языка сайта, открывается клипом -->
      <g class="map__accent-wrap">
        <path id="clinic-road" class="map__accent" :d="roadAccent ?? ''" />
      </g>
      <!-- ⚠️ Смещение подобрано по кадру: начало цепи D94 лежит за нижней рамкой
           (дорога уходит к Марине), маленькие проценты невидимы -->
      <text class="map__t map__t--road" dy="-7">
        <textPath href="#clinic-road" startOffset="47%">{{ labels.road }}</textPath>
      </text>

      <!-- Бурдж-аль-Араб: контур паруса на своём острове -->
      <g class="map__burj">
        <path
          class="map__hair"
          :d="`M ${B.x} ${B.y - 3} L ${B.x} ${B.y - 27} M ${B.x} ${B.y - 25} Q ${B.x - 13} ${B.y - 15} ${B.x - 14} ${B.y - 3} L ${B.x} ${B.y - 3}`"
        />
        <text class="map__t map__t--soft map__t--burj" :x="B.x - 18" :y="B.y + 16" text-anchor="end">
          {{ labels.burj }}
        </text>
      </g>

      <!-- Узел госпиталя: «мишень» - сплошное кольцо с точкой в центре.
           ⚠️ БЕЗ креста и БЕЗ пунктира: крест внутри пунктирного кольца на
           телефоне читался как свастика (правка Марка 04.08) - форма запрещена -->
      <g class="map__node map__node--wide">
        <circle class="map__ring" :cx="H.x" :cy="H.y" r="17" />
        <circle class="map__dot" :cx="H.x" :cy="H.y" r="5" />
      </g>
      <g class="map__node map__node--narrow" aria-hidden="true">
        <circle class="map__ring" :cx="H.x" :cy="H.y" r="26" />
        <circle class="map__dot" :cx="H.x" :cy="H.y" r="8" />
      </g>

    </svg>

    <!-- Подпись узла: имя тем же красным, что маркер. HTML-слой, не SVG-текст -
         см. пояснение у nameWideStyle в скрипте. На широких экранах справа от
         кольца (+ район), на телефоне - двумя строками под маркером, правым
         краем к нему; район на телефоне не выводим, он есть в адресе под картой -->
    <p class="map__name map__name--wide" :style="nameWideStyle">
      <span class="map__name-title">{{ labels.hospital }}</span>
      <span class="map__name-area">{{ labels.area }}</span>
    </p>
    <p class="map__name map__name--narrow" :style="nameNarrowStyle" aria-hidden="true">
      <span class="map__name-title">{{ nameParts[0] }}</span>
      <span class="map__name-title">{{ nameParts[1] }}</span>
    </p>
  </div>
</template>

<style scoped>
.map {
  /* От карты позиционируется HTML-подпись госпиталя */
  position: relative;
  /* Кегли подписи считаются от ширины карты, как раньше масштабировался
     SVG-текст: контейнерные единицы дают тот же эффект для HTML-слоя */
  container-type: inline-size;
  inline-size: 100%;
  /*
    Пропорция видимого окна карты. На десктопе равна viewBox (1200x576 - ничего
    не режется), на телефоне окно уже - preserveAspectRatio="xMinYMin slice"
    обрезает КАРТУ СПРАВА (правка Марка: на узком экране правая пустая часть
    только сжимала важное). ⚠️ При перегенерации данных с другим кадром
    поправить числа и здесь, и NARROW_W в скрипте.
  */
  aspect-ratio: calc(1200 / 576);
  overflow: hidden;
}

.map__svg {
  display: block;
  inline-size: 100%;
  block-size: 100%;
}

/* --- Лист, вода, суша --- */

.map__sheet {
  fill: var(--paper-raised);
  stroke: var(--rule-faint);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.map__water {
  /* Вода заметно темнее суши - карта перестаёт быть тусклой (правка Марка) */
  fill: color-mix(in srgb, var(--ink-faint) 34%, var(--paper-raised));
  stroke: var(--ink-faint);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.map__island {
  fill: var(--paper-raised);
  stroke: color-mix(in srgb, var(--ink-faint) 70%, transparent);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

/* --- Дороги --- */

.map__minor path,
.map__mid path,
.map__main path {
  stroke: var(--ink-faint);
  vector-effect: non-scaling-stroke;
}

.map__minor path {
  stroke-width: 0.6px;
  opacity: 0.45;
}

.map__mid path {
  stroke-width: 0.8px;
  opacity: 0.65;
}

.map__main path {
  stroke-width: 1.1px;
  opacity: 0.85;
}

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

/* --- Узел: красный маркер-«мишень» (правка Марка) - конвенция карт, точка
       находится мгновенно. Терракотовый оттенок, чтобы не спорил с палитрой.
       ⚠️ Кольцо СПЛОШНОЕ и без креста - см. комментарий у разметки узла --- */

.map {
  --map-marker: #A93C33;
}

.map__ring {
  stroke: var(--map-marker);
  stroke-width: 1.5px;
  vector-effect: non-scaling-stroke;
}

.map__dot {
  fill: var(--map-marker);
}

.map__node--narrow,
.map__t--palm-narrow {
  display: none;
}

/* --- Имя госпиталя: HTML-слой поверх карты --- */

.map__name {
  position: absolute;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35cqw;
  font-family: var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  line-height: 1.15;
  pointer-events: none;
  /* Подложка вместо SVG-обводки: подпись читается поверх линий дорог */
  text-shadow:
    1px 1px 0 var(--paper-raised),
    -1px 1px 0 var(--paper-raised),
    1px -1px 0 var(--paper-raised),
    -1px -1px 0 var(--paper-raised),
    0 0 6px var(--paper-raised);
}

.map__name-title {
  /* 14 единиц кадра из 1200, как у прежнего SVG-текста */
  font-size: max(1.17cqw, 10px);
  font-weight: 500;
  color: var(--map-marker);
}

.map__name-area {
  font-size: max(0.92cqw, 9px);
  color: var(--ink-soft);
}

/* ⚠️ display у узкой подписи задаётся ЗДЕСЬ, после базового .map__name:
   у селекторов одинаковый вес, побеждает порядок - выше по файлу правило
   скрытия проигрывало бы базовому display: flex */
.map__name--narrow {
  display: none;
  align-items: flex-end;
  text-align: end;
}

/* --- Подписи --- */

.map__t {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  fill: var(--ink-soft);
  /* Подложка цвета листа: подпись читается поверх линий */
  stroke: var(--paper-raised);
  stroke-width: 4px;
  paint-order: stroke;
  stroke-linejoin: round;
}

.map__t--sea {
  letter-spacing: 0.22em;
  stroke: none;
  text-anchor: middle;
}

.map__t--soft {
  font-size: 11px;
}

.map__t--road {
  font-size: 9.5px;
  letter-spacing: 0.14em;
}

/* --- Покой --- */

.map__water-wrap,
.map__minor,
.map__mid,
.map__main,
.map__burj,
.map__node,
.map__name,
.map__t--road {
  opacity: 0;
}

.map__node {
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.72);
}

/*
  --- Появление: карта собирается слоями, как рисунок ---

  ⚠️ НЕ анимациями, а переходами к состояниям, прописанным в каскаде.
  На animation с fill both уже обожглись: видимость держалась только на
  «замершем кадре» анимации, и iOS Safari его сбрасывал - подпись госпиталя
  появлялась и пропадала (правка Марка 04.08). У transition конечное состояние
  задаёт обычное CSS-правило (opacity: 1), сбрасывать нечего: даже если переход
  не сыграет, элемент просто виден.

  Класс map--live ставится один раз и не снимается (см. пояснение у
  useRedrawOnReturn в скрипте): карта не перерисовывается при возвратах.
*/

.map--live .map__water-wrap,
.map--live .map__minor,
.map--live .map__mid,
.map--live .map__main,
.map--live .map__burj,
.map--live .map__node,
.map--live .map__name,
.map--live .map__t--road {
  opacity: 1;
  transition: opacity var(--dur-slow) var(--ease-out);
}

.map--live .map__minor {
  transition-delay: 250ms;
}

.map--live .map__mid {
  transition-delay: 420ms;
}

.map--live .map__main {
  transition-delay: 590ms;
}

.map--live .map__accent-wrap {
  clip-path: inset(0);
  transition: clip-path var(--dur-draw) var(--ease-draw) 700ms;
}

.map--live .map__burj {
  transition-delay: 1000ms;
}

.map--live .map__t--road {
  transition-delay: 1250ms;
}

.map--live .map__node {
  transform: scale(1);
  transition:
    opacity var(--dur-base) var(--ease-out) 1500ms,
    transform var(--dur-base) var(--ease-out) 1500ms;
}

.map--live .map__name {
  transition: opacity var(--dur-base) var(--ease-out) 1750ms;
}

/*
  Телефон: SVG сжимается почти втрое (1000 единиц на ~355px экрана), поэтому
  крупнее и пунктиры, и узел, и кегли. Подписи Бурджа и дороги скрыты - на этом
  масштабе они нечитаемы и налезают на соседей; Бурдж остаётся контуром.
*/
@media (max-width: 700px) {
  /* Окно уже, правая часть кадра (пустой Al Quoz) обрезается - важное крупнее.
     830, а не 880: на реальном телефоне Марка окно оказалось уже расчётного
     и кромка срезала маркер - взят запас */
  .map {
    aspect-ratio: calc(830 / 576);
  }

  .map__accent {
    stroke-dasharray: 11 16;
  }

  .map__ring {
    stroke-width: 2px;
  }

  .map__node--wide,
  .map__name--wide,
  .map__t--palm-wide {
    display: none;
  }

  /* ⚠️ Для SVG-групп включение через display: inline, не initial:
     initial на SVG-элементах в Safari ведёт себя ненадёжно */
  .map__node--narrow,
  .map__t--palm-narrow {
    display: inline;
  }

  .map__name--narrow {
    display: flex;
  }

  /* 22 единицы кадра из 830 видимых - как у прежнего SVG-текста телефона */
  .map__name-title {
    font-size: max(2.65cqw, 12px);
    letter-spacing: 0.04em;
  }

  .map__t {
    font-size: 22px;
    stroke-width: 8px;
  }

  .map__t--soft {
    font-size: 19px;
  }

  .map__t--burj,
  .map__t--road {
    display: none;
  }
}
</style>
