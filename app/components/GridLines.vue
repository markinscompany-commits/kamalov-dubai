<!--
  Разметка блока — пунктирные линии.

  Правило Марка: по каждому блоку проходят РОВНО ДВЕ линии — одна вертикальная и
  одна горизонтальная. Пересечение ставится в пустом месте, чтобы линии не шли
  поверх текста. Позиции задаёт сам блок, потому что «пустое место» у каждого своё.

  На пересечении стоит крестик-маркер — он и превращает пару линий в чертёж.
  Крестики заметно плотнее линий: тонкими они пропадали на фотографии.

  Цвет линий берётся из --rule снаружи, цвет крестика — из --rule-node:
  на чернильной половине они светлые, на бумаге тёмные.
-->
<script setup lang="ts">
interface Props {
  /** Позиции вертикалей: отступ от начала строки. Любые единицы CSS, в том числе var() */
  verticals?: string[]
  /** Позиции горизонталей: отступ от верха блока */
  horizontals?: string[]
  /** Сдвиг начала прочерчивания, мс */
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  verticals: () => [],
  horizontals: () => [],
  delay: 0,
})

/** Крестики на пересечениях. На самом краю блока крестик выглядит обрубком — пропускаем */
const nodes = computed(() =>
  props.verticals
    .filter((x) => x !== '0' && x !== '0%' && x !== '100%')
    .flatMap((x) =>
      props.horizontals
        .filter((y) => y !== '0' && y !== '0%' && y !== '100%')
        .map((y) => ({ x, y })),
    ),
)
</script>

<template>
  <div class="grid" aria-hidden="true">
    <DashedRule
      v-for="(pos, i) in verticals"
      :key="`v-${i}`"
      orientation="v"
      :pos="pos"
      :delay="delay + i * 90"
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

/* Крестик-маркер: две черты, сходящиеся в точке пересечения.
   Толщина 2 px против 1 px у линий — узел должен читаться как узел. */
.grid__node {
  position: absolute;
  inline-size: 15px;
  block-size: 15px;
  translate: -50% -50%;
  opacity: 0;
  animation: node-in var(--dur-base) var(--ease-out) calc(1500ms + 80ms * var(--i, 0)) forwards;
  background:
    linear-gradient(var(--rule-node), var(--rule-node)) center / 100% 2px no-repeat,
    linear-gradient(var(--rule-node), var(--rule-node)) center / 2px 100% no-repeat;
}

@keyframes node-in {
  to {
    opacity: 1;
  }
}
</style>
