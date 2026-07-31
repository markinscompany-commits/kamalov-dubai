<script setup lang="ts">
const { swapping, restoreLocale } = useLocale()

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
  restoreLocale()
})

onBeforeUnmount(() => {
  clearTimeout(rotateTimer)
  window.removeEventListener('orientationchange', onRotate)
})
</script>

<template>
  <!--
    Обёртка гасит страницу на время смены языка. Меняем только прозрачность:
    transform и filter на родителе сделали бы его точкой отсчёта для закреплённой
    шапки, и она поехала бы вместе со страницей.
  -->
  <div class="app locale-swap" :class="{ 'locale-swap--out': swapping }">
    <SiteHeader />
    <NuxtPage />
    <GrainOverlay />
  </div>
</template>

<style>
.locale-swap {
  transition: opacity 200ms var(--ease-out);
}

.locale-swap--out {
  opacity: 0.14;
}

@media (prefers-reduced-motion: reduce) {
  .locale-swap--out {
    opacity: 1;
  }
}
</style>
