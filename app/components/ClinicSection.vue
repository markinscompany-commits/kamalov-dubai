<!--
  Блок 06 «Где принимает» - Dubai London Hospital.

  Отвечает на вопрос: «Куда я приеду, что это за место, на каком языке со мной
  будут говорить». Подача «Координата» принята Марком 03.08: карта Джумейры,
  нарисованная разметкой сайта, - слева факты, справа карта, внизу два кадра.

  ⚠️ У секции НЕТ обычной разметки CrossRules (no-rules): разметкой этого блока
  работает сама карта - узел с кольцом на месте госпиталя. Вторая пара лучей
  спорила бы с линиями берега и дороги.

  Фотографии - из открытой галереи Dubai London Hospital (решение Марка 02.08,
  клиника согласовывает постфактум; откажут - кадры снимаются, блок держится
  на карте). Кадрирование намеренное:
  · фасад - без рекламных баннеров и красной вывески «24 hour emergency»;
  · ресепшен - без портретов правителей ОАЭ, маленькая вывеска EMERGENCY в
    глубине коридора закрашена цветом стены (assets-temp/dlh-selected - исходники,
    скрипт подготовки описан в session-log).
-->
<script setup lang="ts">
const { m } = useLocale()

const base = useRuntimeConfig().app.baseURL

/* Размеры готовых кадров - чтобы страница не прыгала при загрузке */
const photoSize: Record<string, { w: number; h: number }> = {
  'clinic/facade.jpg': { w: 864, h: 452 },
  'clinic/reception.jpg': { w: 552, h: 800 },
}
</script>

<template>
  <PageSection id="clinic" :label="m.clinic.label" tone="deep" no-rules>
    <SectionTitle :text="m.clinic.title" data-mobile-order="1" />

    <div class="clinic__grid" data-mobile-order="2">
      <div class="clinic__info">
        <p class="clinic__lead">{{ m.clinic.lead }}</p>
        <FactList :items="m.clinic.facts" />
      </div>

      <ClinicMap class="clinic__map" :labels="m.clinic.map" />
    </div>

    <!-- Два кадра с разной высотой и сдвигом - журнальная перекладка, не витрина -->
    <div class="clinic__photos">
      <figure
        v-for="(photo, i) in m.clinic.photos"
        :key="photo.file"
        class="clinic__figure"
        :class="{ 'clinic__figure--shifted': i === 0 }"
      >
        <img
          :src="`${base}media/${photo.file}`"
          :alt="photo.alt"
          :width="photoSize[photo.file]?.w"
          :height="photoSize[photo.file]?.h"
          loading="lazy"
        />
        <figcaption class="mono">{{ photo.caption }}</figcaption>
      </figure>
    </div>
  </PageSection>
</template>

<style scoped>
.clinic__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
  gap: clamp(var(--s-8), 3vw, var(--s-12));
  align-items: center;
}

/* Карта чуть выходит за правую границу колонки - воздух вместо рамки.
   Логический отступ: в RTL уйдёт влево сам */
.clinic__map {
  margin-inline-end: calc(-0.5 * var(--page-pad));
}

.clinic__info {
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
}

.clinic__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(52ch, 100%);
}

/* --- Кадры --- */

.clinic__photos {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: var(--s-6);
  align-items: start;
  margin-block-start: var(--s-8);
}

.clinic__figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}

/* Широкий кадр опущен относительно вертикального - строки нарочно не совпадают */
.clinic__figure--shifted {
  margin-block-start: var(--s-12);
}

.clinic__figure img {
  inline-size: 100%;
  block-size: auto;
  /* Тёплая подложка, пока снимок грузится */
  background: var(--paper-raised);
}

/* Вертикальный кадр слегка укорачиваем: полный 552x800 перевешивал ряд */
.clinic__figure:last-child img {
  aspect-ratio: 3 / 4;
  object-fit: cover;
  object-position: 50% 30%;
}

@media (max-width: 900px) {
  .clinic__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-8);
  }

  /* На телефоне карта идёт сразу под заголовком, до текста: сначала «где это»,
     потом подробности. Выход за границу здесь не нужен */
  .clinic__map {
    order: -1;
    margin-inline-end: 0;
  }

  .clinic__photos {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-8);
    margin-block-start: 0;
  }

  .clinic__figure--shifted {
    margin-block-start: 0;
  }

  /* В одну колонку вертикальный кадр слишком высокий - ровняем оба под 4:3 */
  .clinic__figure img,
  .clinic__figure:last-child img {
    aspect-ratio: 4 / 3;
    object-fit: cover;
    object-position: 50% 40%;
  }
}
</style>
