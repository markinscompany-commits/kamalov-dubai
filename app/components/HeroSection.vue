<!--
  Первый экран.

  Обязательные элементы (бриф + договор, п. 1.3): имя врача, специализация, фото,
  краткое описание опыта, кнопка «Записаться на консультацию», кнопка WhatsApp.

  Композиция: экран ровно пополам. Слева — тёплая бумага и текст, справа — фотография
  во всю высоту на белом фоне. Граница чёткая, без растворения: половины контрастируют.
  Разметка проходит поверх снимка.

  Все формулировки — факты. Ни одной превосходной степени и ни одного обещания
  результата: см. compliance/content-rules.md.
-->
<script setup lang="ts">
const services = [
  { label: 'Ринопластика', href: '#rhinoplasty' },
  { label: 'Септопластика', href: '#septoplasty' },
]

/**
 * Разметка рисуется двумя одинаковыми слоями: тёмный лежит под фотографией и виден
 * на бумаге, светлый лежит поверх фотографии и виден только на ней. Линии выглядят
 * непрерывными и читаются и на светлом, и на тёмном.
 */
const rules = [
  { orientation: 'v' as const, pos: '34%', delay: 500 },
  { orientation: 'v' as const, pos: '68%', delay: 650, faint: true },
  { orientation: 'v' as const, pos: '86%', delay: 780, faint: true },
  { orientation: 'h' as const, pos: '26%', delay: 850, faint: true },
  { orientation: 'h' as const, pos: '78%', delay: 980, faint: true },
]

// TODO: подставить реальный номер клиники, когда клиника его передаст
const whatsapp = 'https://wa.me/79285030807'

// На GitHub Pages сайт лежит в подпапке, поэтому путь к картинке собираем через baseURL
const base = useRuntimeConfig().app.baseURL
</script>

<template>
  <section id="top" class="hero">
    <!-- Тёмная разметка: под фотографией, видна на бумаге -->
    <div class="hero__rules hero__rules--ink" aria-hidden="true">
      <DashedRule v-for="(r, i) in rules" :key="`ink-${i}`" v-bind="r" />
      <span class="hero__node" />
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

    <!-- Светлая разметка: поверх фотографии, обрезана по её половине -->
    <div class="hero__rules hero__rules--light" aria-hidden="true">
      <DashedRule v-for="(r, i) in rules" :key="`light-${i}`" v-bind="r" />
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
          Кандидат медицинских наук, 30 лет практики. Лицензия Управления здравоохранения
          Дубая, член Европейского общества ринопластов.
        </p>

        <ul class="hero__services rise" style="--i: 4">
          <li v-for="service in services" :key="service.href" class="hero__service">
            <DashedRule orientation="h" pos="0" :delay="1050" faint />
            <a class="hero__service-link" :href="service.href">
              <span class="hero__service-label">{{ service.label }}</span>
              <span class="mono hero__service-arrow" aria-hidden="true">↓</span>
            </a>
          </li>
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
      Режим «разница» сам инвертирует подсказку под любым пикселем — на светлом фоне
      она тёмная, на чёрной водолазке светлая.
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
  /* Замыкаем смешивание на секции: .blend-invert внутри должен видеть фотографию
     и фон половин, но не должен доставать до остальной страницы */
  isolation: isolate;
  /* Левая половина чуть плотнее по тону — так она отделяется от белого поля снимка */
  background: linear-gradient(
    to right,
    var(--paper-deep) 0 var(--photo-start),
    var(--paper-raised) var(--photo-start) 100%
  );
}

/* --- Разметка --- */

