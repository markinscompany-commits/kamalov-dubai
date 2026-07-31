<!--
  Зерно поверх всей страницы.
  Именно оно делает пастельные цвета тёплыми, а не блёклыми.
  Не анимируем: живое «плёночное» зерно на медицинском сайте выглядит дёшево и мешает читать.
-->
<template>
  <div class="grain" aria-hidden="true" />
</template>

<style scoped>
.grain {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.07;
  /* overlay, а не multiply: на первом экране появилась чернильная половина, а multiply
     на тёмном фоне не даёт ничего — зерно бы там просто пропало */
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* На плотных экранах шум читается сильнее — ослабляем */
@media (max-width: 640px) {
  .grain {
    opacity: 0.03;
  }
}
</style>
