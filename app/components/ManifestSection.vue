<!--
  Небольшой блок сразу под первым экраном.
  Нужен, чтобы было видно, как работает заливка текста при прокрутке.
  Текст — про метод, а не про результат: обещать результат нам запрещено.
-->
<template>
  <section class="manifest">
    <!-- Та же сквозная сетка, что и в первом экране: вертикали стоят на тех же долях
         ширины, поэтому при прокрутке они продолжают линии сверху -->
    <GridLines class="manifest__grid" :horizontals="['0%', '100%']" />

    <div class="page manifest__inner">
      <div class="manifest__side">
        <p class="mono">[02] Подход</p>
      </div>

      <div class="manifest__body">
        <KaraokeText
          text="Хирургия носа — это расчёт. Форма, дыхание, анатомия и срок восстановления связаны между собой, и решения принимаются до операции, а не во время неё."
        />

        <p class="manifest__note">
          На консультации хирург разбирает анатомию, объясняет, какие задачи операция решает, а
          какие — нет, и проговаривает риски. Результат зависит от индивидуальных особенностей и
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
  .manifest__inner {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-6);
  }
}
</style>
