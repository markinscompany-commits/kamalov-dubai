<script setup lang="ts">
const { locale, restoreLocale } = useLocale()
const route = useRoute()

/*
 * Язык выставляется ПО МАРШРУТУ: `/` - русский, `/en` - английский.
 * Работает и на сервере (каждая версия пререндерится своим языком),
 * и при переходах. Страницы вне языковых маршрутов (например /privacy)
 * язык не трогают - там он живёт состоянием.
 */
function localeFromPath(p: string): 'ru' | 'en' | null {
  if (p === '/en' || p.startsWith('/en/')) return 'en'
  if (p === '/') return 'ru'
  return null
}

const initial = localeFromPath(route.path)
if (initial) locale.value = initial

watch(
  () => route.path,
  (p) => {
    const l = localeFromPath(p)
    if (l) {
      locale.value = l
      if (import.meta.client) document.documentElement.lang = l
    }
  },
)

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
  // Заставки при первой загрузке больше нет (решение Марка) - только
  // тихий увод на /en, если человек в прошлый раз выбрал английский
  restoreLocale()
})

onBeforeUnmount(() => {
  clearTimeout(rotateTimer)
  window.removeEventListener('orientationchange', onRotate)
})
</script>

<template>
  <div class="app">
    <!-- Шапка - только на языковых версиях главной: её пункты - якоря
         разделов главной, на /privacy они вели бы в никуда -->
    <SiteHeader v-if="$route.path === '/' || $route.path === '/en'" />
    <NuxtPage />
    <!-- Попап записи: открывается со всех кнопок «Записаться» с источником
         блока (правка Марка 07.08) -->
    <BookingModal />
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
