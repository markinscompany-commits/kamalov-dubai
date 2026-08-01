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
      <img
        class="doctor__portrait"
        :src="`${base}media/doctor-close.jpg`"
        :alt="m.doctor.portraitAlt"
        width="800"
        height="920"
        loading="lazy"
      />

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

    <!-- Три цифры: стаж, награда, регистрация в Дубае -->
    <div class="doctor__stats">
      <LaurelStat
        v-for="stat in m.doctor.stats"
        :key="stat.value"
        :value="stat.value"
        :caption="stat.caption"
      />
    </div>

    <div class="doctor__part">
      <p class="mono doctor__part-label">{{ m.doctor.timelineLabel }}</p>
      <TimeLine :items="m.doctor.timeline" />
      <p class="doctor__societies">{{ m.doctor.societies }}</p>
    </div>

    <DocGrid :label="m.doctor.docsLabel" :items="m.doctor.docs" />
  </PageSection>
</template>

<style scoped>
.doctor__portrait {
  inline-size: 100%;
  block-size: auto;
  background: var(--photo-bg);
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
  Цифры стоят в ряд и отбиты от текста воздухом с обеих сторон: это пауза в чтении,
  ради неё они и нужны.
*/
.doctor__stats {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(var(--s-3), 4vw, var(--s-16));
  padding-block: var(--s-4);
}

.doctor__part {
  display: flex;
  flex-direction: column;
  gap: var(--s-5);
}

.doctor__part-label {
  margin: 0;
}

.doctor__societies {
  font-size: var(--fs-body);
  color: var(--ink-soft);
  max-inline-size: min(58ch, 100%);
}

@media (max-width: 900px) {
  /* На телефоне снимки уходят под текст блока и занимают не всю ширину:
     во всю ширину они начинают спорить с портретом на первом экране */
  .doctor__portrait,
  .doctor__figure {
    max-inline-size: 15rem;
  }

  .doctor__portrait {
    margin-block-start: var(--s-4);
  }
}
</style>
