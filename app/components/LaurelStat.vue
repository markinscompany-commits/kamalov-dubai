<!--
  Цифра в лавровой ветви. Три таких стоят в ряд и держат блок «О докторе»:
  глазу нужно за что-то зацепиться раньше, чем он начнёт читать текст.

  Ветви нарисованы в SVG прямо здесь, а не картинкой: они должны быть в фирменном
  золоте, тонкими и чёткими на любом экране. Растровая картинка на плотном экране
  замылится, а цвет придётся править в графическом редакторе.

  ⚠️ Никаких emoji и готовых иконок - только своя графика (правило Markins).
-->
<script setup lang="ts">
interface Props {
  /** Что стоит внутри венка: «30+», «2017», «DHA» */
  value: string
  /** Подпись под венком */
  caption: string
}

defineProps<Props>()

/*
  Одна ветвь: стебель и семь листьев вдоль него. Правая - зеркальная копия,
  поэтому венок симметричен по построению, а не на глаз.
  Координаты в системе 120x120, венок открыт сверху.
*/
const leaves = [
  { x: 51, y: 104, a: -28 },
  { x: 42, y: 95, a: -40 },
  { x: 34, y: 84, a: -54 },
  { x: 28, y: 71, a: -66 },
  { x: 24, y: 57, a: -78 },
  { x: 23, y: 43, a: -92 },
  { x: 26, y: 30, a: -108 },
]
</script>

<template>
  <figure class="laurel">
    <div class="laurel__mark">
      <svg class="laurel__wreath" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
        <g class="laurel__branch">
          <path d="M60 113 C 40 108, 25 92, 21 72 C 18 55, 20 38, 27 25" />
          <ellipse v-for="(l, i) in leaves" :key="i" :transform="`translate(${l.x} ${l.y}) rotate(${l.a})`" rx="8" ry="3.2" />
        </g>
        <!-- Зеркало: одна и та же ветвь, отражённая относительно середины -->
        <g class="laurel__branch" transform="translate(120 0) scale(-1 1)">
          <path d="M60 113 C 40 108, 25 92, 21 72 C 18 55, 20 38, 27 25" />
          <ellipse v-for="(l, i) in leaves" :key="i" :transform="`translate(${l.x} ${l.y}) rotate(${l.a})`" rx="8" ry="3.2" />
        </g>
      </svg>

      <span class="laurel__value">{{ value }}</span>
    </div>

    <figcaption class="laurel__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.laurel {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-2);
  text-align: center;
}

.laurel__mark {
  position: relative;
  inline-size: 7.5rem;
  block-size: 7.5rem;
  display: grid;
  place-items: center;
}

.laurel__wreath {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
}

/* Ветвь фирменным золотом: обводка у стебля, заливка у листьев */
.laurel__branch path {
  fill: none;
  stroke: var(--gold);
  stroke-width: 2;
  stroke-linecap: round;
}

.laurel__branch ellipse {
  fill: var(--gold);
}

/* Цифра антиквой - она здесь главная, венок только оправа */
.laurel__value {
  position: relative;
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  line-height: 1;
  letter-spacing: -0.01em;
  color: var(--ink);
}

.laurel__caption {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  line-height: 1.4;
  color: var(--ink-soft);
  max-inline-size: 11rem;
}

/* На телефоне венки уменьшены так, чтобы три помещались в один ряд:
   перенос третьего на вторую строку ломает ритм блока */
@media (max-width: 700px) {
  .laurel__mark {
    inline-size: 4.75rem;
    block-size: 4.75rem;
  }

  .laurel__value {
    font-size: 1.375rem;
  }

  .laurel__caption {
    font-size: 0.625rem;
    letter-spacing: 0.08em;
    max-inline-size: 7rem;
  }
}
</style>
