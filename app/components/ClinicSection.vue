<!--
  Блок 06 «Где принимает» - Dubai London Hospital. Версия 2 по правкам Марка 03.08.

  Что изменилось против первой сборки (она была «сухая», как ранние версии
  «О докторе»):
  · фотографии ушли в боковую колонку слева, как в «О докторе», и стали галереей
    из пяти кадров - каждый открывается на весь экран с зумом (PhotoViewer);
  · сухой список фактов стал «печатями»: значение в пунктирном кольце + подпись.
    Кольцо рифмуется с кольцом-прицелом на карте;
  · карта перерисована по настоящей географии OpenStreetMap, под ней адрес и
    кнопка «Построить маршрут» (внешняя ссылка на Google Maps - сама страница
    чужих доменов не грузит);
  · лид растянут до общей ширины текста (62ch), заголовок сменён.

  ⚠️ У секции нет обычной разметки CrossRules (no-rules): разметкой блока работает
  карта - узел с кольцом на месте госпиталя. Лучи спорили бы с линиями улиц.

  Фотографии - из открытой галереи Dubai London Hospital (решение Марка 02.08,
  клиника согласовывает постфактум). Кадрирование и ретушь намеренные:
  без рекламных баннеров, без красных вывесок Emergency, без портретов
  правителей ОАЭ. Исходники в assets-temp/dlh-selected.
-->
<script setup lang="ts">
const { m } = useLocale()

const base = useRuntimeConfig().app.baseURL

/** Открытый кадр просмотрщика; null - закрыт */
const viewerIndex = ref<number | null>(null)

const stampsEl = ref<HTMLElement | null>(null)
// Печати проявляются по очереди и, как вся разметка, рисуются заново при возврате
const stampsLive = useRedrawOnReturn(stampsEl, 0.35)
</script>

<template>
  <PageSection id="clinic" :label="m.clinic.label" tone="deep" no-rules>
    <!-- Галерея: клиника с разных сторон. Первый кадр крупно, остальные парами.
         На телефоне превращается в горизонтальную ленту со снапом -->
    <template #side>
      <div class="clinic__gallery" data-mobile-order="2">
        <div class="clinic__strip">
          <button
            v-for="(photo, i) in m.clinic.gallery"
            :key="photo.file"
            type="button"
            class="clinic__shot brackets"
            :class="{ 'clinic__shot--lead': i === 0 }"
            @click="viewerIndex = i"
          >
            <span class="clinic__shot-frame">
              <img
                :src="`${base}media/${photo.file}`"
                :alt="photo.alt"
                :width="photo.w"
                :height="photo.h"
                loading="lazy"
              />
            </span>
          </button>
        </div>

        <p class="mono clinic__hint">{{ m.clinic.galleryHint }}</p>
      </div>
    </template>

    <SectionTitle :text="m.clinic.title" data-mobile-order="1" />

    <p class="clinic__lead" data-mobile-order="3">{{ m.clinic.lead }}</p>

    <!-- Печати: значение в пунктирном кольце + подпись. Не иконки и не галочки -
         тот же язык, что кольцо-прицел на карте -->
    <ul ref="stampsEl" class="clinic__stamps" :class="{ 'is-live': stampsLive }">
      <li
        v-for="(stamp, i) in m.clinic.stamps"
        :key="stamp.value"
        class="clinic__stamp"
        :style="{ '--i': i }"
      >
        <span class="clinic__badge" :class="`clinic__badge--${stamp.size}`">
          <svg class="clinic__ring" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="59" />
          </svg>
          <span class="clinic__value">{{ stamp.value }}</span>
        </span>
        <span class="clinic__caption">{{ stamp.caption }}</span>
      </li>
    </ul>

    <figure class="clinic__mapfig">
      <ClinicMap :labels="m.clinic.map" />
      <figcaption class="clinic__mapline">
        <span class="mono clinic__address">{{ m.clinic.address }}</span>
        <MarkAction variant="ghost" :href="m.clinic.route.href" target="_blank" rel="noopener">
          {{ m.clinic.route.label }} ↗
        </MarkAction>
      </figcaption>
    </figure>

    <PhotoViewer v-model:index="viewerIndex" :items="m.clinic.gallery" />
  </PageSection>
