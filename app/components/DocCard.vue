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

  Сам скан открывается по клику В МОДАЛЬНОМ ОКНЕ - тем же просмотрщиком, что
  фотографии госпиталя и кадры «до/после» (правка Марка 07.08). Раньше уходил
  в новую вкладку: человек терял страницу и возвращался кнопкой «назад».
  Открытием управляет DocGrid - он держит ленту и просмотрщик.
-->
<script setup lang="ts">
interface Props {
  /** Имя файла скана в public/media/docs - открывает его DocGrid */
  file: string
  /** Герб организации, путь от public/ */
  logo?: string
  /** Логотип вытянутый по горизонтали - размер считается по другим правилам */
  logoWide?: boolean
  /**
   * Короткая надпись вместо герба.
   * ⚠️ Нужна для документов государственных органов: ST-21 п. 7.2 запрещает
   * использовать название или эмблему госоргана в оформлении без письменного
   * разрешения. Скан документа с гербом внутри показывать можно - это
   * воспроизведение документа; вырезать герб и ставить его значком - уже нельзя.
   */
  mark?: string
  title: string
}

defineProps<Props>()

const base = useRuntimeConfig().app.baseURL

const { m } = useLocale()
</script>

<template>
  <button class="doc brackets" type="button" :aria-label="`${title} - ${m.viewer.openDoc}`">
    <span class="doc__sheet">
      <!-- Лист с загнутым уголком. Обводка, а не заливка: значок должен быть
           нарисован тем же пером, что вся разметка сайта -->
      <svg class="doc__icon" viewBox="0 0 100 124" aria-hidden="true" focusable="false">
        <path class="doc__outline" d="M4 4 H68 L96 32 V120 H4 Z" />
        <path class="doc__outline" d="M68 4 V32 H96" />
      </svg>

      <!-- Надпись вместо герба - для документов госорганов, см. проп mark -->
      <span v-if="mark" class="mono doc__mark" aria-hidden="true">{{ mark }}</span>

      <img
        v-else-if="logo"
        class="doc__logo"
        :class="{ 'doc__logo--wide': logoWide }"
        :src="`${base}${logo}`"
        alt=""
        aria-hidden="true"
      />
    </span>

    <span class="doc__title">{{ title }}</span>
  </button>
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
  /*
    ⚠️ Обязательно. Карточка - это <button>, а браузер по умолчанию центрует
    текст внутри кнопок. `justify-items: start` прижимает к левому краю сам
    БЛОК с названием, но строки внутри него всё равно вставали по центру,
    и это было видно на названиях, которые не влезли в одну строку.
  */
  text-align: start;
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
  /* Тонкая линия, как у всей разметки: жирный контур спорит с гербом внутри
     и выбивается из чертёжной графики сайта */
  stroke-width: 1;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  transition: stroke var(--dur-fast) var(--ease-out);
}

/*
  Герб лежит внутри листа и опущен чуть ниже середины (правка Марка): у листа
  сверху загнутый угол, и по геометрическому центру герб визуально «всплывал».
  Ограничен и по ширине, и по высоте - у гербов разные пропорции, без второго
  предела широкий вылезает за лист.
*/
.doc__logo {
  position: absolute;
  max-inline-size: 62%;
  max-block-size: 62%;
  inline-size: auto;
  block-size: auto;
  object-fit: contain;
  transform: translateY(18%);
}

/*
  Надпись вместо герба. Стоит там же, где стоял бы герб - опущена ниже середины
  листа, потому что сверху у него загнутый угол. Кегль крупнее обычного моно:
  это единственное содержимое листа, и оно должно читаться как знак, а не как
  подпись. Цвет перебиваем: класс .mono задаёт свой, приглушённый.
*/
.doc__mark {
  position: absolute;
  transform: translateY(18%);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  color: var(--ink);
  transition: color var(--dur-fast) var(--ease-out);
}

.doc:hover .doc__mark,
.doc:focus-visible .doc__mark {
  color: var(--blue);
}

/* Широкий логотип остаётся в прежнем размере и по центру: он вытянутый,
   и по общим правилам превратился бы в узкую полосу через весь лист */
.doc__logo--wide {
  max-inline-size: 72%;
  max-block-size: 48%;
  transform: none;
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