.hero__rules {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero__rules--ink {
  z-index: 0;
}

.hero__rules--light {
  z-index: 2;
  /* Линии этого слоя светлые и живут только на половине со снимком */
  --rule: color-mix(in srgb, var(--paper) 70%, transparent);
  --rule-faint: color-mix(in srgb, var(--paper) 42%, transparent);
  /* Тёмная кромка под светлой линией: так линия читается и на тёмном пиджаке,
     и на белом фоне снимка */
  filter: drop-shadow(0 1px 0 color-mix(in srgb, var(--ink) 30%, transparent));
  clip-path: inset(0 0 0 var(--photo-start));
}

/* Узел на пересечении — маркер измерения. Их должно быть мало. */
.hero__node {
  position: absolute;
  inline-size: 9px;
  block-size: 9px;
  inset-inline-start: calc(34% - 4px);
  inset-block-start: calc(26% - 4px);
  opacity: 0;
  animation: node-in var(--dur-base) var(--ease-out) 1400ms forwards;
  background:
    linear-gradient(var(--rule), var(--rule)) center / 100% 1px no-repeat,
    linear-gradient(var(--rule), var(--rule)) center / 1px 100% no-repeat;
}

@keyframes node-in {
  to {
    opacity: 1;
  }
}

/* --- Фотография: ровно правая половина, без растворения краёв --- */

.hero__photo {
  position: absolute;
  z-index: 1;
  inset-block: 0;
  inset-inline-end: 0;
  inline-size: calc(100% - var(--photo-start));
  /* Подложка в тон фона кадра: пока картинка грузится, половина не мигает белым */
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
  /* Кадр уже обрезан под пропорцию половины, поэтому подрезается он совсем чуть-чуть.
     Смещение вверх — на случай широких и низких окон, чтобы голова не ушла за край. */
  object-position: 50% 28%;
  /* Лёгкая рука: снимок уже снят в нужной температуре, только чуть приглушаем */
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
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: clamp(var(--s-3), 1.5vh, var(--s-5, 1.25rem));
  padding-block: var(--s-8);
}

.hero__eyebrow {
  margin: 0;
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
  color: var(--ink-soft);
}

.hero__spec em {
  font-style: italic;
  color: var(--plum);
}

/* Регалии — тот же кегль, что абзац про консультацию во втором блоке */
.hero__creds {
  inline-size: 100%;
  font-size: var(--fs-body);
  line-height: 1.55;
  color: var(--ink-soft);
  max-inline-size: min(44ch, 100%);
}

/* --- Услуги: два крупных пункта --- */

.hero__services {
  margin: 0;
  padding: 0;
  list-style: none;
  margin-block-start: var(--s-2);
}

.hero__service {
  position: relative;
}

.hero__service-link {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--s-4);
  padding-block: clamp(var(--s-2), 1.2vh, var(--s-4));
  font-family: var(--font-display);
  font-weight: 300;
  font-size: var(--fs-service);
  line-height: 1.15;
  transition: color var(--dur-fast) var(--ease-out);
}

.hero__service-arrow {
  color: var(--ink-faint);
  transform: rotate(-90deg);
  transition:
    color var(--dur-fast) var(--ease-out),
    transform var(--dur-base) var(--ease-out);
}

.hero__service-link:hover {
  color: var(--plum-deep);
}

.hero__service-link:hover .hero__service-arrow {
  color: var(--plum);
  transform: rotate(0deg);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-4);
  margin-block-start: var(--s-4);
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

  .hero__service-link {
    font-size: clamp(1.25rem, 2vw, 1.75rem);
  }
}

/* --- Планшеты и телефоны: фотография сверху во всю ширину --- */

@media (max-width: 900px) {
  .hero {
    --photo-start: 0%;
    background: var(--paper-deep);
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

  .hero__rules--light {
    clip-path: inset(0 0 62% 0);
  }

  .hero__inner {
    padding-block-start: calc(38svh + var(--s-3));
  }

  .hero__text {
    max-inline-size: 100%;
    align-self: start;
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
    margin-block-start: var(--s-1);
  }

  .hero__service-link {
    font-size: clamp(1.125rem, 5.4vw, 1.5rem);
    padding-block: var(--s-2);
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

  .hero__node {
    display: none;
  }
}
</style>
