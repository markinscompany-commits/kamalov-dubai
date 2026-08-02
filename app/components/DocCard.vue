<!--
  Карточка документа: значок листа, внутри - герб организации, выдавшей документ,
  под значком короткое название.

  Решение Марка: показываем НЕ фотографии сканов, а одинаковые значки. Причина
  понятная: сканы разного цвета, размера и качества, рядом они выглядят свалкой,
  а значок с гербом читается за долю секунды и держит ряд ровным.

  Значок выровнен ПО ЛЕВОМУ КРАЮ с названием (правка Марка): по центру он выпадал
  из левого края всего остального на странице.

  Строк внутри листа нет - вместо них герб. Пока герба нет, лист остаётся пустым:
  это честнее, чем рисовать заглушку, и сразу видно, чего не хватает.

  Сам скан открывается по клику в новой вкладке: человеку, который хочет проверить
  документ, он доступен, но на странице не шумит.
-->
<script setup lang="ts">
interface Props {
  /** Скан документа в public/media/docs - открывается по клику */
  file: string
  /** Герб организации, путь от public/ */
  logo?: string
  title: string
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

      <img v-if="logo" class="doc__logo" :src="`${base}${logo}`" alt="" aria-hidden="true" />
    </span>

    <span class="doc__title">{{ title }}</span>
  </a>
</template>

<style scoped>
.doc {
  /*
    Уголки идут ровно по краю карточки, а не с отступом наружу. Так соседние
    карточки в ленте делят общую границу, уголки сходятся, и ряд читается одной
    полосой. Заодно левый край первого документа встаёт ровно под заголовком
    блока - раньше уголок вылезал левее и ломал колонку (та же история, что
    была с логотипом в шапке).
  */
  --brackets-inset: 0;

  block-size: 100%;
  padding: var(--s-3);
  display: grid;
  /* Значок и название прижаты к левому краю карточки - как весь текст на странице */
  justify-items: start;
  align-content: start;
  gap: var(--s-3);
  color: var(--ink);
}

.doc__sheet {
  position: relative;
  display: grid;
  place-items: center;
  block-size: 5.5rem;
}

.doc__icon {
  block-size: 100%;
  inline-size: auto;
}

.doc__outline {
  fill: none;
  stroke: var(--ink);
  stroke-width: 3;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  transition: stroke var(--dur-fast) var(--ease-out);
}

/* Герб лежит внутри листа, по центру. Ограничен и по ширине, и по высоте:
   у гербов разные пропорции, без второго предела широкий вылезает за лист */
.doc__logo {
  position: absolute;
  max-inline-size: 72%;
  max-block-size: 48%;
  inline-size: auto;
  block-size: auto;
  object-fit: contain;
}

.doc:hover .doc__outline,
.doc:focus-visible .doc__outline {
  stroke: var(--blue);
}

.doc__title {
  font-size: var(--fs-small);
  line-height: 1.4;
}
</style>
