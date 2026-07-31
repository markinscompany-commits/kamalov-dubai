<!--
  Первый экран.

  Обязательные элементы (бриф + договор, п. 1.3): имя врача, специализация, фото,
  краткое описание опыта, кнопка «Записаться на консультацию», кнопка WhatsApp.

  Композиция: экран ровно пополам. Слева чернильная половина со светлым текстом,
  справа фотография на светлом фоне. Граница чёткая.

  Разметка — сквозная сетка сайта (GridLines): вертикали стоят на тех же долях экрана,
  что и в остальных блоках, поэтому при прокрутке читаются как одна непрерывная сетка.
  Рисуется дважды: светлой на тёмной половине, тёмной на светлой.

  Все формулировки — факты. Ни одной превосходной степени и ни одного обещания
  результата: см. compliance/content-rules.md.
-->
<script setup lang="ts">
// TODO: подставить реальный номер клиники, когда клиника его передаст
const whatsapp = 'https://wa.me/79285030807'

// Горизонтали первого экрана: отбивают верх и низ блока
const horizontals = ['27%', '90%']

// На GitHub Pages сайт лежит в подпапке, поэтому путь к картинке собираем через baseURL
const base = useRuntimeConfig().app.baseURL
</script>

<template>
  <section id="top" class="hero">
    <!--
      Сетка лежит ПОД фотографией: линии идут через весь экран, но там, где стоит снимок,
      он их закрывает. Поэтому слой один и обрезать его не нужно — раньше была вторая,
      светлая копия поверх снимка, и она же обрывала сетку над фотографией на телефоне.
    -->
    <div class="hero__rules" aria-hidden="true">
      <GridLines :horizontals="horizontals" :delay="600" />
    </div>

    <!--
      Два кадра одного снимка, а не один на все случаи: на десктопе фотография стоит
      вертикальной половиной, на телефоне — горизонтальной полосой сверху. Кадрируем
      заранее (tools/crop-portrait.ps1), а не подгоняем в CSS.
    -->
    <div class="hero__photo">
      <picture>
        <source
          media="(max-width: 900px)"
          :srcset="`${base}media/doctor-portrait-wide.jpg`"
          width="1200"
          height="1200"
        />
        <img
          :src="`${base}media/doctor-portrait.jpg`"
          alt="Эльдар Камалов, пластический хирург"
          width="1400"
          height="1707"
          fetchpriority="high"
        />
      </picture>
    </div>

    <div class="page hero__inner">
      <p class="mono hero__eyebrow rise" style="--i: 0">[01] Дубай · Dubai London Hospital</p>

      <div class="hero__text">
        <h1 class="hero__title rise" style="--i: 1">Эльдар Камалов</h1>

        <!-- На десктопе «ринопласт» отдельной строкой, на телефоне — в одну строку.
             Через display, а не через <br>: иначе на телефоне пропадает пробел. -->
        <p class="hero__spec rise" style="--i: 2">
          пластический хирург,
          <em class="hero__spec-second">ринопласт</em>
        </p>

        <p class="hero__creds rise" style="--i: 3">
          Кандидат медицинских наук, 30 лет практики,<br />
          член Европейского общества ринопластов
        </p>

        <div class="hero__actions rise" style="--i: 4">
          <MarkAction href="#booking">
            <span class="hero__cta-long">Записаться на консультацию</span>
            <span class="hero__cta-short">Консультация</span>
          </MarkAction>
          <MarkAction variant="ghost" :href="whatsapp">WhatsApp</MarkAction>
        </div>
      </div>
    </div>

    <!--
      Подсказка лежит на фотографии и вынесена прямым потомком секции: смешивание
      видит фон только внутри своего контекста наложения, а его задаёт .hero.
      Режим «разница» сам инвертирует её под любым пикселем.
    -->
    <p class="mono hero__scroll blend-invert" aria-hidden="true">Прокрутите ↓</p>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  block-size: 100svh;
  min-block-size: 34rem;
  overflow: hidden;
  /* Замыкаем смешивание на секции */
  isolation: isolate;
  /* Слева чернильная половина, справа поле под фотографию */
  background: linear-gradient(
    to right,
    var(--ink) 0 var(--photo-start),
    #efe7e2 var(--photo-start) 100%
  );
}

/* --- Сетка: один слой под фотографией --- */

.hero__rules {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  /* Линии светлые: видны они только на чернильной части, остальное закрывает снимок */
  --rule: color-mix(in srgb, var(--paper) 30%, transparent);
  --rule-faint: color-mix(in srgb, var(--paper) 17%, transparent);
}

/* --- Фотография: ровно правая половина, край чёткий --- */

.hero__photo {
  position: absolute;
  z-index: 1;
  inset-block: 0;
  inset-inline-end: 0;
  inline-size: calc(100% - var(--photo-start));
  /* Подложка в тон фона кадра: пока картинка грузится, половина не мигает */
  background: #efe7e2;
}

.hero__photo picture,
.hero__photo img {
  display: block;
  inline-size: 100%;
  block-size: 100%;
}

.hero__photo img {
  object-fit: cover;
  /* Кадр обрезан заранее почти под пропорцию половины, поэтому подрезается чуть-чуть.
     Якорь у верха: на широких и низких окнах лишнее срезается снизу, где и так уходят
     руки, а голова остаётся целиком. */
  object-position: 50% 20%;
  filter: saturate(0.92) contrast(1.02);
}

