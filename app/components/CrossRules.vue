<!--
  Разметка блока — четыре пунктирных луча, растущие из одной точки.

  По каждому блоку проходит ровно одна вертикаль и одна горизонталь, но рисуются они
  не как две линии, которые где-то пересеклись, а как четыре луча из общей точки.
  Отдельного крестика на пересечении нет (решение Марка): раз лучи и так растут из
  одной точки, она читается сама.

  Точку задаёт блок снаружи, переменными --cross-x и --cross-y: «пустое место»
  у каждого блока своё.

  ПОЯВЛЕНИЕ ПРИВЯЗАНО К ПРОКРУТКЕ. Лучи прочерчиваются, когда на экране появляется
  точка, из которой они растут, и сбрасываются, когда блок целиком ушёл с экрана.
  Долистал обратно — рисуются заново.

  Цвет и толщина берутся снаружи: --rule и --rule-w.
-->
<script setup lang="ts">
interface Props {
  /** Задержка прочерчивания после появления точки, мс */
  delay?: number
}

const props = withDefaults(defineProps<Props>(), { delay: 0 })

const root = ref<HTMLElement | null>(null)
const origin = ref<HTMLElement | null>(null)
const drawn = ref(false)

let originWatch: IntersectionObserver | null = null
let blockWatch: IntersectionObserver | null = null

onMounted(() => {
  // Точка появилась на экране — рисуем
  originWatch = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) drawn.value = true
    },
    { threshold: 0 },
  )
  if (origin.value) originWatch.observe(origin.value)

  // Блок целиком ушёл с экрана — сбрасываем, чтобы при возврате нарисовалось заново
  blockWatch = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) drawn.value = false
    },
    { threshold: 0 },
  )
  if (root.value) blockWatch.observe(root.value)
})

onBeforeUnmount(() => {
  originWatch?.disconnect()
  blockWatch?.disconnect()
})

const style = computed(() => ({ '--delay': `${props.delay}ms` }))
</script>

<template>
  <div ref="root" class="cross" :class="{ 'cross--on': drawn }" :style="style" aria-hidden="true">
    <!-- Точка отсчёта: невидимая, нужна только чтобы поймать её появление на экране -->
    <span ref="origin" class="cross__origin" />

    <span class="cross__ray cross__ray--up" />
    <span class="cross__ray cross__ray--down" />
    <span class="cross__ray cross__ray--start" />
    <span class="cross__ray cross__ray--end" />
  </div>
</template>

<style scoped>
.cross {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cross__origin {
  position: absolute;
  inset-inline-start: var(--cross-x);
  inset-block-start: var(--cross-y);
  inline-size: 1px;
  block-size: 1px;
}

/* В покое лучи спрятаны: обрезаны в ноль у самой точки. Так же они выглядят и после
   сброса, когда блок ушёл с экрана */
.cross__ray {
  position: absolute;
  display: block;
}

/* --- Вертикальные лучи --- */

.cross__ray--up,
.cross__ray--down {
  inline-size: var(--rule-w);
  inset-inline-start: var(--cross-x);
}

/*
  Направление градиента у каждого луча своё: штрихи должны начинаться ОТ точки,
  иначе у противоположных лучей шаг пунктира не совпадает по фазе и на глаз
  видно, что это две разные линии.
*/
.cross__ray--up {
  inset-block-start: 0;
  block-size: var(--cross-y);
  clip-path: inset(100% 0 0 0);
  background-image: repeating-linear-gradient(
    to top,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

.cross__ray--down {
  inset-block-start: var(--cross-y);
  inset-block-end: 0;
  clip-path: inset(0 0 100% 0);
  background-image: repeating-linear-gradient(
    to bottom,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

/* --- Горизонтальные лучи --- */

.cross__ray--start,
.cross__ray--end {
  block-size: var(--rule-w);
  inset-block-start: var(--cross-y);
}

.cross__ray--start {
  inset-inline-start: 0;
  inline-size: var(--cross-x);
  clip-path: inset(0 0 0 100%);
  background-image: repeating-linear-gradient(
    to left,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

.cross__ray--end {
  inset-inline-start: var(--cross-x);
  inset-inline-end: 0;
  clip-path: inset(0 100% 0 0);
  background-image: repeating-linear-gradient(
    to right,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

/* --- Прочерчивание ---
   Запускается, когда точка появилась на экране. clip-path, а не размер: при
   изменении размера штрихи сжимались бы вместе с лучом и шаг пунктира плыл. */

.cross--on .cross__ray {
  animation-duration: var(--dur-draw);
  animation-timing-function: var(--ease-draw);
  animation-delay: var(--delay);
  animation-fill-mode: both;
}

.cross--on .cross__ray--up {
  animation-name: ray-up;
}

.cross--on .cross__ray--down {
  animation-name: ray-down;
}

.cross--on .cross__ray--start {
  animation-name: ray-start;
}

.cross--on .cross__ray--end {
  animation-name: ray-end;
}

@keyframes ray-up {
  from {
    clip-path: inset(100% 0 0 0);
  }
  to {
    clip-path: inset(0);
  }
}

@keyframes ray-down {
  from {
    clip-path: inset(0 0 100% 0);
  }
  to {
    clip-path: inset(0);
  }
}

@keyframes ray-start {
  from {
    clip-path: inset(0 0 0 100%);
  }
  to {
    clip-path: inset(0);
  }
}

@keyframes ray-end {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0);
  }
}

/* RTL: clip-path и направление градиента — свойства физические, логического аналога
   нет. Для арабской версии горизонтальные лучи меняются местами.
   См. design-system.md, раздел 9. */
:global([dir='rtl']) .cross--on .cross__ray--start {
  animation-name: ray-end;
}

:global([dir='rtl']) .cross--on .cross__ray--end {
  animation-name: ray-start;
}
</style>
