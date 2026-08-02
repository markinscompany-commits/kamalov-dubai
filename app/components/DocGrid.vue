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
  /* Отрицательный отступ: уголки соседних карточек ложатся друг на друга,
     и граница между документами пропадает совсем */
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scroll-snap-type: x proximity;
  /*
    Системная полоса прокрутки убрана: она серая, толстая и в чертёжную графику
    не вписывается. Понять, что лента прокручивается, помогает обрезанная
    карточка у правого края - этого достаточно.
  */
  scrollbar-width: none;
}

.docs__grid::-webkit-scrollbar {
  display: none;
}

.docs__cell {
  flex: 0 0 var(--doc-w);
  /* Наложение уголков: каждая следующая карточка заходит на предыдущую на пиксель */
  margin-inline-start: -1px;
  min-inline-size: 0;
  scroll-snap-align: start;
}

/* У первой карточки наложения нет - иначе весь ряд уезжает от левого края */
.docs__cell:first-child {
  margin-inline-start: 0;
}

@media (max-width: 700px) {
  .docs {
    --doc-w: 8rem;
  }
}
</style>
