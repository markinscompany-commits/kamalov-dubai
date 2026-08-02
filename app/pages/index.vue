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

    <!--
      ⚠️ БЛОКИ УСЛУГ ВРЕМЕННО СКРЫТЫ (решение Марка, 01.08).
      Разметка сохранена целиком: включить обратно - снять эту обёртку и вернуть
      в messages.ts два пункта меню (nav.links, помечены тем же комментарием).
      Ничего не переписано, блоки собраны и проверены.

    ·  Обе услуги собраны одним компонентом: структура у них общая, разный текст.
         Фон чередуется, чтобы блоки не слипались в одно полотно. 
    <ServiceSection
      id="rhinoplasty"
      tone="deep"
      :label="m.rhinoplasty.label"
      :title="m.rhinoplasty.title"
      :lead="m.rhinoplasty.lead"
      :facts="m.rhinoplasty.facts"
      :risks="m.rhinoplasty.risks"
      mark="dorsum"
      :mark-caption="m.rhinoplasty.markCaption"
    />
    <ServiceSection
      id="septoplasty"
      :label="m.septoplasty.label"
      :title="m.septoplasty.title"
      :lead="m.septoplasty.lead"
      :facts="m.septoplasty.facts"
      :risks="m.septoplasty.risks"
      mark="airway"
      :mark-caption="m.septoplasty.markCaption"
    />
    -->

    <!--
      ⚠️ БЛОКИ «КАК ПРОХОДИТ ЛЕЧЕНИЕ» И «ВОССТАНОВЛЕНИЕ» ВРЕМЕННО СКРЫТЫ
      (решение Марка, 02.08): дизайн не принят - «простые и сухие».

      Разметка, тексты и фотографии сохранены целиком, ничего не переписано.
      Структура блоков утверждена, вопрос только в подаче: в следующей сессии
      дизайн каждого блока сначала обсуждается, потом верстается.

      Включить обратно - снять эту обёртку.

    <TreatmentSection />
    <RecoverySection />
    -->
  </main>
</template>
