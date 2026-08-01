<!--
  Обёртка блока страницы. Появилась, когда одна и та же конструкция понадобилась
  второй раз (правило дизайн-системы: повторился - стал компонентом).

  Что берёт на себя:
  · подпись на полях «[03] Ринопластика» в узкой колонке слева;
  · разметку CrossRules с точкой, заданной снаружи;
  · сетку «узкая колонка + содержимое» и её схлопывание на телефоне;
  · чередование фона: бумага / бумага потемнее.

  Разметка лежит СЛОЕМ НИЖЕ содержимого: линии проходят под текстом и под
  фотографиями, а не поверх. Точка при этом всё равно ставится в пустое место -
  см. design-system.md, раздел 4.
-->
<script setup lang="ts">
interface Props {
  /** Якорь для меню */
  id?: string
  /** Подпись на полях: «[03] Ринопластика» */
  label: string
  /** Фон: обычная бумага или потемнее (для чередования блоков) */
  tone?: 'paper' | 'deep'
  /**
   * Где стоит вертикаль разметки — доля ширины КОЛОНКИ (не экрана).
   * 0.161 — промежуток сразу за короткой подписью раздела,
   * 0.207 — коридор между боковой колонкой и текстом (нужен, когда сбоку лежит
   * что-то шире подписи: фотография, длинная пометка).
   * Почему доля колонки, а не экрана — design-system.md, раздел 4.
   */
  crossFraction?: number
  /** Точка пересечения разметки на десктопе и на телефоне */
  crossX?: string
  crossY?: string
  crossXMobile?: string
  crossYMobile?: string
  /** Задержка прочерчивания, мс */
  crossDelay?: number
  /** Убрать разметку совсем */
  noRules?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  tone: 'paper',
  crossFraction: 0.161,
  crossX: undefined,
  crossY: '4.5rem',
  // На телефоне колонок нет, текст идёт во всю ширину - вертикаль уводим в поле страницы
  crossXMobile: 'max(0.8rem, calc(var(--page-pad) - 0.75rem))',
  crossYMobile: '3rem',
  crossDelay: 120,
  noRules: false,
})

/*
  Вертикаль считается от КОЛОНКИ, а не от ширины экрана: колонка стоит по центру и
  упирается в --page-max, поэтому «доля экрана» попадает в пустоту только при одном
  размере окна, а на других уползает на текст. Разобрано в design-system.md, раздел 4.
*/
const crossXValue = computed(
  () =>
    props.crossX ??
    `calc((100% - min(100%, var(--page-max))) / 2 + var(--page-pad) + (min(100%, var(--page-max)) - 2 * var(--page-pad)) * ${props.crossFraction})`,
)

const style = computed(() => ({
  '--section-cross-x': crossXValue.value,
  '--section-cross-y': props.crossY,
  '--section-cross-x-m': props.crossXMobile,
  '--section-cross-y-m': props.crossYMobile,
}))
</script>

<template>
  <section :id="id" class="sec" :class="[`sec--${tone}`]" :style="style">
    <CrossRules v-if="!noRules" class="sec__rules" :delay="crossDelay" />

    <div class="page sec__inner">
      <div class="sec__side">
        <p class="mono sec__label">{{ label }}</p>
        <!-- Место под дополнение сбоку: год, короткая пометка -->
        <slot name="side" />
      </div>

      <div class="sec__body">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.sec {
  position: relative;
  padding-block: clamp(6rem, 12vh, 12rem);

  --cross-x: var(--section-cross-x);
  --cross-y: var(--section-cross-y);
}

.sec--paper {
  background: var(--paper);
}

.sec--deep {
  background: var(--paper-deep);
}

/* Разметка ниже содержимого: линии проходят под текстом и фотографиями */
.sec__rules {
  z-index: 0;
}

.sec__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 0.25fr) minmax(0, 1fr);
  gap: var(--s-8);
  align-items: start;
}

.sec__side {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
}

.sec__label {
  margin: 0;
}

.sec__body {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
}

@media (max-width: 900px) {
  .sec {
    --cross-x: var(--section-cross-x-m);
    --cross-y: var(--section-cross-y-m);
  }

  .sec__inner {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-6);
  }

  /*
    На телефоне колонок нет, и всё, что лежало сбоку (например, архивный снимок),
    должно уехать ПОД содержимое: иначе картинка встаёт раньше заголовка раздела.

    display: contents растворяет боковую колонку, её дети становятся ячейками той же
    сетки - и только тогда их можно переставить через order. Подпись остаётся сверху,
    остальное уходит вниз.
  */
  .sec__side {
    display: contents;
  }

  .sec__label {
    order: 1;
  }

  .sec__body {
    order: 2;
  }

  /*
    Содержимое бокового слота приходит из другого компонента, поэтому обращаться
    к нему нужно через ::v-slotted - обычный селектор до чужой разметки не достаёт.
  */
  .sec__side > ::v-slotted(*) {
    order: 3;
  }

  /*
    Исключение: элемент с data-mobile-first встаёт СРАЗУ под подписью, перед текстом.
    Нужно для портрета врача - читать про него, не видя лица, странно, а в конец
    блока портрет уезжать не должен.
  */
  .sec__side > ::v-slotted([data-mobile-first]) {
    order: 1;
  }
}
</style>
