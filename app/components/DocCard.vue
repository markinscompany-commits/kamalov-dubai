<!--
  Карточка документа: значок листа, внутри - герб организации, выдавшей документ,
  под значком короткая подпись.

  Решение Марка (01.08): показываем НЕ фотографии сканов, а одинаковые значки.
  Причина понятная: сканы разного цвета, размера и качества, рядом они выглядят
  свалкой, а значок с гербом читается за долю секунды и держит ряд ровным.

  Пока герба нет, внутри листа рисуются строки - тот же значок, но «пустой».
  Как только файл появится в public/media/docs/logos, он встаёт на место строк.

  Сам скан открывается по клику в новой вкладке: человеку, который хочет
  проверить документ, он доступен, но на странице не шумит.

  ⚠️ Герб и логотип департамента здравоохранения Дубая сюда ставить нельзя без
  письменного разрешения клиники - ST-21 п. 7.2.
-->
<script setup lang="ts">
interface Props {
  /** Скан документа в public/media/docs - открывается по клику */
  file: string
  /** Герб организации в public/media/docs/logos. Нет - рисуются строки */
  logo?: string
  title: string
  meta: string
}

defineProps<Props>()

const base = useRuntimeConfig().app.baseURL
</script>

<template>
  <a class="doc brackets" :href="`${base}media/docs/${file}`" target="_blank" rel="noopener">
    <span class="doc__sheet">
      <!-- Лист с загнутым уголком. Обводка, а не заливка: значок должен быть
           нарисован тем же пером, что вся разметка сайта -->
      <svg class="doc__icon" viewBox="0 0 100 124" aria-hidden="true" focusable="false">
        <path class="doc__outline" d="M4 4 H68 L96 32 V120 H4 Z" />
        <path class="doc__outline" d="M68 4 V32 H96" />
      </svg>

      <img v-if="logo" class="doc__logo" :src="`${base}${logo}`" alt="" />
      <svg v-else class="doc__lines" viewBox="0 0 52 34" aria-hidden="true" focusable="false">
        <g class="doc__rule">
          <path d="M0 3 H22" />
          <path d="M0 13 H52" />
          <path d="M0 21 H52" />
          <path d="M0 29 H52" />
        </g>
      </svg>
    </span>

    <span class="doc__title">{{ title }}</span>
    <span class="mono doc__meta">{{ meta }}</span>
  </a>
</template>

<style scoped>
.doc {
  --brackets-inset: -0.7rem;

  block-size: 100%;
  display: grid;
  /* Значок, заголовок, подпись - три ряда фиксированного порядка. Заголовок
     тянется, поэтому карточки в ряду одинаковой высоты независимо от длины текста */
  grid-template-rows: auto 1fr auto;
  gap: var(--s-3);
  color: var(--ink);
}

.doc__sheet {
  position: relative;
  display: grid;
  place-items: center;
  block-size: 6.5rem;
}

.doc__icon {
  block-size: 100%;
  inline-size: auto;
}

.doc__outline {
  fill: none;
  stroke: var(--ink);
  stroke-width: 4;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  transition: stroke var(--dur-fast) var(--ease-out);
}

/* Герб и строки лежат внутри листа, по центру */
.doc__logo,
.doc__lines {
  position: absolute;
  inline-size: 42%;
  max-block-size: 42%;
  object-fit: contain;
}

.doc__rule path {
  fill: none;
  stroke: var(--ink-faint);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

.doc:hover .doc__outline,
.doc:focus-visible .doc__outline {
  stroke: var(--blue);
}

.doc__title {
  font-size: var(--fs-body);
  line-height: 1.35;
}

.doc__meta {
  color: var(--ink-soft);
}
</style>
