<!--
  Блок [11] «Заявка и контакты» - подача «Анкета».
  Вариант Б, выбран Марком 06.08 из двух собранных вживую; вариант А
  «Карта записи» снят (история git, 2da5b87). Подблок «// Что будет
  дальше» снят по правке Марка 07.08.

  Сама форма с 07.08 живёт в общем компоненте BookingForm.vue - она же
  открывается попапом (BookingModal) со всех кнопок «Записаться» по сайту.
  Источник заявки этого блока - 'booking-section'.
-->
<script setup lang="ts">
const { m } = useLocale()
</script>

<template>
  <PageSection id="booking" :label="m.booking.label" tone="paper" cross-y="5.5rem">
    <SectionTitle :text="m.booking.title" />

    <p class="bkb__lead">{{ m.booking.lead }}</p>

    <div class="bkb__form">
      <BookingForm source="booking-section" />
    </div>
  </PageSection>
</template>

<style scoped>
.bkb__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(52ch, 100%);
}

.bkb__form {
  margin-block-start: var(--s-10);
}
</style>
