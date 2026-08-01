<!--
  Заголовок раздела.

  Обычный h2 антиквой, без заливки по прокрутке: правка Марка (01.08) -
  эффект караоке остаётся только в блоке «Подход». Там он один на странице
  и работает как приём; на каждом заголовке подряд он превращается в тик.

  Компонент нужен, чтобы кегль и ширина заголовка были одинаковыми во всех
  блоках: раньше это давал KaraokeText, теперь давать нечему.
-->
<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <h2 class="sec-title">{{ text }}</h2>
</template>

<style scoped>
.sec-title {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: var(--fs-h1);
  line-height: 1.18;
  letter-spacing: -0.01em;
  color: var(--ink);
  max-inline-size: min(22ch, 100%);
}
</style>
