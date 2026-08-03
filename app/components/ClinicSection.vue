<!--
  Блок 06 «Где принимает» - Dubai London Hospital. Версия 3 по правкам Марка 03.08.

  Что здесь и почему:
  · галерея слева - ТРИ кадра (фасад, кабинет приёма, палата), друг под другом,
    целиком и без обрезки, у каждого подпись. Ресепшен и томограф убраны
    (решение Марка: пользователю они ничего не говорят). Кадр открывается на
    весь экран (PhotoViewer); о клике говорят уголки и значок разворота при
    наведении - отдельного текста-подсказки нет;
  · «печати» - DHA, ACHSI, ЛОР, RU·EN. Печати 24/7 нет: она дословно
    повторяла заголовок;
  · карта по кадру со скриншота Марка - с Пальмой Джумейра, обзорный масштаб.
    Под ней только адрес: кнопки «Построить маршрут» нет (решение Марка -
    не уводить трафик с посадочной);
  · лид НЕ начинается с «Эльдар Камалов» - так начинается блок «О докторе»
    прямо над этим, и повтор бросается в глаза.

  ⚠️ У секции нет обычной разметки CrossRules (no-rules): разметкой блока
  работает карта - синий узел на месте госпиталя.

  Фотографии - из открытой галереи Dubai London Hospital (решение Марка 02.08,
  клиника согласовывает постфактум). Кадрирование намеренное: без рекламных
  баннеров и красных вывесок Emergency. Исходники в assets-temp/dlh-selected.
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
    <!-- Галерея: кадры целиком, с подписями. На телефоне - горизонтальная лента -->
    <template #side>
      <div class="clinic__gallery" data-mobile-order="2">
        <figure v-for="(photo, i) in m.clinic.gallery" :key="photo.file" class="clinic__figure">
          <button
            type="button"
            class="clinic__shot brackets"
            :aria-label="photo.caption"
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
              <!-- Значок разворота: подсказка «открывается на весь экран» без слов -->
              <span class="clinic__expand" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M9.5 2 H14 V6.5 M14 2 L9.5 6.5 M6.5 14 H2 V9.5 M2 14 L6.5 9.5" />
                </svg>
              </span>
            </span>
          </button>
          <figcaption class="clinic__shot-caption">{{ photo.caption }}</figcaption>
        </figure>
      </div>
    </template>

    <SectionTitle :text="m.clinic.title" data-mobile-order="1" />

    <p class="clinic__lead" data-mobile-order="3">{{ m.clinic.lead }}</p>

    <!-- Печати: значение в пунктирном кольце + подпись. Тот же язык, что
         кольцо-прицел на карте -->
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
      <figcaption class="mono clinic__address">{{ m.clinic.address }}</figcaption>
    </figure>

    <PhotoViewer v-model:index="viewerIndex" :items="m.clinic.gallery" />
  </PageSection>
</template>

<style scoped>
/* --- Галерея --- */

.clinic__gallery {
  display: flex;
  flex-direction: column;
  gap: var(--s-6);
}

.clinic__figure {
  margin: 0;
  display: flex;
  flex-direction: column;
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

/* Кадр обрезается внутренней рамкой, а не кнопкой: у кнопки живут уголки,
   и overflow на ней срезал бы их */
.clinic__shot-frame {
  position: relative;
  display: block;
  overflow: hidden;
}

/* Кадры целиком, пропорции родные - без обрезки (правка Марка) */
.clinic__shot img {
  display: block;
  inline-size: 100%;
  block-size: auto;
  background: var(--paper-raised);
  transition: transform var(--dur-base) var(--ease-out);
}

.clinic__shot:hover img,
.clinic__shot:focus-visible img {
  transform: scale(1.035);
}

/* Значок разворота: проявляется при наведении; там, где наведения нет
   (телефон), виден всегда */
.clinic__expand {
  position: absolute;
  inset-block-end: var(--s-2);
  inset-inline-end: var(--s-2);
  display: grid;
  place-items: center;
  inline-size: 1.9rem;
  block-size: 1.9rem;
  background: color-mix(in srgb, var(--ink) 55%, transparent);
  opacity: 0;
  transition: opacity var(--dur-fast) var(--ease-out);
}

.clinic__expand svg {
  inline-size: 0.85rem;
  block-size: 0.85rem;
  stroke: var(--paper);
  stroke-width: 1.2;
  fill: none;
}

.clinic__shot:hover .clinic__expand,
.clinic__shot:focus-visible .clinic__expand {
  opacity: 1;
}

@media (hover: none) {
  .clinic__expand {
    opacity: 0.85;
  }
}

.clinic__shot-caption {
  font-size: var(--fs-small);
  line-height: 1.4;
  color: var(--ink-soft);
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
  /* Не шире своей колонки: на телефоне 13rem вылезали на соседний столбец */
  max-inline-size: min(13rem, 100%);
}

/* Появление печатей: по очереди, кольцо доворачивается на место */
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

/* Не на всю ширину: при полной ширине колонки карта вырастала почти в экран
   высотой (правка Марка - «вдвое ниже»). 53rem при пропорции кадра 1.6:1
   дают ~520px высоты */
.clinic__mapfig {
  margin: var(--s-4) 0 0;
  max-inline-size: min(100%, 53rem);
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
}

.clinic__address {
  margin: 0;
}

@media (max-width: 900px) {
  /* Лента вместо стопки: три кадра стопкой заняли бы пол-экрана прокрутки.
     Видимый краешек следующего кадра подсказывает, что лента листается.
     В ленте кадры выровнены под одну пропорцию, иначе высота ряда прыгает */
  .clinic__gallery {
    flex-direction: row;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
    gap: var(--s-3);
    margin-inline: calc(-1 * var(--page-pad));
    padding-inline: var(--page-pad);
  }

  .clinic__gallery::-webkit-scrollbar {
    display: none;
  }

  .clinic__figure {
    flex: 0 0 76%;
    scroll-snap-align: start;
  }

  .clinic__shot img {
    aspect-ratio: 16 / 10;
    object-fit: cover;
  }

  .clinic__stamps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--s-6) var(--s-4);
  }
}
</style>
