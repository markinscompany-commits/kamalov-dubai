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
    <DoctorSection />

    <!-- Обе услуги собраны одним компонентом: структура у них общая, разный текст.
         Фон чередуется, чтобы блоки не слипались в одно полотно. -->
    <ServiceSection
      id="rhinoplasty"
      tone="deep"
      :label="m.rhinoplasty.label"
      :title="m.rhinoplasty.title"
      :lead="m.rhinoplasty.lead"
      :facts="m.rhinoplasty.facts"
      :risks="m.rhinoplasty.risks"
    />
    <ServiceSection
      id="septoplasty"
      :label="m.septoplasty.label"
      :title="m.septoplasty.title"
      :lead="m.septoplasty.lead"
      :facts="m.septoplasty.facts"
      :risks="m.septoplasty.risks"
    />
  </main>
</template>
