<!--
  Хронология: год - что произошло.

  Почему не обычный список: год даёт опору. Плоский перечень фактов глаз пропускает,
  а по годам читается путь - видно, что за чем шло.

  Лента собрана в языке сайта: вертикальная пунктирная линия того же шага, что вся
  разметка, и на каждом году - такой же крестик-узел, как на пересечении лучей.
  То есть хронология выглядит как продолжение чертежа, а не как отдельный виджет.

  Годы - антиквой, крупно. Это цифры, за которые цепляется взгляд.
-->
<script setup lang="ts">
interface Item {
  year: string
  text: string
}

interface Props {
  items: Item[]
}

defineProps<Props>()
</script>

<template>
  <ol class="tl">
    <li v-for="(item, i) in items" :key="i" class="tl__row">
      <span class="tl__year">{{ item.year }}</span>
      <span class="tl__node" aria-hidden="true" />
      <span class="tl__text">{{ item.text }}</span>
    </li>
  </ol>
</template>

<style scoped>
.tl {
  --tl-line: 7.5rem; /* где идёт вертикаль: сразу за колонкой годов */
  --tl-node: 11px;

  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
}

/* Вертикальная пунктирная лента через всю хронологию */
.tl::before {
  content: '';
  position: absolute;
  inset-block: 0.9rem;
  inset-inline-start: calc(var(--tl-line) - var(--rule-w) / 2);
  inline-size: var(--rule-w);
  background-image: repeating-linear-gradient(
    to bottom,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

.tl__row {
  position: relative;
  min-inline-size: 0;
  display: grid;
  grid-template-columns: var(--tl-line) minmax(0, 1fr);
  column-gap: var(--s-6);
  align-items: baseline;
  padding-block: var(--s-4);
}

.tl__year {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(1.375rem, 2vw, 1.75rem);
  line-height: 1;
  letter-spacing: -0.01em;
  color: var(--ink);
}

/* Узел на ленте - тот же крестик, что на пересечении лучей разметки:
   две сплошные линии по центру коробки, толщина как у всей разметки */
.tl__node {
  position: absolute;
  inset-inline-start: calc(var(--tl-line) - var(--tl-node) / 2);
  inset-block-start: calc(var(--s-4) + 0.25rem);
  inline-size: var(--tl-node);
  block-size: var(--tl-node);
  background:
    linear-gradient(var(--rule), var(--rule)) center / var(--rule-w) 100% no-repeat,
    linear-gradient(var(--rule), var(--rule)) center / 100% var(--rule-w) no-repeat;
}

.tl__text {
  font-size: var(--fs-body);
  line-height: 1.6;
  max-inline-size: min(52ch, 100%);
}

@media (max-width: 700px) {
  .tl {
    --tl-line: 4.25rem;
  }

  .tl__row {
    column-gap: var(--s-5);
    padding-block: var(--s-3);
  }

  .tl__year {
    font-size: 1.25rem;
  }
}
</style>
