<!--
  Хронология: год - что произошло.

  Почему не обычный список: год даёт опору. Плоский перечень фактов глаз пропускает,
  а по годам читается путь - видно, что за чем шло.

  Лента собрана в языке сайта: вертикальная пунктирная линия того же шага, что вся
  разметка, и на каждом году - такой же крестик-узел, как на пересечении лучей.

  СВОРАЧИВАНИЕ (правки Марка). Свёрнутая хронология обрезана НЕ по последней
  видимой записи, а посередине следующей: край уходит в затухание, и следующий год
  виден наполовину. Это честная подсказка «здесь есть продолжение» - работает
  лучше, чем число на кнопке.

  Как устроено раскрытие:
  · высота хвоста анимируется через grid-template-rows 0fr → 1fr. Настоящую высоту
    знать не нужно, поэтому ничего не приходится подгонять числом, а на длинном
    тексте ничего не обрезается (max-height так не умеет);
  · пунктирная лента растёт вместе с высотой, а не появляется целиком: она живёт
    внутри того же контейнера и открывается вместе с ним;
  · записи проявляются по очереди сверху вниз.
  Свёртывание идёт тем же движением в обратную сторону.
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
  moreLabel?: string
  lessLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: 0,
  moreLabel: 'Раскрыть',
  lessLabel: 'Свернуть',
})

const open = ref(false)

/** Всегда видимая часть. Последняя её запись наполовину уходит в затухание */
const head = computed(() =>
  props.visible > 0 ? props.items.slice(0, props.visible + 1) : props.items,
)
/** Часть, которая открывается кнопкой */
const rest = computed(() => (props.visible > 0 ? props.items.slice(props.visible + 1) : []))

const folded = computed(() => props.visible > 0 && !open.value)
const buttonLabel = computed(() => (open.value ? props.lessLabel : props.moreLabel))
</script>

<template>
  <div class="tl" :class="{ 'tl--folded': folded }">
    <div class="tl__head">
      <ol class="tl__list">
        <li v-for="(item, i) in head" :key="item.year + i" class="tl__row">
          <span class="tl__year">{{ item.year }}</span>
          <span class="tl__node" aria-hidden="true" />
          <span class="tl__text">{{ item.text }}</span>
        </li>
      </ol>

      <!-- Затухание нижнего края: гаснет при раскрытии, поэтому переход мягкий -->
      <span class="tl__fade" aria-hidden="true" />
    </div>

    <!--
      ⚠️ Свёрнутые записи НЕ лежат в готовом HTML: текст, невидимый человеку, но
      присутствующий в разметке, модерация видит и читает как скрытый контент.
      Поэтому хвост рендерится по v-if, а движение раскрытия сохранено переходом:
      контейнер остаётся на месте и анимирует высоту, содержимое приходит и уходит
      вместе с ним. Тот же приём, что в FaqFoldSection.
    -->
    <div class="tl__rest">
      <div class="tl__rest-inner">
        <Transition name="tl-rest" :duration="{ enter: 0, leave: 700 }">
          <ol v-if="open" class="tl__list tl__list--rest">
            <li v-for="(item, i) in rest" :key="item.year + i" class="tl__row" :style="{ '--i': i }">
              <span class="tl__year">{{ item.year }}</span>
              <span class="tl__node" aria-hidden="true" />
              <span class="tl__text">{{ item.text }}</span>
            </li>
          </ol>
        </Transition>
      </div>
    </div>

    <button
      v-if="rest.length"
      type="button"
      class="tl__toggle"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="mono tl__toggle-label">{{ buttonLabel }}</span>
      <svg class="tl__chevron" viewBox="0 0 24 14" aria-hidden="true" focusable="false">
        <path d="M2 2 L12 12 L22 2" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.tl {
  --tl-line: 7.5rem; /* где идёт вертикаль: сразу за колонкой годов */
  --tl-node: 11px;
  /* Насколько видна следующая запись в свёрнутом виде */
  --tl-peek: 3.5rem;

  display: flex;
  flex-direction: column;
  align-items: start;
  inline-size: 100%;
}

.tl__head {
  position: relative;
  inline-size: 100%;
}

/*
  В свёрнутом виде голова обрезана посередине следующей записи. Обрезаем контейнер,
  а не считаем записи: тогда «половина» остаётся половиной при любой длине текста.
*/
.tl--folded .tl__head {
  max-block-size: calc(100% - var(--tl-peek));
  overflow: hidden;
}

.tl__list {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  inline-size: 100%;
}

/* Вертикальная пунктирная лента */
.tl__list::before {
  content: '';
  position: absolute;
  inset-block: 0.9rem -0.4rem;
  inset-inline-start: calc(var(--tl-line) - var(--rule-w) / 2);
  inline-size: var(--rule-w);
  background-image: repeating-linear-gradient(
    to bottom,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

/* У хвоста лента начинается выше первой записи - стыка с головной не видно */
.tl__list--rest::before {
  inset-block-start: -0.4rem;
}

/* --- Хвост, который раскрывается --- */

.tl__rest {
  inline-size: 100%;
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows var(--dur-slow) var(--ease-out);
}

.tl--folded .tl__rest {
  grid-template-rows: 0fr;
}

.tl__rest-inner {
  overflow: hidden;
  min-block-size: 0;
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

/* Записи хвоста проявляются по очереди, когда лента уже поехала вниз */
.tl__list--rest .tl__row {
  opacity: 1;
  transition:
    opacity var(--dur-base) var(--ease-out) calc(140ms + var(--i, 0) * 60ms),
    transform var(--dur-base) var(--ease-out) calc(140ms + var(--i, 0) * 60ms);
}

/* Состояние «до появления»: записи приходят снизу по очереди, как раньше давал
   класс .tl--folded. Теперь их в этот момент просто нет в разметке */
.tl-rest-enter-from .tl__row {
  opacity: 0;
  transform: translateY(8px);
}

/* При сворачивании гаснут сразу, чтобы не мелькать в схлопывающейся ленте */
.tl-rest-leave-to .tl__row {
  opacity: 0;
  transition-delay: 0ms;
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

/* --- Затухание нижнего края --- */

.tl__fade {
  position: absolute;
  inset-inline: 0;
  inset-block-end: 0;
  block-size: var(--tl-peek);
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-out);
  /* Цвет фона секции задаётся снаружи через --fade-to: блоки чередуются */
  background: linear-gradient(to bottom, transparent, var(--fade-to, var(--paper)) 92%);
}

.tl--folded .tl__fade {
  opacity: 1;
}

/* --- Кнопка --- */

.tl__toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--s-3);
  padding: 0;
  margin-block-start: var(--s-4);
  padding-inline-start: calc(var(--tl-line) - var(--tl-node) / 2);
  color: var(--ink-soft);
  transition: color var(--dur-fast) var(--ease-out);
}

.tl__toggle:hover,
.tl__toggle:focus-visible {
  color: var(--blue);
}

.tl__chevron {
  inline-size: 0.85rem;
  block-size: auto;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform var(--dur-base) var(--ease-out);
}

/* Раскрыто - шеврон смотрит вверх */
.tl:not(.tl--folded) .tl__chevron {
  transform: rotate(180deg);
}

@media (max-width: 700px) {
  .tl {
    --tl-line: 4.25rem;
    --tl-peek: 2.75rem;
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
