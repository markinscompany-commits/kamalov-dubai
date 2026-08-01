<!--
  Документы врача: миниатюра + подпись. Открываются в новой вкладке в полном размере.

  Зачем на странице: диплом и сертификат - единственное доказательство квалификации,
  которое можно показать, не нарушая правил. Отзывы нельзя, «до/после» нельзя,
  обещать результат нельзя - а документ это факт, который человек проверяет глазами.

  ⚠️ Документов с гербом и логотипом департамента здравоохранения Дубая здесь НЕТ
  намеренно: ST-21 п. 7.2 запрещает использовать логотип DHA без письменного
  разрешения. Регистрация DHA указана текстом в хронологии - это разрешено.

  Наведение: уголки замыкаются в рамку - общий приём сайта (.brackets из base.css).
-->
<script setup lang="ts">
interface Doc {
  /** Имя файла в public/media/docs */
  file: string
  /** Что это за документ */
  title: string
  /** Год и кем выдан */
  meta: string
}

interface Props {
  items: Doc[]
  /** Подпись на полях над сеткой */
  label: string
}

defineProps<Props>()

const base = useRuntimeConfig().app.baseURL
</script>

<template>
  <div class="docs">
    <p class="mono docs__label">{{ label }}</p>

    <ul class="docs__grid">
      <li v-for="doc in items" :key="doc.file" class="docs__cell">
        <a
          class="docs__item brackets"
          :href="`${base}media/docs/${doc.file}`"
          target="_blank"
          rel="noopener"
        >
          <span class="docs__shot">
            <img :src="`${base}media/docs/${doc.file}`" :alt="doc.title" loading="lazy" />
          </span>
          <span class="docs__title">{{ doc.title }}</span>
          <span class="mono docs__meta">{{ doc.meta }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.docs {
  display: flex;
  flex-direction: column;
  gap: var(--s-5);
}

.docs__label {
  margin: 0;
}

.docs__grid {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: var(--s-6);
}

/* На телефоне карточки встают по две в ряд: по одной блок документов
   растягивается на пол-экрана прокрутки */
@media (max-width: 700px) {
  .docs__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--s-5) var(--s-4);
  }
}

.docs__cell {
  min-inline-size: 0;
}

.docs__item {
  --brackets-inset: -0.6rem;

  display: flex;
  flex-direction: column;
  gap: var(--s-2);
  color: var(--ink);
}

/*
  Сам скан лежит в тонкой рамке на приподнятой бумаге: документ должен читаться
  как документ, а не как картинка в галерее. Пропорция задана заранее, чтобы
  страница не прыгала, пока миниатюры грузятся.
*/
.docs__shot {
  display: block;
  aspect-ratio: 4 / 3;
  padding: var(--s-2);
  overflow: hidden;
  background: var(--paper-raised);
  border: var(--rule-w) solid color-mix(in srgb, var(--ink) 18%, transparent);
}

/*
  Документ вписывается ЦЕЛИКОМ, а не заполняет карточку. Заполнение срезает у одних
  сканов герб, у других подпись - и документ перестаёт читаться как документ.
  Пропорции у сканов разные, поэтому свободное место остаётся, и это нормально:
  карточка выглядит как лист на столе.
*/
.docs__shot img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: contain;
  transition: transform var(--dur-base) var(--ease-out);
}

.docs__item:hover .docs__shot img,
.docs__item:focus-visible .docs__shot img {
  transform: scale(1.03);
}

.docs__title {
  font-size: var(--fs-body);
  line-height: 1.4;
}

.docs__meta {
  color: var(--ink-soft);
}
</style>
