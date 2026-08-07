<script setup lang="ts">
const { locale, restoreLocale } = useLocale()
const { restore: restoreConsent } = useCookieConsent()
const route = useRoute()

/*
 * Язык выставляется ПО МАРШРУТУ: `/` - АНГЛИЙСКИЙ, `/ru` - русский.
 * Английский основной (решение Марка 07.08): реклама идёт на разноязычную
 * аудиторию ОАЭ, и ссылка, которую открывает модерация Meta, должна быть
 * английской.
 * Работает и на сервере (каждая версия пререндерится своим языком),
 * и при переходах. Страницы вне языковых маршрутов (например /privacy)
 * язык не трогают - там он живёт состоянием.
 */
function localeFromPath(p: string): 'ru' | 'en' | null {
  if (p === '/ru' || p.startsWith('/ru/')) return 'ru'
  if (p === '/') return 'en'
  return null
}

const initial = localeFromPath(route.path)
if (initial) locale.value = initial

// Языковые версии главной - с учётом хвостового слэша (/ru и /ru/ - одна страница)
const isLanding = computed(() => {
  const p = route.path.replace(/\/+$/, '') || '/'
  return p === '/' || p === '/ru'
})

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
  // тихий увод на /ru, если человек в прошлый раз выбрал русский
  restoreLocale()
  // Прошлый ответ про статистику: «принял» - счётчик грузится, «отклонил» -
  // не грузится и баннер больше не спрашивает
  restoreConsent()
})

onBeforeUnmount(() => {
  clearTimeout(rotateTimer)
  window.removeEventListener('orientationchange', onRotate)
})
</script>

<template>
  <div class="app">
    <!-- Шапка - только на языковых версиях главной: её пункты - якоря
         разделов главной, на /privacy они вели бы в никуда.
         Сравниваем без хвостового слэша: хостинг отдаёт /ru как /ru/,
         и строгое равенство прятало бы шапку на второй языковой версии -->
    <SiteHeader v-if="isLanding" />
    <NuxtPage />
    <!-- Попап записи: открывается со всех кнопок «Записаться» с источником
         блока (правка Марка 07.08) -->
    <BookingModal />
    <!-- Согласие на статистику: появляется, только если счётчик настроен -->
    <CookieBanner />
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