</template>

<style scoped>
/* --- Галерея --- */

.clinic__gallery {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}

.clinic__strip {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-3);
}

.clinic__shot {
  --brackets-inset: 0;
  position: relative;
  display: block;
  padding: 0;
  cursor: zoom-in;
  color: var(--ink);
}

.clinic__shot--lead {
  grid-column: 1 / -1;
}

/* Кадр обрезается внутренней рамкой, а не кнопкой: у кнопки живут уголки,
   и overflow на ней срезал бы их */
.clinic__shot-frame {
  display: block;
  overflow: hidden;
}

.clinic__shot img {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  aspect-ratio: 4 / 3;
  background: var(--paper-raised);
  transition: transform var(--dur-base) var(--ease-out);
}

.clinic__shot--lead img {
  aspect-ratio: 16 / 10;
}

.clinic__shot:hover img,
.clinic__shot:focus-visible img {
  transform: scale(1.045);
}

.clinic__hint {
  margin: var(--s-2) 0 0;
}

/* --- Текст --- */

.clinic__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(62ch, 100%);
}

/* --- Печати --- */

.clinic__stamps {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: var(--s-8) var(--s-6);
  padding-block: var(--s-6);
}

.clinic__stamp {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: var(--s-4);
}

.clinic__badge {
  position: relative;
  display: grid;
  place-items: center;
  inline-size: clamp(6.25rem, 7.5vw, 7.5rem);
  aspect-ratio: 1;
}

.clinic__ring {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
}

.clinic__ring circle {
  fill: none;
  stroke: var(--ink);
  stroke-width: var(--rule-w);
  vector-effect: non-scaling-stroke;
  stroke-dasharray: var(--dash-on) var(--dash-off);
}

/* Значение - антиква, как цифры в лавровых ветвях «О докторе» */
.clinic__value {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: 1.9rem;
  letter-spacing: 0.02em;
  color: var(--ink);
}

.clinic__badge--m .clinic__value {
  font-size: 1.3rem;
  letter-spacing: 0.05em;
}

.clinic__caption {
  font-size: var(--fs-small);
  line-height: 1.45;
  color: var(--ink-soft);
  max-inline-size: 13rem;
}

/* Появление печатей: по очереди, кольцо доворачивается на место.
   Стирание и повторное появление - useRedrawOnReturn, как у всей разметки */
.clinic__stamp {
  opacity: 0;
}

.clinic__stamps.is-live .clinic__stamp {
  animation: stamp-in var(--dur-slow) var(--ease-out) calc(var(--i) * 130ms) both;
}

.clinic__stamps.is-live .clinic__ring {
  animation: stamp-ring var(--dur-slow) var(--ease-out) calc(var(--i) * 130ms) both;
}

@keyframes stamp-in {
  from {
    opacity: 0;
    translate: 0 0.4rem;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

@keyframes stamp-ring {
  from {
    rotate: -18deg;
  }
  to {
    rotate: 0deg;
  }
}

/* --- Карта --- */

.clinic__mapfig {
  margin: var(--s-4) 0 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-5);
}

.clinic__mapline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--s-4) var(--s-6);
}

@media (max-width: 900px) {
  /* Лента вместо стопки: пять кадров стопкой заняли бы пол-экрана прокрутки.
     Видимый краешек следующего кадра подсказывает, что лента листается */
  .clinic__strip {
    display: flex;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
    margin-inline: calc(-1 * var(--page-pad));
    padding-inline: var(--page-pad);
  }

  .clinic__strip::-webkit-scrollbar {
    display: none;
  }

  .clinic__shot {
    flex: 0 0 76%;
    scroll-snap-align: start;
  }

  .clinic__shot img,
  .clinic__shot--lead img {
    aspect-ratio: 16 / 10;
  }

  .clinic__stamps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--s-6) var(--s-4);
  }

  .clinic__mapline {
    flex-direction: column;
    align-items: start;
  }
}
</style>
