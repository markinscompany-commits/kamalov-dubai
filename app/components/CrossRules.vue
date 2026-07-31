<!--
  Разметка блока — крестик и четыре луча, растущие из него.

  Правило Марка: по каждому блоку проходит ровно одна вертикаль и одна горизонталь.
  Но рисуются они не как две линии, которые где-то пересеклись, а как ЧЕТЫРЕ отдельных
  луча: сначала появляется крестик-узел, потом из него в четыре стороны прочерчиваются
  линии до краёв блока. Так разметка читается как то, что хирург рисует от точки, а не
  как чертёжная сетка, случайно наложенная сверху.

  Точку задаёт блок снаружи, переменными --cross-x и --cross-y: «пустое место» у
  каждого блока своё, и Марк отмечает его на скриншоте.

  Цвета берутся снаружи: --rule для лучей, --rule-node для крестика.
-->
<script setup lang="ts">
interface Props {
  /** Задержка появления крестика, мс. Лучи стартуют после него */
  delay?: number
}

const props = withDefaults(defineProps<Props>(), { delay: 0 })

const style = computed(() => ({ '--delay': `${props.delay}ms` }))
</script>

<template>
  <div class="cross" :style="style" aria-hidden="true">
    <span class="cross__ray cross__ray--up" />
    <span class="cross__ray cross__ray--down" />
    <span class="cross__ray cross__ray--start" />
    <span class="cross__ray cross__ray--end" />
    <span class="cross__node" />
  </div>
</template>

<style scoped>
.cross {
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* Луч трогается с места, когда крестик уже проявился */
  --ray-delay: calc(var(--delay) + 260ms);
}

.cross__ray {
  position: absolute;
  display: block;
}

/* --- Вертикальные лучи ---

   ⚠️ Луч сдвигается на половину своей толщины: без этого его КРАЙ садится на
   точку пересечения, а крестик садится на неё ЦЕНТРОМ — и они расходятся на
   полпикселя. Именно это выглядело как «крестик стоит криво». */

.cross__ray--up,
.cross__ray--down {
  inline-size: var(--rule-w);
  inset-inline-start: var(--cross-x);
  translate: -50% 0;
}

/*
  Направление градиента у каждого луча своё: штрихи должны начинаться ОТ крестика,
  иначе у противоположных лучей шаг пунктира не совпадает по фазе и на глаз
  видно, что это две разные линии.
*/
.cross__ray--up {
  inset-block-start: 0;
  block-size: var(--cross-y);
  background-image: repeating-linear-gradient(
    to top,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  animation: ray-up var(--dur-draw) var(--ease-draw) var(--ray-delay) both;
}

.cross__ray--down {
  inset-block-start: var(--cross-y);
  inset-block-end: 0;
  background-image: repeating-linear-gradient(
    to bottom,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  animation: ray-down var(--dur-draw) var(--ease-draw) var(--ray-delay) both;
}

/* --- Горизонтальные лучи --- */

.cross__ray--start,
.cross__ray--end {
  block-size: var(--rule-w);
  inset-block-start: var(--cross-y);
  translate: 0 -50%;
}

.cross__ray--start {
  inset-inline-start: 0;
  inline-size: var(--cross-x);
  background-image: repeating-linear-gradient(
    to left,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  animation: ray-start var(--dur-draw) var(--ease-draw) var(--ray-delay) both;
}

.cross__ray--end {
  inset-inline-start: var(--cross-x);
  inset-inline-end: 0;
  background-image: repeating-linear-gradient(
    to right,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  animation: ray-end var(--dur-draw) var(--ease-draw) var(--ray-delay) both;
}

/* --- Крестик-узел --- */

.cross__node {
  position: absolute;
  inset-inline-start: var(--cross-x);
  inset-block-start: var(--cross-y);
  inline-size: 19px;
  block-size: 19px;
  translate: -50% -50%;
  /* Та же толщина и тот же цвет, что у лучей. Узел читается не как отдельный
     элемент поверх линий, а как сплошной участок на их пересечении: там, где
     штрихи расступаются, стоит целый крест */
  background:
    linear-gradient(var(--rule-node), var(--rule-node)) center / 100% var(--rule-w) no-repeat,
    linear-gradient(var(--rule-node), var(--rule-node)) center / var(--rule-w) 100% no-repeat;
  animation: node-in var(--dur-base) var(--ease-out) var(--delay) both;
}

/* --- Прочерчивание ---
   clip-path, а не размер: при изменении размера штрихи сжимались бы вместе с
   линией и шаг пунктира плыл. clip-path просто открывает готовый луч. */

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

@keyframes node-in {
  from {
    opacity: 0;
    scale: 0.4;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}

/* RTL: clip-path и направление градиента — свойства физические, логического аналога
   нет. Для арабской версии горизонтальные лучи меняются местами.
   См. design-system.md, раздел 9. */
:global([dir='rtl']) .cross__ray--start {
  animation-name: ray-end;
}

:global([dir='rtl']) .cross__ray--end {
  animation-name: ray-start;
}
</style>
