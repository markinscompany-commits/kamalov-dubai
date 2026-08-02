<!--
  Блок «О докторе».

  Обязателен по договору и по стандарту: образование, стаж, членства, регистрация DHA.
  ⚠️ ST-21 п. 8.1.3 - титул и специализация пишутся слово в слово как в лицензии.
  По имеющейся регистрации DHA (assets-temp/docs) это «Physician - Specialist -
  Otolaryngology». Ждём от клиники ДЕЙСТВУЮЩУЮ лицензию: та, что есть, истекла 16.04.2026.

  Блок собран так, чтобы его читали, а не пролистывали. Четыре разных по фактуре
  куска вместо сплошного текста:
  · портрет и лид - кто это;
  · три цифры в лавровых ветвях - за что цепляется глаз;
  · хронология по годам - путь, а не перечень;
  · документы миниатюрами - доказательство, которое проверяется глазами.

  Почему документы вообще здесь: отзывы нам нельзя, «до/после» нельзя, обещать
  результат нельзя. Документ - единственное доказательство квалификации, которое
  правила разрешают показать.

  Оба снимка проходят по правилам: врачи, а не пациенты; ни инструментов в работе,
  ни операционных кадров (compliance/content-rules.md, разд. 2).
-->
<script setup lang="ts">
const { m } = useLocale()

const base = useRuntimeConfig().app.baseURL
</script>

<template>
  <!--
    Вертикаль разметки уведена в коридор между колонками (0.207 вместо обычных 0.161):
    сбоку лежат фотографии с подписью, и на обычном месте линия прошла бы по буквам.
    Под фотографией линия проходить может, по тексту - нет.
  -->
  <PageSection
    id="doctor"
    :label="m.doctor.label"
    tone="paper"
    cross-y="5.5rem"
    :cross-fraction="0.207"
  >
    <template #side>
      <!-- ⚠️ ВРЕМЕННО: это другой план того же кадра, что на первом экране.
           Заменить на снимок из второй фотосессии, когда клиника её передаст. -->
      <figure class="doctor__figure" data-mobile-first>
        <img
          class="doctor__portrait"
          :src="`${base}media/doctor-close.jpg`"
          :alt="m.doctor.portraitAlt"
          width="800"
          height="920"
          loading="lazy"
        />
        <figcaption class="doctor__name">{{ m.doctor.fullName }}</figcaption>
      </figure>

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

    <SectionTitle :text="m.doctor.title" />

    <p class="doctor__lead">{{ m.doctor.lead }}</p>

    <!-- Цифры: стаж, награда, общества, регистрация в Дубае -->
    <div class="doctor__stats">
      <div class="doctor__stats-row">
        <LaurelStat
          v-for="stat in m.doctor.stats"
          :key="stat.caption"
          :value="stat.value"
          :logo="stat.logo"
          :wide="stat.wide"
          :caption="stat.caption"
        />
      </div>

    </div>

    <div class="doctor__part">
      <p class="mono doctor__part-label">{{ m.doctor.timelineLabel }}</p>
      <TimeLine
        :items="m.doctor.timeline"
        :visible="3"
        :more-label="m.doctor.timelineMore"
        :less-label="m.doctor.timelineLess"
      />
    </div>

    <DocGrid class="doctor__docs" :label="m.doctor.docsLabel" :items="m.doctor.docs" />
  </PageSection>
</template>

<style scoped>
.doctor__portrait {
  inline-size: 100%;
  block-size: auto;
  background: var(--photo-bg);
}

/* Полное имя под портретом - так, как оно значится в документах */
.doctor__name {
  font-size: var(--fs-body);
  line-height: 1.4;
  color: var(--ink);
}

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
  Знаки стоят в ряд и отбиты от текста воздухом с обеих сторон: это пауза в чтении,
  ради неё они и нужны. Отступ щедрый - на скриншоте Марка блок читался слипшимся.
*/
.doctor__stats {
  display: flex;
  flex-direction: column;
  padding-block: var(--s-8);
}

/*
  Ряд знаков - сетка с равными колонками, а не гибкая строка: у знаков разные по
  длине подписи, и во flex они разъезжались по ширине. Одинаковая колонка = ровный
  ряд независимо от текста.
*/
.doctor__stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: clamp(var(--s-8), 3vw, var(--s-12)) var(--s-6);
  align-items: start;
}

.doctor__part {
  display: flex;
  flex-direction: column;
  gap: var(--s-5);
}

/* Документы отбиты от хронологии сильнее обычного: это другой по смыслу кусок,
   а вплотную он читался как продолжение ленты годов */
.doctor__docs {
  margin-block-start: var(--s-10);
}

.doctor__part-label {
  margin: 0;
}


/* На телефоне знаки встают по два в ряд: по одному ряд растягивается
   на пол-экрана прокрутки и перестаёт читаться как ряд */
@media (max-width: 700px) {
  .doctor__stats-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--s-8) var(--s-4);
  }
}

@media (max-width: 900px) {
  /* На телефоне снимки уходят под текст блока и занимают не всю ширину:
     во всю ширину они начинают спорить с портретом на первом экране */
  .doctor__figure {
    max-inline-size: 15rem;
  }

  .doctor__figure[data-mobile-first] {
    margin-block-end: var(--s-2);
  }
}
</style>
