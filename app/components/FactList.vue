<!--
  Список фактов: слева короткая пометка (год, тип), справа сам факт.
  Строки разделены пунктиром того же шага, что вся разметка сайта.

  Используется и в «О докторе» (образование, регалии), и в блоках операций
  (что операция решает). Один приём на оба случая - список тут читается как
  запись в карте, а не как таблица преимуществ с галочками.

  ⚠️ Никаких иконок и галочек: они удешевляют подачу и в этой нише читаются
  как шаблон (design-brief.md, п. 10).
-->
<script setup lang="ts">
interface Item {
  /** Короткая пометка слева: год, «DHA», «01» */
  mark?: string
  /** Сам факт */
  text: string
}

interface Props {
  items: Item[]
}

defineProps<Props>()
</script>

<template>
  <ul class="facts">
    <li v-for="(item, i) in items" :key="i" class="facts__row">
      <span class="mono facts__mark">{{ item.mark }}</span>
      <span class="facts__text">{{ item.text }}</span>
    </li>
  </ul>
</template>

<style scoped>
.facts {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
}

.facts__row {
  min-inline-size: 0;
  display: grid;
  grid-template-columns: 5.5rem minmax(0, 1fr);
  gap: var(--s-6);
  align-items: baseline;
  padding-block: var(--s-5);
  /* Верхняя граница пунктиром - тем же шагом, что разметка */
  background-image: repeating-linear-gradient(
    to right,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  background-size: 100% var(--rule-w);
  background-repeat: no-repeat;
  background-position: 0 0;
}

/* Последняя строка закрывает список снизу такой же линией */
.facts__row:last-child {
  background-image:
    repeating-linear-gradient(
      to right,
      var(--rule) 0 var(--dash-on),
      transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
    ),
    repeating-linear-gradient(
      to right,
      var(--rule) 0 var(--dash-on),
      transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
    );
  background-size:
    100% var(--rule-w),
    100% var(--rule-w);
  background-position:
    0 0,
    0 100%;
}

.facts__mark {
  /* Пометка на полях: моношрифт, но цвет тут не приглушаем до конца - это данные,
     а не декоративная подпись */
  color: var(--ink-soft);
  padding-block-start: 0.35rem;
}

.facts__text {
  font-size: var(--fs-body);
  line-height: 1.6;
}

@media (max-width: 700px) {
  .facts__row {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-2);
    padding-block: var(--s-4);
  }

  .facts__mark {
    padding-block-start: 0;
  }
}
</style>
