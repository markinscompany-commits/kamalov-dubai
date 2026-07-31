<!--
  Сетка разметки — сквозная для всего сайта.

  Вертикали стоят на одних и тех же долях ширины экрана в каждом блоке, поэтому при
  прокрутке читаются как одна непрерывная сетка сверху донизу. Горизонтали задаются
  блоком отдельно: ими блок отбивается сверху и снизу.

  На пересечениях ставятся крестики-маркеры — они и превращают набор линий в чертёж.

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
    // Средняя вертикаль: на телефоне её убираем, там линий и так много
    mid: (i + 1) * 2 === props.columns,
  })),
)

/** Крестики на пересечениях вертикалей и горизонталей */
const nodes = computed(() =>
  verticals.value.flatMap((v) =>
    props.horizontals
      // Крестик на самом краю блока смотрится обрубком — такие пропускаем
      .filter((h) => h !== '0%' && h !== '100%')
      .map((h) => ({ x: v.pos, y: h, mid: v.mid })),
  ),
)
</script>

<template>
  <div class="grid" aria-hidden="true">
    <DashedRule
      v-for="(v, i) in verticals"
      :key="`v-${i}`"
      class="grid__v"
      :class="{ 'grid__v--mid': v.mid }"
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

    <span
      v-for="(n, i) in nodes"
      :key="`n-${i}`"
      class="grid__node"
      :class="{ 'grid__node--mid': n.mid }"
      :style="{ insetInlineStart: n.x, insetBlockStart: n.y, '--i': i }"
    />
  </div>
</template>

<style scoped>
.grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Крестик-маркер: две черты, сходящиеся в точке пересечения */
.grid__node {
  position: absolute;
  inline-size: 11px;
  block-size: 11px;
  translate: -50% -50%;
  opacity: 0;
  animation: node-in var(--dur-base) var(--ease-out) calc(1500ms + 80ms * var(--i, 0)) forwards;
  background:
    linear-gradient(var(--rule), var(--rule)) center / 100% 1px no-repeat,
    linear-gradient(var(--rule), var(--rule)) center / 1px 100% no-repeat;
}

@keyframes node-in {
  to {
    opacity: 1;
  }
}

/* На телефоне середина убирается: там сетка иначе превращается в шум */
@media (max-width: 900px) {
  .grid__v--mid,
  .grid__node--mid {
    display: none;
  }
}
</style>
