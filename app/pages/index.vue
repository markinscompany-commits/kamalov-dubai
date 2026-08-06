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

    <!-- [04] Операции: ринопластика и септопластика одним блоком. Подача
         «хирург дорисовывает разметку» выбрана Марком 04.08 из двух собранных
         вариантов; второй (разворот) снят, он в истории git -->
    <SurgerySection />

    <!-- [05] Результаты: галерея «до/после», подача «Журнал случаев» (вариант А,
         выбор Марка 05.08). ⚠️ Кадры - заглушка с dr-kamalov.com до материалов
         клиники с согласиями пациентов. Снимается одним движением - убрать строку -->
    <GallerySection />

    <!-- [06] Где принимает: Dubai London Hospital. Подача «Координата» принята
         Марком 03.08 - карта Джумейры, нарисованная разметкой сайта -->
    <ClinicSection />

    <!-- [07] Как проходит лечение: подача «Маршрут» (вариант А, выбор Марка
         06.08 из двух собранных вживую; вариант Б снят, он в истории git) -->
    <TreatmentPathSection />

    <!-- [08] Восстановление: НА ВЫБОРЕ МАРКА, оба варианта подачи на странице
         сразу (порядок работы 06.08). Непринятый вариант снимается вместе со
         своей пометкой; старый RecoverySection.vue («простой и сухой»,
         отклонён 02.08) остаётся в репо до выбора, в страницу не подключён.
         Пометки .variant-tag - временные, к сдаче их не останется -->
    <div class="variant-tag" aria-hidden="true">
      <p class="mono">// ВАРИАНТ А - «ШКАЛА»: линейка времени, уровень поднимается по мере прокрутки</p>
    </div>
    <RecoveryScaleSection />

    <div class="variant-tag" aria-hidden="true">
      <p class="mono">// ВАРИАНТ Б - «ГОРИЗОНТ»: ось времени через страницу, на телефоне - лента</p>
    </div>
    <RecoveryHorizonSection />
  </main>
</template>

<style scoped>
/* Временная пометка варианта для сравнения - к сдаче снимается вместе
   с непринятым вариантом. Золотая полоса, чтобы не спутать с контентом */
.variant-tag {
  border-block-start: 2px solid var(--gold);
  background: var(--paper-raised);
  padding: var(--s-3) var(--page-pad);
}

.variant-tag .mono {
  margin: 0;
  color: var(--gold-deep);
}
</style>