/* --- Содержимое --- */

.hero__inner {
  position: relative;
  z-index: 3;
  block-size: 100%;
  min-inline-size: 0;
  display: grid;
  align-content: center;
  padding-block-start: var(--header-h);
  /* Текст лежит на чернильной половине */
  color: var(--paper);
}

.hero__eyebrow {
  margin: 0;
  margin-block-end: var(--s-6);
  color: color-mix(in srgb, var(--paper) 62%, transparent);
}

.hero__text {
  min-inline-size: 0;
  max-inline-size: min(34rem, 44%);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: clamp(var(--s-3), 1.6vh, 1.25rem);
}

.hero__title {
  font-size: var(--fs-display);
  line-height: 0.95;
}

.hero__spec {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: 1.12;
  color: color-mix(in srgb, var(--paper) 82%, transparent);
}

/* Курсивом, но без цвета: сливовый на чернильном фоне не читается */
.hero__spec em {
  font-style: italic;
  color: var(--paper);
}

.hero__spec-second {
  display: block;
}

/* Регалии — тот же кегль, что абзац про консультацию во втором блоке */
.hero__creds {
  inline-size: 100%;
  font-size: var(--fs-body);
  line-height: 1.55;
  color: color-mix(in srgb, var(--paper) 68%, transparent);
  max-inline-size: min(46ch, 100%);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-4);
  margin-block-start: var(--s-4);
}

.hero__cta-short {
  display: none;
}

/* Кнопки стоят на тёмном — заливка и линии становятся светлыми */
.hero__actions :deep(.action) {
  --action-fill: var(--paper);
  --action-fill-hover: var(--plum-light);
  --action-on-fill: var(--ink);
  --action-line: var(--paper);
}

/* --- Подсказка о прокрутке --- */

.hero__scroll {
  position: absolute;
  z-index: 4;
  inset-block-end: var(--s-8);
  inset-inline-end: var(--page-pad);
  margin: 0;
}

/* --- Появление --- */

.rise {
  animation: rise var(--dur-slow) var(--ease-out) calc(110ms * var(--i, 0)) both;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* --- Низкие окна: экран обязан оставаться целым --- */

@media (max-height: 820px) {
  .hero__title {
    font-size: clamp(2.25rem, 4.2vw, 3.5rem);
  }

  .hero__spec {
    font-size: clamp(1.25rem, 2vw, 1.625rem);
  }
}

/* --- Планшеты и телефоны --- */

@media (max-width: 900px) {
  .hero {
    --photo-start: 0%;
    /* Полоса под подпись, потом фотография, потом текст */
    --hero-caption: 2.25rem;
    --hero-photo-h: 53svh;
    background: var(--ink);
  }

  /* Подпись переезжает НАД фотографию, под шапку.
     Отступ по краям — тот же, что у всей страницы: абсолютное позиционирование
     считается от padding-box, поэтому inset-inline: 0 прижал бы её к самому краю. */
  .hero__eyebrow {
    position: absolute;
    inset-block-start: calc(var(--header-h) - 0.25rem);
    inset-inline: var(--page-pad);
    margin: 0;
  }

  .hero__photo {
    inline-size: 100%;
    inset-block-start: calc(var(--header-h) + var(--hero-caption));
    inset-block-end: auto;
    block-size: var(--hero-photo-h);
  }

  .hero__photo img {
    /* Почти квадратный кадр. Тот же якорь у верха: лишнее срезается снизу,
       голова не обрезается ни на одной высоте экрана. */
    object-position: 50% 18%;
  }

  .hero__inner {
    align-content: start;
    padding-block-start: calc(
      var(--header-h) + var(--hero-caption) + var(--hero-photo-h) + var(--s-6)
    );
  }

  .hero__text {
    max-inline-size: 100%;
    gap: var(--s-3);
  }

  .hero__title {
    font-size: clamp(1.875rem, 8.2vw, 2.5rem);
  }

  /* На телефоне специализация идёт одной строкой и крупнее */
  .hero__spec-second {
    display: inline;
  }

  .hero__spec {
    font-size: clamp(1.125rem, 5.2vw, 1.5rem);
  }

  .hero__creds {
    font-size: 0.9375rem;
  }

  /* Кнопки в строку: WhatsApp встаёт справа от записи, а не под ней */
  .hero__actions {
    inline-size: 100%;
    flex-wrap: nowrap;
    gap: var(--s-3);
    margin-block-start: var(--s-3);
  }

  .hero__actions :deep(.action) {
    flex: 1 1 0;
    min-inline-size: 0;
    padding-inline: var(--s-3);
  }

  .hero__cta-long {
    display: none;
  }

  .hero__cta-short {
    display: inline;
  }

  .hero__scroll {
    display: none;
  }
}

/* Невысокие телефоны (например 360×640): при полной высоте полосы кнопки уезжали
   за нижний край экрана — ужимаем фотографию и заголовок */
@media (max-width: 900px) and (max-height: 720px) {
  .hero {
    --hero-photo-h: 40svh;
    --hero-caption: 2rem;
  }

  .hero__title {
    font-size: clamp(1.625rem, 7vw, 2rem);
  }

  .hero__spec {
    font-size: 1rem;
  }

  .hero__creds {
    font-size: 0.875rem;
  }
}
</style>
