<!--
  Блок 06 «Где принимает» - Dubai London Hospital. Версия 4 по правкам Марка 04.08.

  Структура:
  · слева в боковой колонке ОДИН кадр - фасад с вывеской;
  · кабинет приёма и палата - парой в ряд после лида (и на телефоне тоже парой);
  · печати: значок аккредитации ACHS (официальный логотип, как логотипы обществ
    в «О докторе»), ЛОР с иконкой профиля, флаги языков приёма. Печати DHA нет
    (решение Марка - лицензия и так раскрыта в блоке о враче);
  · разметка CrossRules вернулась - та же точка, что у «О докторе» (0.207);
  · карта во всю ширину колонки до правого края, над ней mono-заголовок
    «// Расположение госпиталя», под ней адрес. Маркер госпиталя - красный.

  Все кадры открываются на весь экран (PhotoViewer): о клике говорят уголки
  и значок разворота, отдельного текста-подсказки нет.

  ⚠️ Правило блока: не повторять ни соседние блоки, ни самого себя - ни в
  текстах, ни в фактах (правка Марка 03.08).

  Фотографии - из открытой галереи Dubai London Hospital (решение Марка 02.08,
  клиника согласовывает постфактум). Исходники в assets-temp/dlh-selected.
-->
<script setup lang="ts">
const { m } = useLocale()

const base = useRuntimeConfig().app.baseURL

/** Открытый кадр просмотрщика; null - закрыт */
const viewerIndex = ref<number | null>(null)

const stampsEl = ref<HTMLElement | null>(null)
// Печати проявляются по очереди и, как вся разметка, рисуются заново при возврате
const stampsLive = useRedrawOnReturn(stampsEl, 0.35)

/*
  Дымки мобильной ленты пары кадров - тот же механизм, что у ленты документов:
  левая горит, только если что-то уже ушло за левый край, правая - пока справа
  есть неувиденное. На десктопе пара не прокручивается, и дымки не загораются.
*/
const pairEl = ref<HTMLElement | null>(null)
const fadeStart = ref(false)
const fadeEnd = ref(false)

/** Порог в пикселях: на дробных значениях прокрутки дымка иначе мигает у края */
const EDGE = 2

function updateFades() {
  const el = pairEl.value
  if (!el) return
  fadeStart.value = el.scrollLeft > EDGE
  fadeEnd.value = el.scrollLeft + el.clientWidth < el.scrollWidth - EDGE
}

let pairObserver: ResizeObserver | null = null

onMounted(() => {
  updateFades()
  pairEl.value?.addEventListener('scroll', updateFades, { passive: true })
  pairObserver = new ResizeObserver(updateFades)
  if (pairEl.value) pairObserver.observe(pairEl.value)
})

onBeforeUnmount(() => {
  pairEl.value?.removeEventListener('scroll', updateFades)
  pairObserver?.disconnect()
})
</script>

