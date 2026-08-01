<!--
  Блок «О докторе».

  Обязателен по договору и по стандарту: образование, стаж, членства, лицензия DHA.
  ⚠️ ST-21 п. 8.1.3 - титул и специализация пишутся слово в слово как в лицензии.
  Пока лицензия не передана, стоит формулировка с сайта врача (см. messages.ts).

  Композиция намеренно асимметричная: заголовок и абзац в широкой колонке, архивный
  снимок отца - в узкой, рядом с подписью раздела. Снимок здесь не украшение: блок
  держится на том, что специальность в семье вторая, и фотография это доказывает
  быстрее любого текста.

  Снимок проходит по правилам: врач, а не пациент; никаких инструментов в работе,
  крови и операционных кадров (compliance/content-rules.md, разд. 2).
-->
<script setup lang="ts">
const { m } = useLocale()

const base = useRuntimeConfig().app.baseURL
</script>

<template>
  <!--
    Вертикаль разметки уведена в коридор между колонками (0.207 вместо обычных 0.161):
    сбоку лежит фотография с подписью, и на обычном месте линия прошла бы прямо
    по буквам подписи. Правило: точка ставится там, где не пересекает контент;
    под фотографией линия проходить может, по тексту - нет.
  -->
  <PageSection
    id="doctor"
    :label="m.doctor.label"
    tone="paper"
    cross-y="5.5rem"
    :cross-fraction="0.207"
  >
    <template #side>
      <figure class="doctor__figure">
        <img
          :src="`${base}media/archive-father.jpg`"
          :alt="m.doctor.photoAlt"
          width="900"
          height="1234"
          loading="lazy"
        />
        <figcaption class="doctor__caption">{{ m.doctor.photoCaption }}</figcaption>
      </figure>
    </template>

    <KaraokeText tag="h2" :key="m.doctor.title" :text="m.doctor.title" />

    <p class="doctor__lead">{{ m.doctor.lead }}</p>

    <FactList :items="m.doctor.facts" />

    <p class="doctor__note">{{ m.doctor.note }}</p>
  </PageSection>
</template>

<style scoped>
.doctor__figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}

.doctor__figure img {
  inline-size: 100%;
  block-size: auto;
  /* Тёплая подложка того же семейства, что бумага: пока снимок грузится, на его месте
     не белый провал */
  background: var(--paper-deep);
}

.doctor__caption {
  font-size: var(--fs-small);
  line-height: 1.5;
  color: var(--ink-soft);
  max-inline-size: 28ch;
}

.doctor__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(52ch, 100%);
}

/*
  Примечание про документы и лицензию. Кегль основной, не мелкий: требование
  ST-21 п. 7.1.5 - мелкий текст должен читаться невооружённым глазом.
*/
.doctor__note {
  font-size: var(--fs-body);
  color: var(--ink-soft);
  max-inline-size: min(58ch, 100%);
}

@media (max-width: 900px) {
  /* На телефоне снимок уходит под текст блока и занимает не всю ширину:
     во всю ширину архивный кадр начинает спорить с портретом на первом экране */
  .doctor__figure {
    max-inline-size: 15rem;
    margin-block-start: var(--s-4);
  }
}
</style>
