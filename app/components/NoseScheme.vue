<!--
  Рисунок блока операций - артворк Марка из Фигмы (05.08.2026).

  Геометрия целиком живёт в `utils/schemeArt.ts` (собран из
  design/scheme-figma-remake/, см. заголовок модуля). Здесь - только
  отрисовка и анимации:

  · контур лица прочерчивается сверху вниз при появлении;
  · серые уровни - следом, слева направо;
  · линии задач - шторками по направлению линии, с лесенкой задержек;
  · узлы, выноски и подписи проявляются последними.

  Состояния: form (ось спинки золотом) → breath (путь воздуха) →
  both (линии синие, узел и «одна операция» золотом). Сменилось состояние -
  шторка закрывается тем же движением, каким открылась.

  ⚠️ Шторки, а не stroke-dashoffset: у линий пунктир из Фигмы (4/6 и 6/8),
  сдвиг штриховки ломал бы шаг. Для контура закрывающаяся шторка тоже
  подходит: он в каждом состоянии один и тот же и не перечерчивается.

  ⚠️ Подписи запечены в SVG кривыми (текст Фигма перевела в контуры) -
  это осознанное отступление от манифеста, расстановка подписей - часть
  артворка. В английской версии они останутся русскими, пока Марк не отдаст
  английские кадры - отмечено в work-plan.
-->
<script setup lang="ts">
import { SCHEME_FACE, SCHEME_LEVELS, SCHEME_STATES, SCHEME_VIEWBOX } from '~/utils/schemeArt'

interface Props {
  state?: 'form' | 'breath' | 'both'
  /** Описание рисунка для незрячих - подписи в кривых им недоступны */
  alt: string
}

const props = withDefaults(defineProps<Props>(), { state: 'form' })

/* Шторки адресуются по id, а рисунок стоит на странице не в одном
   экземпляре - идентификаторы обязаны быть разными у каждого */
const uid = useId()

const root = ref<HTMLElement | null>(null)
/* Общий приём сайта: ушло с экрана - стёрлось, вернулось - чертится заново */
const live = useRedrawOnReturn(root, 0.2)

const states = ['form', 'breath', 'both'] as const

function stateOn(s: (typeof states)[number]) {
  return live.value && props.state === s
}
</script>

<template>
  <!-- Класс ns--{state} ничего не стилизует: по нему проверочный скрипт
       (tools/surgery-check.mjs) видит, какое состояние сейчас на рисунке -->
  <figure ref="root" class="ns" :class="[`ns--${state}`, { 'is-live': live }]">
    <div class="ns__plate">
      <svg class="ns__svg" :viewBox="SCHEME_VIEWBOX" role="img" :aria-label="alt">
        <defs>
          <!-- Контур лица: сверху вниз, медленно - он главный -->
          <clipPath :id="`face-${uid}`">
            <rect class="ns__wipe ns__wipe--v ns__wipe--slow" :class="{ 'is-on': live }" x="0" y="0" width="460" height="570" />
          </clipPath>
          <!-- Уровни: слева направо, следом за контуром -->
          <clipPath :id="`lv-${uid}`">
            <rect class="ns__wipe ns__wipe--h ns__wipe--d1" :class="{ 'is-on': live }" x="0" y="0" width="460" height="570" />
          </clipPath>
          <!-- Линии задач: своя шторка на каждую, лесенка задержек -->
          <template v-for="s in states" :key="s">
            <clipPath v-for="(line, i) in SCHEME_STATES[s].lines" :id="`ln-${s}-${i}-${uid}`" :key="i">
              <rect
                class="ns__wipe ns__wipe--h"
                :class="[`ns__wipe--d${i + 1}`, { 'is-on': stateOn(s) }]"
                x="0" y="0" width="460" height="570"
              />
            </clipPath>
          </template>
        </defs>

        <!-- Контур лица -->
        <g :clip-path="`url(#face-${uid})`">
          <path
            class="ns__face"
            :d="SCHEME_FACE"
            stroke="#0A3454"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />
        </g>

        <!-- Уровни переносицы и кончика -->
        <g :clip-path="`url(#lv-${uid})`">
          <path v-for="(d, i) in SCHEME_LEVELS" :key="i" :d="d" stroke="#8BA1B1" stroke-dasharray="4 6" fill="none" />
        </g>

        <!-- Состояния -->
        <g v-for="s in states" :key="s">
          <g v-for="(line, i) in SCHEME_STATES[s].lines" :key="`l${i}`" :clip-path="`url(#ln-${s}-${i}-${uid})`">
            <path
              :d="line.d"
              :stroke="line.stroke"
              stroke-width="2"
              :stroke-dasharray="line.dash"
              :stroke-linecap="line.cap ? 'round' : undefined"
              fill="none"
            />
          </g>

          <!-- Узлы и выноски проявляются после линий -->
          <g class="ns__fade ns__fade--nodes" :class="{ 'is-on': stateOn(s) }">
            <path
              v-for="(node, i) in SCHEME_STATES[s].nodes"
              :key="`n${i}`"
              :d="node.d"
              :stroke="node.stroke"
              :stroke-width="node.width"
              :stroke-dasharray="node.dash ?? undefined"
              fill="none"
            />
          </g>

          <!-- Подписи (кривые из Фигмы) приходят последними -->
          <g class="ns__fade ns__fade--labels" :class="{ 'is-on': stateOn(s) }">
            <path v-for="(label, i) in SCHEME_STATES[s].labels" :key="`t${i}`" :d="label.d" :fill="label.fill" />
          </g>
        </g>
      </svg>
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
  /* Кадр показывается в размере, близком к авторскому (460px): подписи
     нарисованы под кегль ~11px и при сильном уменьшении гаснут */
  max-inline-size: var(--ns-size, 28.75rem);
  /* Пропорция кадра - та же, что в viewBox (460 × 570) */
  aspect-ratio: 460 / 570;
}

.ns__svg {
  display: block;
  inline-size: 100%;
  block-size: 100%;
}

/* --- Шторки, которыми всё прочерчивается --- */

.ns__wipe {
  transform-box: view-box;
  transition: transform var(--dur-draw) var(--ease-draw);
}

.ns__wipe--h {
  transform: scaleX(0);
}

.ns__wipe--v {
  transform: scaleY(0);
}

.ns__wipe--h,
.ns__wipe--v {
  transform-origin: 0 0;
}

/* Контур длиннее любой линии - чертится дольше */
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

/* --- Узлы и подписи --- */

.ns__fade {
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-out);
}

.ns__fade--nodes.is-on {
  opacity: 1;
  /* Узел появляется после того, как линии легли */
  transition-delay: 700ms;
}

.ns__fade--labels.is-on {
  opacity: 1;
  /* Подпись приходит последней */
  transition-delay: 840ms;
}

@media (max-width: 900px) {
  .ns__plate {
    max-inline-size: var(--ns-size-m, 100%);
  }
}
</style>
