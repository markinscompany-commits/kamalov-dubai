<!--
  Сетка разметки — сквозная для всего сайта.

  Вертикали стоят на одних и тех же долях ширины экрана в каждом блоке, поэтому при
  прокрутке читаются как одна непрерывная сетка сверху донизу. Горизонтали задаются
  блоком отдельно: ими блок отбивается сверху и снизу, и в местах стыка сетка «садится»
  на границу.

  Цвет линий берётся из --rule снаружи: на чернильной половине он светлый, на бумаге тёмный.
-->
<script setup lang="ts">
interface Props {
  /** На сколько долей делим ширину. Линий рисуется на одну меньше. */
  columns?: number
  /** Позиции горизонтальных линий внутри блока */
  horizontals?: string[]
  /** Сдвиг начала прочерчивания, мс */
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  columns: 4,
  horizontals: () => [],
  delay: 0,
})

const verticals = computed(() =>
  Array.from({ length: Math.max(0, props.columns - 1) }, (_, i) => ({
    pos: `${(100 / props.columns) * (i + 1)}%`,
    delay: props.delay + i * 90,
  })),
)
</script>

<template>
  <div class="grid" aria-hidden="true">
    <DashedRule
      v-for="(v, i) in verticals"
      :key="`v-${i}`"
      orientation="v"
      :pos="v.pos"
      :delay="v.delay"
      faint
    />
    <DashedRule
      v-for="(pos, i) in horizontals"
      :key="`h-${i}`"
      orientation="h"
      :pos="pos"
      :delay="delay + 260 + i * 90"
    />
  </div>
</template>

<style scoped>
.grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
