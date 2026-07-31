<!--
  Первый экран.

  Обязательные элементы (бриф + договор, п. 1.3): имя врача, специализация, фото,
  краткое описание опыта, кнопка «Записаться на консультацию», кнопка WhatsApp.

  Композиция: экран ровно пополам. Слева чернильная половина со светлым текстом,
  справа фотография на светлом фоне. Граница чёткая. Разметка — две горизонтальные
  линии на весь экран: на тёмной половине светлые, на светлой тёмные. Больше линий
  на первом экране нет намеренно, иначе они превращаются в шум.

  Все формулировки — факты. Ни одной превосходной степени и ни одного обещания
  результата: см. compliance/content-rules.md.
-->
<script setup lang="ts">
// Два основных направления. Это не ссылки, а просто подписи: разделы ниже по странице.
const services = ['Ринопластика', 'Септопластика']

// Две линии на весь экран. Каждая рисуется дважды — своим цветом на каждой половине.
const rules = [
  { pos: '27%', delay: 700 },
  { pos: '90%', delay: 900 },
]

// TODO: подставить реальный номер клиники, когда клиника его передаст
const whatsapp = 'https://wa.me/79285030807'

// На GitHub Pages сайт лежит в подпапке, поэтому путь к картинке собираем через baseURL
const base = useRuntimeConfig().app.baseURL
</script>

<template>
  <section id="top" class="hero">
    <!-- Разметка на тёмной половине — светлая -->
    <div class="hero__rules hero__rules--on-dark" aria-hidden="true">
      <DashedRule v-for="(r, i) in rules" :key="`d-${i}`" orientation="h" v-bind="r" />
    </div>

    <!--
      Два кадра одного снимка, а не один на все случаи: на десктопе фотография стоит
      вертикальной половиной, на телефоне — горизонтальной полосой сверху. Кадрируем
      заранее (tools/crop-portrait.ps1), а не подгоняем в CSS — так пропорции честные
      на любом экране, и лишние килобайты не грузятся.
    -->
    <div class="hero__photo">
      <picture>
        <source
          media="(max-width: 900px)"
          :srcset="`${base}media/doctor-portrait-wide.jpg`"
          width="1300"
          height="976"
        />
        <img
          :src="`${base}media/doctor-portrait.jpg`"
          alt="Эльдар Камалов, пластический хирург"
          width="1400"
          height="1711"
          fetchpriority="high"
        />
      </picture>
    </div>

    <!-- Та же разметка на светлой половине — тёмная -->
    <div class="hero__rules hero__rules--on-light" aria-hidden="true">
      <DashedRule v-for="(r, i) in rules" :key="`l-${i}`" orientation="h" v-bind="r" />
    </div>

    <div class="page hero__inner">
      <div class="hero__text">
        <p class="mono hero__eyebrow rise" style="--i: 0">
          [01] Дубай · Dubai London Hospital
        </p>

        <h1 class="hero__title rise" style="--i: 1">Эльдар Камалов</h1>

        <p class="hero__spec rise" style="--i: 2">
          пластический хирург,<br />
          <em>ринопласт</em>
        </p>

        <p class="hero__creds rise" style="--i: 3">
          Кандидат медицинских наук, 30 лет практики, член Европейского общества ринопластов.
        </p>

        <ul class="hero__services rise" style="--i: 4">
          <li v-for="service in services" :key="service">{{ service }}</li>
        </ul>

        <div class="hero__actions rise" style="--i: 5">
          <MarkAction href="#booking">Записаться на консультацию</MarkAction>
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

/* --- Разметка: по одной паре линий на половину --- */

.hero__rules {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero__rules--on-dark {
  z-index: 0;
  --rule: color-mix(in srgb, var(--paper) 26%, transparent);
  clip-path: inset(0 calc(100% - var(--photo-start)) 0 0);
}

.hero__rules--on-light {
  z-index: 2;
  --rule: color-mix(in srgb, var(--ink) 24%, transparent);
  clip-path: inset(0 0 0 var(--photo-start));
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
  /* Кадр уже обрезан под пропорцию половины, подрезается он совсем чуть-чуть.
     Смещение вверх — на случай широких и низких окон, чтобы голова не ушла за край. */
  object-position: 50% 28%;
  filter: saturate(0.92) contrast(1.02);
}

/* --- Содержимое --- */

.hero__inner {
  position: relative;
  z-index: 3;
  block-size: 100%;
  min-inline-size: 0;
  display: grid;
  align-items: center;
  padding-block-start: var(--header-h);
}

.hero__text {
  min-inline-size: 0;
  max-inline-size: min(34rem, 44%);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: clamp(var(--s-3), 1.5vh, 1.25rem);
  padding-block: var(--s-8);
  /* Текст лежит на чернильной половине */
  color: var(--paper);
}

.hero__eyebrow {
  margin: 0;
  color: color-mix(in srgb, var(--paper) 58%, transparent);
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
  color: color-mix(in srgb, var(--paper) 78%, transparent);
}

.hero__spec em {
  font-style: italic;
  /* Обычный сливовый на чернильном фоне сливается — берём осветлённый */
  color: var(--plum-light);
}

/* Регалии — тот же кегль, что абзац про консультацию во втором блоке */
.hero__creds {
  inline-size: 100%;
  font-size: var(--fs-body);
  line-height: 1.55;
  color: color-mix(in srgb, var(--paper) 66%, transparent);
  max-inline-size: min(44ch, 100%);
}

/* --- Два направления: просто подписи, не ссылки --- */

.hero__services {
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
  margin: 0;
  margin-block-start: var(--s-2);
  padding: 0;
  list-style: none;
  font-family: var(--font-display);
  font-weight: 300;
  font-size: var(--fs-service);
  line-height: 1.2;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-4);
  margin-block-start: var(--s-4);
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

  .hero__services {
    font-size: clamp(1.25rem, 2vw, 1.75rem);
  }
}

/* --- Планшеты и телефоны: фотография полосой сверху, всё остальное на тёмном --- */

@media (max-width: 900px) {
  .hero {
    --photo-start: 0%;
    background: var(--ink);
  }

  .hero__photo {
    inline-size: 100%;
    block-size: 38svh;
    inset-block-end: auto;
  }

  .hero__photo img {
    /* На телефоне подставляется горизонтальный кадр — голова и плечи */
    object-position: 50% 24%;
  }

  .hero__rules--on-dark {
    clip-path: inset(38svh 0 0 0);
  }

  .hero__rules--on-light {
    clip-path: inset(0 0 calc(100% - 38svh) 0);
  }

  .hero__inner {
    padding-block-start: calc(38svh + var(--s-3));
  }

  .hero__text {
    max-inline-size: 100%;
    gap: var(--s-2);
    padding-block: 0 var(--s-3);
  }

  .hero__title {
    font-size: clamp(1.875rem, 8.2vw, 2.5rem);
  }

  .hero__spec {
    font-size: clamp(1.0625rem, 4.4vw, 1.375rem);
  }

  .hero__creds {
    font-size: 0.9375rem;
  }

  .hero__services {
    font-size: clamp(1.25rem, 5.8vw, 1.625rem);
    margin-block-start: var(--s-1);
  }

  .hero__actions {
    inline-size: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: var(--s-3);
    margin-block-start: var(--s-2);
  }

  .hero__scroll {
    display: none;
  }
}
</style>
