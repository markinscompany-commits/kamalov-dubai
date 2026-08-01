<!--
  Хронология: год - что произошло.

  Почему не обычный список: год даёт опору. Плоский перечень фактов глаз пропускает,
  а по годам читается путь - видно, что за чем шло.

  Лента собрана в языке сайта: вертикальная пунктирная линия того же шага, что вся
  разметка, и на каждом году - такой же крестик-узел, как на пересечении лучей.
  То есть хронология выглядит как продолжение чертежа, а не отдельный виджет.

  СВОРАЧИВАНИЕ (правка Марка, 01.08). Сразу видны первые записи, остальные
  раскрываются по кнопке. На кнопке стоит число - человек видит, сколько ещё
  спрятано, и решает сам.

  Скрытые записи не лежат в разметке спрятанными, а появляются при раскрытии и
  выезжают по очереди сверху вниз. Так не нужно подгонять высоту числом (max-height
  всегда врёт на длинном тексте), и в готовом HTML нет текста, которого человек
  не видит - лишний повод для вопросов у модерации.
-->
<script setup lang="ts">
interface Item {
  year: string
  text: string
}

interface Props {
  items: Item[]
  /** Сколько записей видно до раскрытия. 0 - показывать все */
  visible?: number
  /** Подписи кнопки: {n} заменяется на число спрятанных записей */
  moreLabel?: string
  lessLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: 0,
  moreLabel: 'Раскрыть - ещё {n}',
  lessLabel: 'Свернуть',
})

const open = ref(false)

const head = computed(() =>
  props.visible > 0 && !open.value ? props.items.slice(0, props.visible) : props.items,
)
const hiddenCount = computed(() => Math.max(0, props.items.length - props.visible))
const buttonLabel = computed(() =>
  open.value ? props.lessLabel : props.moreLabel.replace('{n}', String(hiddenCount.value)),
)
</script>

<template>
  <div class="tl" :class="{ 'tl--folded': visible > 0 && !open }">
    <ol class="tl__list">
      <li v-for="(item, i) in head" :key="item.year + i" class="tl__row" :style="{ '--i': i }">
        <span class="tl__year">{{ item.year }}</span>
        <span class="tl__node" aria-hidden="true" />
        <span class="tl__text">{{ item.text }}</span>
      </li>
    </ol>

    <button
      v-if="hiddenCount > 0 && visible > 0"
      type="button"
      class="tl__toggle"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="tl__toggle-node" aria-hidden="true">
        <span class="tl__toggle-bar" />
        <span class="tl__toggle-bar tl__toggle-bar--v" />
      </span>
      <span class="mono tl__toggle-label">{{ buttonLabel }}</span>
    </button>
  </div>
</template>

<style scoped>
.tl {
  --tl-line: 7.5rem; /* где идёт вертикаль: сразу за колонкой годов */
  --tl-node: 11px;

  display: flex;
  flex-direction: column;
  align-items: start;
}

.tl__list {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  inline-size: 100%;
}

/* Вертикальная пунктирная лента через всю хронологию */
.tl__list::before {
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

/* Когда часть записей спрятана, лента уходит вниз к кнопке и не обрывается */
.tl--folded .tl__list::before {
  inset-block-end: -1.5rem;
}

.tl__row {
  position: relative;
  min-inline-size: 0;
  display: grid;
  grid-template-columns: var(--tl-line) minmax(0, 1fr);
  column-gap: var(--s-6);
  align-items: baseline;
  padding-block: var(--s-4);
  /* Появление раскрытых записей по очереди сверху вниз */
  animation: tl-in var(--dur-base) var(--ease-out) calc(var(--i, 0) * 45ms) both;
}

@keyframes tl-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.tl__year {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(1.375rem, 2vw, 1.75rem);
  line-height: 1;
  letter-spacing: -0.01em;
  color: var(--ink);
}

/* Узел на ленте - тот же крестик, что на пересечении лучей разметки */
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

/* --- Кнопка --- */

.tl__toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--s-4);
  padding: 0;
  margin-block-start: var(--s-4);
  /* Кнопка стоит ровно на ленте: её узел продолжает вертикаль */
  padding-inline-start: calc(var(--tl-line) - var(--tl-node) / 2);
  color: var(--ink-soft);
  transition: color var(--dur-fast) var(--ease-out);
}

.tl__toggle:hover,
.tl__toggle:focus-visible {
  color: var(--blue);
}

/* Узел кнопки - плюс, который при раскрытии превращается в минус */
.tl__toggle-node {
  position: relative;
  flex: none;
  inline-size: var(--tl-node);
  block-size: var(--tl-node);
}

.tl__toggle-bar {
  position: absolute;
  inset-block-start: 50%;
  inset-inline: 0;
  block-size: var(--rule-w);
  background: currentColor;
}

.tl__toggle-bar--v {
  inset-block: 0;
  inset-inline-start: 50%;
  inline-size: var(--rule-w);
  block-size: auto;
  transform-origin: center;
  transition: transform var(--dur-base) var(--ease-out);
}

/* Раскрыто - вертикальная палочка поворачивается и плюс становится минусом */
.tl:not(.tl--folded) .tl__toggle-bar--v {
  transform: rotate(90deg) scaleX(0.001);
}

.tl__toggle-label {
  white-space: nowrap;
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
