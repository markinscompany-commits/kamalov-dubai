<!--
  Первый экран.

  Обязательные элементы (бриф + договор, п. 1.3): имя врача, специализация, фото,
  краткое описание опыта, кнопка «Записаться на консультацию», кнопка WhatsApp.

  Композиция: фотография занимает всю правую половину и уходит под края экрана,
  разметка проходит поверх неё. Слева — текст. Внизу — строка фактов и подсказка
  о прокрутке; экран рассчитан так, чтобы они были видны без прокрутки.

  Все формулировки — факты. Ни одной превосходной степени и ни одного обещания
  результата: см. compliance/content-rules.md.
-->
<script setup lang="ts">
// Регалии живут одной строкой внизу и в подзаголовке не повторяются
const facts = [
  '30 лет практики',
  'Кандидат мед. наук',
  'Лицензия DHA · Дубай',
  'Европейское общество ринопластов',
]

/**
 * Разметка рисуется двумя одинаковыми слоями: тёмный лежит под фотографией и виден
 * на бумаге, светлый лежит поверх фотографии и виден только на ней. Линии выглядят
 * непрерывными и читаются и на светлом, и на тёмном.
 */
const rules = [
  { orientation: 'v' as const, pos: '34%', delay: 500 },
  { orientation: 'v' as const, pos: '67%', delay: 650, faint: true },
  { orientation: 'v' as const, pos: '85%', delay: 780, faint: true },
  { orientation: 'h' as const, pos: '26%', delay: 850, faint: true },
  { orientation: 'h' as const, pos: '76%', delay: 980, faint: true },
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

    <div class="hero__photo">
      <img
        :src="`${base}media/doctor-portrait.png`"
        alt="Эльдар Камалов, пластический хирург"
        width="1120"
        height="1120"
        fetchpriority="high"
      />
    </div>

    <!-- Светлая разметка: поверх фотографии, обрезана по её области -->
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
          пластический хирург, <em>ринопласт</em>
        </p>

        <p class="hero__lead rise" style="--i: 3">
          Ринопластика и септопластика: первичные, повторные и реконструктивные операции.
        </p>

        <div class="hero__actions rise" style="--i: 4">
          <MarkAction href="#booking">Записаться на консультацию</MarkAction>
          <MarkAction variant="ghost" :href="whatsapp">WhatsApp</MarkAction>
        </div>
      </div>

      <div class="hero__bottom rise" style="--i: 5">
        <DashedRule orientation="h" pos="0" :delay="1100" />
        <ul class="hero__facts mono">
          <li v-for="fact in facts" :key="fact">{{ fact }}</li>
        </ul>
        <p class="mono hero__scroll" aria-hidden="true">Прокрутите ↓</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  block-size: 100svh;
  min-block-size: 34rem;
  overflow: hidden;
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
  /* Линии этого слоя светлые и проявляются только там, где лежит фотография */
  --rule: color-mix(in srgb, var(--paper) 68%, transparent);
  --rule-faint: color-mix(in srgb, var(--paper) 40%, transparent);
  /* Тёмная кромка под светлой линией: так линия читается и на тёмном пиджаке,
     и на светлом фоне снимка — иначе на светлых участках она пропадает */
  filter: drop-shadow(0 1px 0 color-mix(in srgb, var(--ink) 26%, transparent));
  mask-image: linear-gradient(
    to right,
    transparent calc(var(--photo-start) + 2%),
    #000 calc(var(--photo-start) + 14%)
  );
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

/* --- Фотография --- */

.hero__photo {
  position: absolute;
  z-index: 1;
  inset-block: 0;
  inset-inline-end: 0;
  inline-size: calc(100% - var(--photo-start));
  /* Левый край растворяется в бумаге, снимок не выглядит вставленным прямоугольником */
  mask-image: linear-gradient(to right, transparent 0, #000 26%);
}

.hero__photo img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  object-position: 58% 20%;
  /* Тёплый приглушённый цвет — снимок должен жить в температуре бумаги.
     Работает и для нынешнего чёрно-белого кадра, и для будущего цветного. */
  filter: saturate(0.82) contrast(1.05) brightness(1.02) sepia(0.2);
}

/* Низ уводим в бумагу, чтобы строка фактов читалась поверх снимка */
.hero__photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--paper) 0, transparent 26%);
  pointer-events: none;
}

/* --- Содержимое --- */

.hero__inner {
  position: relative;
  z-index: 3;
  block-size: 100%;
  min-inline-size: 0;
  display: grid;
  grid-template-rows: 1fr auto;
  padding-block-start: var(--header-h);
}

.hero__text {
  min-inline-size: 0;
  max-inline-size: min(38rem, 46%);
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: clamp(var(--s-3), 1.6vh, var(--s-6));
  padding-block: var(--s-8);
}

.hero__eyebrow {
  margin: 0;
}

.hero__title {
  font-size: var(--fs-display);
  line-height: 0.92;
}

.hero__spec {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: 1.15;
  color: var(--ink-soft);
}

.hero__spec em {
  font-style: italic;
  color: var(--plum);
}

.hero__lead {
  inline-size: 100%;
  font-size: var(--fs-lead);
  line-height: 1.5;
  color: var(--ink-soft);
  max-inline-size: min(38ch, 100%);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-4);
  margin-block-start: var(--s-2);
}

/* --- Нижняя полоса: факты + подсказка --- */

.hero__bottom {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--s-3) var(--s-8);
  padding-block: var(--s-6) var(--s-8);
}

.hero__facts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-3) var(--s-8);
  margin: 0;
  padding: 0;
  list-style: none;
}

.hero__scroll {
  margin: 0;
}

/* --- Появление --- */

.rise {
  animation: rise var(--dur-slow) var(--ease-out) calc(120ms * var(--i, 0)) both;
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

@media (max-height: 760px) {
  .hero__title {
    font-size: clamp(2.5rem, 5vw, 4rem);
  }

  .hero__spec {
    font-size: clamp(1.375rem, 2.2vw, 1.875rem);
  }
}

/* --- Планшеты и телефоны: фотография сверху во всю ширину --- */

@media (max-width: 900px) {
  .hero {
    --photo-start: 0%;
  }

  .hero__photo {
    inline-size: 100%;
    block-size: 54svh;
    inset-block-end: auto;
    /* Снизу растворяется в бумаге, сверху остаётся во всю ширину */
    mask-image: linear-gradient(to bottom, #000 0, #000 52%, transparent 96%);
  }

  .hero__photo img {
    /* Голову не срезаем: на телефоне кадр и так узкий */
    object-position: 54% 6%;
  }

  .hero__photo::after {
    background: linear-gradient(to top, var(--paper) 0, transparent 42%);
  }

  .hero__rules--light {
    mask-image: linear-gradient(to bottom, #000 0, #000 46%, transparent 74%);
  }

  .hero__text {
    max-inline-size: 100%;
    align-self: end;
    gap: var(--s-3);
  }

  .hero__title {
    font-size: clamp(2.25rem, 10vw, 3.25rem);
  }

  .hero__spec {
    font-size: clamp(1.25rem, 5.5vw, 1.75rem);
  }

  .hero__actions {
    inline-size: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: var(--s-3);
  }

  .hero__bottom {
    gap: var(--s-2) var(--s-4);
    padding-block: var(--s-4) var(--s-6);
  }

  .hero__facts {
    gap: var(--s-2) var(--s-4);
  }

  .hero__scroll {
    display: none;
  }

  .hero__node {
    display: none;
  }
}
</style>