<template>
  <!-- Вертикаль разметки в коридоре между колонками - та же точка, что у
       «О докторе»: сбоку лежит фотография, на обычном месте линия шла бы по ней -->
  <PageSection
    id="clinic"
    :label="m.clinic.label"
    tone="deep"
    cross-y="5.5rem"
    :cross-fraction="0.207"
  >
    <!-- Слева только фасад: остальные кадры ушли парой под лид -->
    <template #side>
      <figure class="clinic__figure" data-mobile-order="2">
        <button
          type="button"
          class="clinic__shot brackets"
          :aria-label="m.clinic.gallery[0].caption"
          @click="viewerIndex = 0"
        >
          <span class="clinic__shot-frame">
            <img
              :src="`${base}media/${m.clinic.gallery[0].file}`"
              :alt="m.clinic.gallery[0].alt"
              :width="m.clinic.gallery[0].w"
              :height="m.clinic.gallery[0].h"
              loading="lazy"
            />
            <span class="clinic__expand" aria-hidden="true">
              <svg viewBox="0 0 16 16">
                <path d="M9.5 2 H14 V6.5 M14 2 L9.5 6.5 M6.5 14 H2 V9.5 M2 14 L6.5 9.5" />
              </svg>
            </span>
          </span>
        </button>
        <figcaption class="clinic__shot-caption">{{ m.clinic.gallery[0].caption }}</figcaption>
      </figure>
    </template>

    <SectionTitle :text="m.clinic.title" data-mobile-order="1" />

    <!-- Пара кадров стоит ВЫШЕ лида (правка Марка, только ПК) - на телефоне
         порядок прежний: заголовок → фасад → лид → пара. Обёртка нужна дымкам -->
    <div class="clinic__pairwrap" data-mobile-order="4">
      <div ref="pairEl" class="clinic__pair">
        <figure v-for="i in [1, 2]" :key="m.clinic.gallery[i].file" class="clinic__figure">
          <button
            type="button"
            class="clinic__shot brackets"
            :aria-label="m.clinic.gallery[i].caption"
            @click="viewerIndex = i"
          >
            <span class="clinic__shot-frame">
              <img
                :src="`${base}media/${m.clinic.gallery[i].file}`"
                :alt="m.clinic.gallery[i].alt"
                :width="m.clinic.gallery[i].w"
                :height="m.clinic.gallery[i].h"
                loading="lazy"
              />
              <span class="clinic__expand" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M9.5 2 H14 V6.5 M14 2 L9.5 6.5 M6.5 14 H2 V9.5 M2 14 L6.5 9.5" />
                </svg>
              </span>
            </span>
          </button>
          <figcaption class="clinic__shot-caption">{{ m.clinic.gallery[i].caption }}</figcaption>
        </figure>
      </div>

      <span class="clinic__fade clinic__fade--start" :class="{ 'is-on': fadeStart }" aria-hidden="true" />
      <span class="clinic__fade clinic__fade--end" :class="{ 'is-on': fadeEnd }" aria-hidden="true" />
    </div>

    <p class="clinic__lead" data-mobile-order="3">{{ m.clinic.lead }}</p>

    <!-- Печати: аккредитация значком, языки флагами. Пунктирное кольцо - язык
         разметки, как кольцо маркера на карте. Печати ЛОР нет: факт живёт в лиде -->
    <ul ref="stampsEl" class="clinic__stamps" :class="{ 'is-live': stampsLive }">
      <li class="clinic__stamp" :style="{ '--i': 0 }">
        <span class="clinic__badge">
          <svg class="clinic__ring" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="59" />
          </svg>
          <img
            class="clinic__badge-logo"
            :src="`${base}media/logos/achsi.png`"
            :alt="m.clinic.stamps[0].imgAlt"
            width="320"
            height="320"
            loading="lazy"
          />
        </span>
        <span class="clinic__caption">{{ m.clinic.stamps[0].caption }}</span>
      </li>

      <li class="clinic__stamp" :style="{ '--i': 1 }">
        <span class="clinic__badge">
          <svg class="clinic__ring" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="59" />
          </svg>
          <!-- Флаги языков приёма: русский и английский. Цвета чуть приглушены
               под палитру, пара со сдвигом - как кадры в журнальной перекладке -->
          <span class="clinic__flags" aria-hidden="true">
            <svg class="clinic__flag clinic__flag--ru" viewBox="0 0 30 20">
              <rect width="30" height="20" fill="#F2F0EA" />
              <rect y="6.67" width="30" height="6.66" fill="#33527C" />
              <rect y="13.33" width="30" height="6.67" fill="#A8423C" />
            </svg>
            <svg class="clinic__flag clinic__flag--en" viewBox="0 0 30 20">
              <rect width="30" height="20" fill="#33527C" />
              <path d="M0 0 L30 20 M30 0 L0 20" stroke="#F2F0EA" stroke-width="3.6" />
              <path d="M15 0 V20 M0 10 H30" stroke="#F2F0EA" stroke-width="6" />
              <path d="M15 0 V20 M0 10 H30" stroke="#A8423C" stroke-width="3" />
            </svg>
          </span>
        </span>
        <span class="clinic__caption">{{ m.clinic.stamps[1].caption }}</span>
      </li>
    </ul>

    <figure class="clinic__mapfig">
      <p class="mono clinic__map-label">{{ m.clinic.mapLabel }}</p>
      <ClinicMap :labels="m.clinic.map" />
      <figcaption class="mono clinic__address">{{ m.clinic.address }}</figcaption>
    </figure>

    <PhotoViewer v-model:index="viewerIndex" :items="m.clinic.gallery" />
  </PageSection>
