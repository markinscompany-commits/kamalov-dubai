<!--
  Пунктирная линия — базовый элемент концепции «Разметка».

  Почему не border: dashed — браузеры рисуют штриховую границу по-разному, длина штриха
  зависит от длины стороны, на углах получается мусор, шагом управлять нельзя.
  Поэтому линию рисуем повторяющимся градиентом, а появление — через clip-path,
  чтобы штрихи не сжимались при анимации.
-->
<script setup lang="ts">
interface Props {
  /** 'h' — горизонтальная, 'v' — вертикальная */
  orientation?: 'h' | 'v'
  /** Отступ от края в CSS-единицах: для 'h' — сверху, для 'v' — от начала строки */
  pos?: string
  /** Задержка появления, мс */
  delay?: number
  /** Приглушённая линия */
  faint?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'h',
  pos: '0',
  delay: 0,
  faint: false,
})

const style = computed(() => ({
  '--delay': `${props.delay}ms`,
  ...(props.orientation === 'h' ? { insetBlockStart: props.pos } : { insetInlineStart: props.pos }),
}))
</script>

<template>
  <span
    class="rule"
    :class="[`rule--${orientation}`, { 'rule--faint': faint }]"
    :style="style"
    aria-hidden="true"
  />
</template>

<style scoped>
.rule {
  position: absolute;
  display: block;
  pointer-events: none;
  --color: var(--rule);
}

.rule--faint {
  --color: var(--rule-faint);
}

.rule--h {
  inset-inline: 0;
  block-size: 1px;
  background-image: repeating-linear-gradient(
    to right,
    var(--color) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  animation: draw-h var(--dur-draw) var(--ease-draw) var(--delay) both;
}

.rule--v {
  inset-block: 0;
  inline-size: 1px;
  background-image: repeating-linear-gradient(
    to bottom,
    var(--color) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  animation: draw-v var(--dur-draw) var(--ease-draw) var(--delay) both;
}

@keyframes draw-h {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

@keyframes draw-v {
  from {
    clip-path: inset(0 0 100% 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

/* RTL: clip-path физический, поэтому направление прочерчивания разворачиваем вручную.
   Задел под арабскую версию — см. design-system.md, раздел 9. */
:global([dir='rtl']) .rule--h {
  animation-name: draw-h-rtl;
}

@keyframes draw-h-rtl {
  from {
    clip-path: inset(0 0 0 100%);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
</style>
