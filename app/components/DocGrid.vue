<!--
  Документы врача - ряд одинаковых карточек (DocCard).

  Зачем на странице: диплом и сертификат - единственное доказательство квалификации,
  которое можно показать, не нарушая правил. Отзывы нельзя, «до/после» нельзя,
  обещать результат нельзя - а документ это факт, который человек проверяет глазами.

  ⚠️ Документов с гербом и логотипом департамента здравоохранения Дубая здесь НЕТ
  намеренно: ST-21 п. 7.2 запрещает использовать логотип DHA без письменного
  разрешения. Регистрация DHA указана текстом в хронологии - это разрешено.
-->
<script setup lang="ts">
interface Doc {
  file: string
  logo?: string
  title: string
}

interface Props {
  items: Doc[]
  /** Подпись на полях над сеткой */
  label: string
}

defineProps<Props>()
</script>

<template>
  <div class="docs">
    <p class="mono docs__label">{{ label }}</p>

    <ul class="docs__grid">
      <li v-for="doc in items" :key="doc.file" class="docs__cell">
        <DocCard :file="doc.file" :logo="doc.logo" :title="doc.title" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.docs {
  --doc-w: 9rem;

  display: flex;
  flex-direction: column;
  gap: var(--s-5);
}

.docs__label {
  margin: 0;
}

/*
  Документы идут ЛЕНТОЙ, а не сеткой: их семь и будет больше, а в сетке они
  разъезжались на несколько рядов и блок разрастался. Не влезли - лента
  прокручивается вбок.

  Отступа между карточками нет намеренно (правка Марка): уголки соседей
  сходятся на общей границе, и ряд читается как одна полоса, а не как набор
  отдельных коробок.
*/
.docs__grid {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  gap: 0;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scroll-snap-type: x proximity;
  /* Место под полосу прокрутки, чтобы она не наезжала на подписи */
  padding-block-end: var(--s-3);
  /* Тонкая полоса в цвете разметки вместо системной */
  scrollbar-width: thin;
  scrollbar-color: var(--rule) transparent;
}

.docs__cell {
  flex: 0 0 var(--doc-w);
  min-inline-size: 0;
  scroll-snap-align: start;
}

@media (max-width: 700px) {
  .docs {
    --doc-w: 8rem;
  }
}
</style>
