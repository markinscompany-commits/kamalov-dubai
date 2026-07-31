<script setup lang="ts">
const { restoreLocale } = useLocale()
const { boot } = usePreloader()

/**
 * Фиксируем реальную высоту окна в переменной --app-height.
 *
 * Зачем. На телефоне при прокрутке прячется адресная строка, окно становится выше,
 * и всё, что завязано на высоту экрана, пересчитывается прямо во время прокрутки —
 * первый экран дёргается и перекладывается на ходу. Марк это поймал на iPhone.
 *
 * Решение то же, что в Радде: замеряем высоту ОДИН раз при загрузке и больше не
 * трогаем при прокрутке — только при повороте экрана. Тогда высота первого экрана
 * постоянна, и «до прокрутки» и «после» выглядят одинаково.
 *
 * Повторный замер через 200 мс — iOS отдаёт финальный innerHeight только после
 * первого кадра.
 */
function updateAppHeight() {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
}

let rotateTimer: ReturnType<typeof setTimeout>

function onRotate() {
  clearTimeout(rotateTimer)
  setTimeout(updateAppHeight, 250)
}

onMounted(() => {
  updateAppHeight()
  setTimeout(updateAppHeight, 200)
  window.addEventListener('orientationchange', onRotate)
  // Язык вспоминаем ДО того, как уйдёт заставка: подмена текстов происходит за ней
  restoreLocale()
  boot()
})

onBeforeUnmount(() => {
  clearTimeout(rotateTimer)
  window.removeEventListener('orientationchange', onRotate)
})
</script>

<template>
  <div class="app">
    <SiteHeader />
    <NuxtPage />
    <GrainOverlay />
    <AppPreloader />
  </div>
</template>

<style>
/* Точка отсчёта для слоя зерна: на телефоне он перестаёт быть закреплённым и
   растягивается на всю высоту страницы. position: relative закреплённой шапке
   не мешает — её сбивает только transform */
.app {
  position: relative;
}
</style>
