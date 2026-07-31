<!--
  Небольшой блок сразу под первым экраном.
  Нужен, чтобы было видно, как работает заливка текста при прокрутке.
  Текст — про метод, а не про результат: обещать результат нам запрещено.
-->
<template>
  <section class="manifest">
    <!-- Ровно две линии на блок: одна вертикаль, одна горизонталь. Пересечение стоит
         в промежутке между колонкой «[02] Подход» и текстом, выше всего содержимого —
         чтобы линии не шли поверх букв -->
    <GridLines
      class="manifest__grid"
      :verticals="['var(--m-line-x)']"
      :horizontals="['var(--m-line-y)']"
    />

    <div class="page manifest__inner">
      <div class="manifest__side">
        <p class="mono">[02] Подход</p>
      </div>

      <div class="manifest__body">
        <KaraokeText
          text="Хирургия носа - это расчёт. Форма, дыхание, анатомия и срок восстановления связаны между собой, и решения принимаются до операции, а не во время неё."
        />

        <p class="manifest__note">
          На консультации хирург разбирает анатомию, объясняет, какие задачи операция решает, а
          какие - нет, и проговаривает риски. Результат зависит от индивидуальных особенностей и
          не может быть одинаковым у разных людей.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.manifest {
  position: relative;
  padding-block: clamp(6rem, 12vh, 12rem);
  background: var(--paper-deep);

  /* Пересечение разметки — точка, которую отметил Марк на скриншоте блока.
     Вертикаль считается не от ширины экрана, а от колонки текста: сама колонка
     стоит по центру и упирается в --page-max, поэтому доля экрана «уползала» бы
     на текст при других размерах окна. Формула: внешнее поле + отступ страницы +
     16.1% ширины колонки — это как раз пустое место между «[02] Подход» и текстом. */
  --m-line-x: calc(
    (100% - min(100%, var(--page-max))) / 2 + var(--page-pad) +
      (min(100%, var(--page-max)) - 2 * var(--page-pad)) * 0.161
  );
  --m-line-y: 4.5rem;
}

.manifest__grid {
  z-index: 0;
}

.manifest__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 0.25fr) minmax(0, 1fr);
  gap: var(--s-8);
  align-items: start;
}

.manifest__body {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
}

/* Дисклеймер набирается тем же кеглем, что основной текст — требование DHA ST-21 п. 9.6.
   Увести его в мелкий серый нельзя. */
.manifest__note {
  font-size: var(--fs-body);
  color: var(--ink-soft);
  max-inline-size: 54ch;
}

@media (max-width: 900px) {
  .manifest {
    /* Колонок больше нет, текст идёт во всю ширину — вертикаль уводим левее него,
       в поле страницы, иначе она пройдёт прямо по буквам */
    --m-line-x: max(0.8rem, calc(var(--page-pad) - 0.75rem));
    --m-line-y: 3rem;
  }

  .manifest__inner {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-6);
  }
}
</style>
