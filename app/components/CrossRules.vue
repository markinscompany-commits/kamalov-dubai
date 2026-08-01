<!--
  Разметка блока — узел и четыре пунктирных луча, растущие из него.

  По каждому блоку проходит ровно одна вертикаль и одна горизонталь, но рисуются они
  не как две линии, которые где-то пересеклись, а как конструкция из одной точки:
  сначала проявляется крестик-узел, следом из него в четыре стороны прочерчиваются лучи.

  УЗЕЛ (правка Марка, 01.08). Крестик стоит РОВНО в точке пересечения и той же толщины,
  что лучи. Достигается двумя вещами сразу:
  · линии позиционируются по своей середине (сдвиг на половину толщины), а не по краю —
    иначе при толщине 1px крестик уезжает на полпикселя и выглядит криво;
  · лучи начинаются не в самой точке, а от края узла, поэтому штрихи не наползают
    на крестик и центр не «мажется».
  Раньше крестик рисовался поверх линий и читался отдельным элементом — теперь он
  их начало: сплошной центр, дальше пунктир.

  Точку задаёт блок снаружи, переменными --cross-x и --cross-y: «пустое место»
  у каждого блока своё. Размер узла — --cross-node.

  ПОЯВЛЕНИЕ ПРИВЯЗАНО К ПРОКРУТКЕ и происходит ОДИН РАЗ (правка Марка, 01.08):
  разметка прочерчивается, когда точка впервые попала на экран, и остаётся на месте.
  Раньше она сбрасывалась при уходе блока с экрана и рисовалась заново при возврате —
  на длинной странице это выглядело как мигание, а не как чертёж.

  Цвет и толщина берутся снаружи: --rule и --rule-w.
-->
<script setup lang="ts">
interface Props {
  /** Задержка появления узла после того, как точка показалась на экране, мс */
  delay?: number
}

const props = withDefaults(defineProps<Props>(), { delay: 0 })

const origin = ref<HTMLElement | null>(null)
const drawn = ref(false)

let originWatch: IntersectionObserver | null = null

onMounted(() => {
  originWatch = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) return
      drawn.value = true
      // Рисуем один раз: наблюдение больше не нужно
      originWatch?.disconnect()
      originWatch = null
    },
    { threshold: 0 },
  )
  if (origin.value) originWatch.observe(origin.value)
})

onBeforeUnmount(() => {
  originWatch?.disconnect()
})

const style = computed(() => ({ '--delay': `${props.delay}ms` }))
</script>

<template>
  <div class="cross" :class="{ 'cross--on': drawn }" :style="style" aria-hidden="true">
    <!-- Узел. Он же точка отсчёта для наблюдателя: ловим момент, когда он попал на экран -->
    <span ref="origin" class="cross__node" />

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

  /* Размер крестика по внешним концам. Сплошной центр 12px + первый штрих каждого
     луча даёт узел заметнее пунктира, но той же толщины */
  --cross-node: 12px;
  /* Половина узла и половина толщины линии — на них сдвигается всё, чтобы линии
     стояли серединой на точке, а не краем */
  --node-half: calc(var(--cross-node) / 2);
  --line-half: calc(var(--rule-w) / 2);
}

/* --- Узел --- */

.cross__node {
  position: absolute;
  inset-inline-start: calc(var(--cross-x) - var(--node-half));
  inset-block-start: calc(var(--cross-y) - var(--node-half));
  inline-size: var(--cross-node);
  block-size: var(--cross-node);
  /* Две сплошные линии по центру коробки: центр коробки = точка пересечения */
  background:
    linear-gradient(var(--rule), var(--rule)) center / var(--rule-w) 100% no-repeat,
    linear-gradient(var(--rule), var(--rule)) center / 100% var(--rule-w) no-repeat;
  opacity: 0;
}

/* --- Лучи ---
   В покое обрезаны в ноль у самой точки. Начинаются от края узла, а не от центра:
   так штрихи не накладываются на крестик. */

.cross__ray {
  position: absolute;
  display: block;
}

.cross__ray--up,
.cross__ray--down {
  inline-size: var(--rule-w);
  inset-inline-start: calc(var(--cross-x) - var(--line-half));
}

/*
  Направление градиента у каждого луча своё: штрихи должны начинаться ОТ точки,
  иначе у противоположных лучей шаг пунктира не совпадает по фазе и на глаз
  видно, что это две разные линии.
*/
.cross__ray--up {
  inset-block-start: 0;
  block-size: calc(var(--cross-y) - var(--node-half));
  clip-path: inset(100% 0 0 0);
  background-image: repeating-linear-gradient(
    to top,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

.cross__ray--down {
  inset-block-start: calc(var(--cross-y) + var(--node-half));
  inset-block-end: 0;
  clip-path: inset(0 0 100% 0);
  background-image: repeating-linear-gradient(
    to bottom,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

.cross__ray--start,
.cross__ray--end {
  block-size: var(--rule-w);
  inset-block-start: calc(var(--cross-y) - var(--line-half));
}

.cross__ray--start {
  inset-inline-start: 0;
  inline-size: calc(var(--cross-x) - var(--node-half));
  clip-path: inset(0 0 0 100%);
  background-image: repeating-linear-gradient(
    to left,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

.cross__ray--end {
  inset-inline-start: calc(var(--cross-x) + var(--node-half));
  inset-inline-end: 0;
  clip-path: inset(0 100% 0 0);
  background-image: repeating-linear-gradient(
    to right,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

/* --- Появление ---
   Сначала проявляется узел, через 260 мс из него растут лучи. Прочерчивание идёт
   через clip-path, а не через размер: при изменении размера штрихи сжимались бы
   вместе с лучом и шаг пунктира плыл. */

.cross--on .cross__node {
  animation: node-in var(--dur-base) var(--ease-out) var(--delay) both;
}

.cross--on .cross__ray {
  animation-duration: var(--dur-draw);
  animation-timing-function: var(--ease-draw);
  animation-delay: calc(var(--delay) + 260ms);
  animation-fill-mode: both;
}

@keyframes node-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
