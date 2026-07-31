<script setup lang="ts">
const { m, locale } = useLocale()

// Заголовок вкладки, описание для поисковиков и язык страницы меняются вместе
// с языком сайта. Функция, а не объект: иначе значения замрут на первом языке.
useHead(() => ({
  htmlAttrs: { lang: locale.value },
  title: m.value.meta.title,
  meta: [{ name: 'description', content: m.value.meta.description }],
}))
</script>

<template>
  <main>
    <HeroSection />
    <ManifestSection />
  </main>
</template>
