<!--
  Блок операции. Один компонент на обе услуги - ринопластику и септопластику:
  структура у них одинаковая, разный только текст.

  Порядок внутри блока продуманный, а не произвольный:
  заголовок → что это → какие задачи решает → РИСКИ.

  Блок про риски обязателен: ST-21 п. 7.1.3 требует, чтобы материал содержал и
  выгоды, и риски услуги. Он набирается тем же кеглем, что основной текст
  (п. 7.1.5 и 9.6) - увести его в мелкий серый нельзя, это требование регулятора.

  Кнопка записи стоит в конце каждой услуги: человек, дочитавший до рисков,
  уже принимает решение, и отправлять его искать кнопку наверх незачем.
-->
<script setup lang="ts">
interface Fact {
  mark?: string
  text: string
}

interface Props {
  id: string
  label: string
  /** Какая разметка на профиле: форма (ринопластика) или дыхание (септопластика) */
  mark?: 'dorsum' | 'airway'
  /** Подпись под рисунком */
  markCaption?: string
  title: string
  lead: string
  facts: Fact[]
  risks: string
  tone?: 'paper' | 'deep'
}

withDefaults(defineProps<Props>(), { tone: 'paper', mark: 'dorsum', markCaption: undefined })

const { m } = useLocale()
</script>

<template>
  <PageSection :id="id" :label="label" :tone="tone" cross-y="5.5rem" :cross-fraction="0.207">
    <template #side>
      <ProfileMark class="service__mark" :variant="mark" :caption="markCaption" />
    </template>

    <SectionTitle :text="title" />

    <p class="service__lead">{{ lead }}</p>

    <FactList :items="facts" />

    <div class="service__risks">
      <p class="mono service__risks-label">{{ m.service.risksLabel }}</p>
      <p class="service__risks-text">{{ risks }}</p>
    </div>

    <div class="service__action">
      <MarkAction href="#booking">{{ m.action.bookLong }}</MarkAction>
    </div>
  </PageSection>
</template>

<style scoped>
/* Рисунок стоит в боковой колонке, под подписью раздела */
.service__mark {
  margin-block-start: var(--s-2);
}

.service__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(52ch, 100%);
}

.service__risks {
  display: grid;
  grid-template-columns: 5.5rem minmax(0, 1fr);
  gap: var(--s-6);
  align-items: start;
}

.service__risks-label {
  margin: 0;
  padding-block-start: 0.2rem;
}

/* Тот же кегль, что основной текст - требование DHA, а не вопрос вкуса */
.service__risks-text {
  font-size: var(--fs-body);
  color: var(--ink-soft);
  max-inline-size: min(58ch, 100%);
}

.service__action {
  margin-block-start: var(--s-2);
}

@media (max-width: 900px) {
  /* На телефоне рисунок уезжает под текст и занимает не всю ширину */
  .service__mark {
    max-inline-size: 11rem;
  }
}

@media (max-width: 700px) {
  .service__risks {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-2);
  }

  .service__risks-label {
    padding-block-start: 0;
  }

  /* Кнопка во всю ширину: на телефоне она главное действие экрана */
  .service__action :deep(.action) {
    inline-size: 100%;
  }
}
</style>