</template>

<style scoped>
/* --- Кадры --- */

.clinic__figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}

/* Пара кадров - во всю ширину колонки, до правого края, как карта */
.clinic__pairwrap {
  position: relative;
  min-inline-size: 0;
}

.clinic__pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-6);
}

/* Дымки мобильной ленты; на десктопе пара не листается - выключены совсем */
.clinic__fade {
  display: none;
  position: absolute;
  inset-block: 0;
  inline-size: 2.75rem;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-out);
}

.clinic__fade.is-on {
  opacity: 1;
}

.clinic__fade--start {
  inset-inline-start: 0;
  background: linear-gradient(to right, var(--paper-deep), transparent);
}

.clinic__fade--end {
  inset-inline-end: 0;
  background: linear-gradient(to left, var(--paper-deep), transparent);
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

/* Кадры целиком, пропорции родные - без обрезки */
.clinic__shot img {
  display: block;
  inline-size: 100%;
  block-size: auto;
  background: var(--paper-raised);
  transition: transform var(--dur-base) var(--ease-out);
}

/* Пара под лидом: кадры разной пропорции ровняем по высоте ряда */
.clinic__pair .clinic__shot img {
  aspect-ratio: 3 / 2;
  object-fit: cover;
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
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: var(--s-8) var(--s-6);
  padding-block: var(--s-6);
  max-inline-size: 62ch;
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

.clinic__badge-logo {
  inline-size: 46%;
  block-size: auto;
}

.clinic__flags {
  position: relative;
  inline-size: 52%;
  aspect-ratio: 30 / 26;
}

.clinic__flag {
  position: absolute;
  inline-size: 78%;
  block-size: auto;
  outline: 1px solid var(--rule-faint);
}

.clinic__flag--ru {
  inset-block-start: 0;
  inset-inline-start: 0;
}

/* Английский флаг ниже и правее - пара со сдвигом, а не таблица */
.clinic__flag--en {
  inset-block-end: 0;
  inset-inline-end: 0;
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

/* --- Карта: во всю ширину колонки, до правого края сайта --- */

.clinic__mapfig {
  margin: var(--s-6) 0 0;
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--s-5);
}

.clinic__map-label,
.clinic__address {
  margin: 0;
}

@media (max-width: 900px) {
  /* Пара на телефоне - лента с горизонтальной прокруткой и дымками по краям,
     как лента документов. Кадры выше: 4:3 вместо 3:2 (правка Марка) */
  .clinic__pairwrap {
    margin-inline: calc(-1 * var(--page-pad));
  }

  .clinic__pair {
    display: flex;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scroll-snap-type: x proximity;
    /* Без этого снап прижимает кадр к краю экрана, игнорируя внутренний отступ,
       и подпись первого кадра срезается за левой кромкой */
    scroll-padding-inline: var(--page-pad);
    scrollbar-width: none;
    gap: var(--s-3);
    padding-inline: var(--page-pad);
  }

  .clinic__pair::-webkit-scrollbar {
    display: none;
  }

  .clinic__pair .clinic__figure {
    flex: 0 0 82%;
    scroll-snap-align: start;
  }

  .clinic__pair .clinic__shot img {
    aspect-ratio: 4 / 3;
  }

  .clinic__fade {
    display: block;
  }

  .clinic__stamps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--s-6) var(--s-4);
    max-inline-size: 100%;
  }

  /* Подписи пары мельче: в половину ширины экрана длинная подпись
     перевешивает кадр - как у снимков в «О докторе» */
  .clinic__pair .clinic__shot-caption {
    font-size: 0.8125rem;
  }
}
</style>
