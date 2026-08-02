<!--
  Блок «Как проходит лечение» — шесть шагов от заявки до последнего осмотра.

  Зачем он есть: человек, который выбирает хирурга в чужой стране, должен понимать,
  что с ним будет происходить. На странице этого не было вообще.

  ПОДАЧА. Лента шагов, а не карточки с иконками: карточки в этой нише читаются
  шаблоном и удешевляют (design-system.md, п. 4б — то же правило, что у FactList).
  Каждый шаг — строка сетки «номер · текст · фотография», строки разделены пунктиром
  того же шага, что вся разметка сайта.

  ФОТОГРАФИИ есть не у каждого шага, и это намеренно: сплошной ряд снимков превращает
  ленту в галерею, а пустые ячейки задают тот самый журнальный ритм. Снимки лежат
  в правой колонке и на телефоне уезжают под текст своего шага.

  ⚠️ ФОТОГРАФИИ ВРЕМЕННЫЕ — взяты из открытой галереи Dubai London Hospital, права
  у больницы. Клиника согласовывает использование; откажет — снимаем, блок рассчитан
  работать без них (см. assets-temp/dlh-selected/README.md).
-->
<script setup lang="ts">
const { m } = useLocale()

// На GitHub Pages сайт лежит в подпапке — путь к картинке собираем через baseURL
const base = useRuntimeConfig().app.baseURL

// Номер шага набирается с ведущим нулём: [01], а не [1]. Тот же формат, что
// у подписей разделов на полях — лента должна читаться как часть той же системы.
const pad = (i: number) => String(i + 1).padStart(2, '0')
</script>

<template>
  <PageSection
    id="treatment"
    :label="m.treatment.label"
    tone="deep"
    cross-y="5.5rem"
    :cross-fraction="0.161"
  >
    <SectionTitle :text="m.treatment.title" />

    <p class="treat__lead">{{ m.treatment.lead }}</p>

    <ol class="treat__list">
      <li v-for="(step, i) in m.treatment.steps" :key="i" class="treat__step">
        <!-- Пунктир-разделитель: у первого шага его нет, иначе линия повисает
             сразу под вводным абзацем и читается как подчёркивание -->
        <DashedRule v-if="i" class="treat__rule" />

        <div class="treat__row">
          <p class="mono treat__num" aria-hidden="true">[{{ pad(i) }}]</p>

          <div class="treat__text">
            <h3 class="treat__title">
              <span class="mono treat__step-word">{{ m.treatment.stepWord }} {{ pad(i) }}</span>
              {{ step.title }}
            </h3>
            <p class="treat__body">{{ step.text }}</p>
          </div>

          <figure v-if="step.photo" class="treat__figure">
            <img
              :src="`${base}media/clinic/${step.photo}`"
              :alt="step.photoAlt"
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </li>
    </ol>
  </PageSection>
</template>

<style scoped>
.treat__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(52ch, 100%);
}

.treat__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
  Разделитель — не отступ, а линия, поэтому расстояние держится не через gap.
  DashedRule позиционируется абсолютно, значит ему нужен родитель с position: relative
  и место, куда встать: margin сверху отбивает линию от предыдущего шага, padding —
  от следующего. Величины равны, поэтому линия стоит ровно посередине зазора.
*/
.treat__step {
  position: relative;
}

.treat__step + .treat__step {
  margin-block-start: var(--s-10);
  padding-block-start: var(--s-10);
}

.treat__rule {
  inset-block-start: 0;
}

/*
  Три колонки: номер, текст, фотография. Ширина колонки со снимком задана жёстко,
  а не долей — иначе строки БЕЗ фотографии отдавали бы её место тексту, и левый край
  текста гулял бы от шага к шагу.
*/
.treat__row {
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1fr) 20rem;
  gap: var(--s-6);
  align-items: start;
}

.treat__num {
  margin: 0;
  padding-block-start: 0.35rem;
  color: var(--ink-faint);
}

.treat__text {
  min-inline-size: 0;
}

.treat__title {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0 0 var(--s-3);
  /* Подпись «Шаг 01» стоит НАД названием отдельной строкой */
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
}

/*
  Подпись «Шаг 01» — ЗАПАСНОЙ номер для узкого экрана. На десктопе номер стоит слева
  в поле блока ([01] моношрифтом), и подпись над заголовком была бы прямым повтором.
  На экранах уже 560 px колонка с номером убирается, и тогда подпись включается.
  Кегль задаём явно: внутри заголовка моношрифт иначе наследует его размер.
*/
.treat__step-word {
  display: none;
  font-size: var(--fs-mono);
}

.treat__body {
  font-size: var(--fs-body);
  line-height: 1.65;
  margin: 0;
  max-inline-size: min(54ch, 100%);
}

.treat__figure {
  margin: 0;
  /* Пунктирная рамка вместо сплошной: сплошная выпадает из языка сайта */
  padding: var(--s-2);
  background: var(--paper-raised);
}

.treat__figure img {
  display: block;
  inline-size: 100%;
  block-size: auto;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}

@media (max-width: 900px) {
  /* Фотография уходит под текст своего шага и занимает всю ширину */
  .treat__row {
    grid-template-columns: 3rem minmax(0, 1fr);
    gap: var(--s-4);
  }

  .treat__figure {
    grid-column: 1 / -1;
    margin-block-start: var(--s-2);
  }
}

@media (max-width: 560px) {
  /* Колонка с номером убирается: при 3rem слева текст становится слишком узким.
     Номер не пропадает, а переезжает подписью над названием шага */
  .treat__row {
    grid-template-columns: minmax(0, 1fr);
  }

  .treat__num {
    display: none;
  }

  .treat__step-word {
    display: block;
  }
}
</style>
