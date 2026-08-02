<!--
  Блок «Восстановление» — сколько времени займёт возвращение к обычной жизни.

  Зачем он есть: это вопрос номер один у любого, кто думает про операцию на носу,
  и его на странице не было. Плюс он закрывает требование ST-21 п. 7.1.3 — материал
  обязан показывать не только выгоды услуги, но и её недостатки и неудобства.

  ПОДАЧА. Лента «когда → что происходит», а не таблица с рамками: рамки в этой нише
  читаются как прайс-лист. Строки разделены пунктиром того же шага, что вся разметка.
  Слева срок антиквой — он здесь главное, за ним человек и пришёл.

  ⚠️ ДВА ТРЕБОВАНИЯ РЕГУЛЯТОРА, КОТОРЫЕ НЕЛЬЗЯ НАРУШИТЬ ПРИ ПРАВКАХ:
  1. Оговорка об индивидуальности результата набирается ТЕМ ЖЕ КЕГЛЕМ, что основной
     текст (ST-21 п. 9.6 и 7.1.5). Увести её в мелкий серый нельзя.
  2. Сроки подаются как ориентир, а не как обещание. Формулировки проверены:
     ни «вы вернётесь через», ни «уже через две недели» — только «обычно», «зависит».

  🔴 САМИ ЦИФРЫ — ЗАГЛУШКА до подтверждения доктором, см. комментарий в messages.ts.
-->
<script setup lang="ts">
const { m } = useLocale()
</script>

<template>
  <PageSection
    id="recovery"
    :label="m.recovery.label"
    cross-y="5rem"
    :cross-fraction="0.161"
  >
    <SectionTitle :text="m.recovery.title" />

    <p class="rec__lead">{{ m.recovery.lead }}</p>

    <!--
      Заголовков колонок нет намеренно: «Когда / Что происходит» ничего не добавляют -
      срок и так стоит первым и набран крупной антиквой, а вводный абзац объясняет
      остальное. Правило из design-brief п. 4: мало элементов на экран.
    -->
    <div class="rec__table">
      <div v-for="(row, i) in m.recovery.rows" :key="i" class="rec__row">
        <DashedRule class="rec__rule" :delay="i * 90" />
        <p class="rec__when">{{ row.when }}</p>
        <p class="rec__what">{{ row.what }}</p>
      </div>
    </div>

    <!-- Оговорка об индивидуальности. Кегль основного текста — требование DHA -->
    <div class="rec__note">
      <p class="mono rec__note-label">{{ m.recovery.noteLabel }}</p>
      <p class="rec__note-text">{{ m.recovery.note }}</p>
    </div>

    <div class="rec__sun">
      <p class="mono rec__sun-label">{{ m.recovery.sunLabel }}</p>
      <p class="rec__sun-text">{{ m.recovery.sun }}</p>
    </div>
  </PageSection>
</template>

<style scoped>
.rec__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(52ch, 100%);
}

.rec__table {
  display: grid;
  grid-template-columns: 12rem minmax(0, 1fr);
  column-gap: var(--s-6);
  max-inline-size: min(60ch, 100%);
}

/*
  Строка — своя сетка на всю ширину родительской: подсетка нужна, чтобы пунктир
  тянулся через обе колонки одной линией, а не двумя кусками с разрывом в gap.
*/
.rec__row {
  position: relative;
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
  padding-block: var(--s-4);
}

.rec__rule {
  inset-block-start: 0;
}

/*
  Кегль СВОЙ, меньше --fs-h2. Причина не вкусовая: на общем размере «6-12 месяцев»
  не влезало в колонку и ломалось на «6-» и «12 месяцев» — диапазон разрывался
  пополам и переставал читаться как срок.
*/
.rec__when {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.2vw, 2rem);
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin: 0;
  color: var(--ink);
}

.rec__what {
  font-size: var(--fs-body);
  line-height: 1.6;
  margin: 0;
  color: var(--ink-soft);
  padding-block-start: 0.3rem;
}

/* ⚠️ Кегль основного текста, а не мелкий: ST-21 п. 9.6 и 7.1.5 */
.rec__note {
  display: grid;
  grid-template-columns: 11rem minmax(0, 1fr);
  gap: var(--s-6);
  align-items: start;
  margin-block-start: var(--s-4);
}

.rec__note-label,
.rec__sun-label {
  margin: 0;
  padding-block-start: 0.2rem;
}

.rec__note-text {
  font-size: var(--fs-body);
  line-height: 1.65;
  margin: 0;
  color: var(--ink-soft);
  max-inline-size: min(58ch, 100%);
}

/* Отдельная пометка про солнце: для аудитории в ОАЭ это не мелочь, поэтому
   вынесена из общего списка и отбита воздухом */
.rec__sun {
  display: grid;
  grid-template-columns: 11rem minmax(0, 1fr);
  gap: var(--s-6);
  align-items: start;
}

.rec__sun-text {
  font-size: var(--fs-body);
  line-height: 1.65;
  margin: 0;
  max-inline-size: min(58ch, 100%);
}

@media (max-width: 700px) {
  .rec__table {
    grid-template-columns: minmax(0, 1fr);
  }

  .rec__row {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-1);
    padding-block: var(--s-5);
  }

  .rec__when {
    font-size: 1.5rem;
  }

  .rec__what {
    padding-block-start: 0;
  }

  .rec__note,
  .rec__sun {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-2);
  }

  .rec__note-label,
  .rec__sun-label {
    padding-block-start: 0;
  }
}
</style>
