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
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  /* Отступ между карточками больше, чем зазор уголков (0.7rem), иначе рамки
     соседних карточек при наведении сходятся вплотную */
  gap: var(--s-8) var(--s-6);
}

.docs__cell {
  min-inline-size: 0;
}

@media (max-width: 700px) {
  .docs__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--s-8) var(--s-5);
  }
}
</style>
