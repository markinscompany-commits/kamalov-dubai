<!--
  Первый экран.

  Обязательные элементы (бриф + договор, п. 1.3): имя врача, специализация, фото,
  краткое описание опыта, кнопка «Записаться на консультацию», кнопка WhatsApp.

  Все формулировки — факты. Ни одной превосходной степени и ни одного обещания
  результата: см. compliance/content-rules.md.
-->
<script setup lang="ts">
// Факты берём с dr-kamalov.com. Никаких «лучший», «ведущий», «уникальный».
const facts = [
  '30 лет практики',
  'Кандидат мед. наук',
  'Лицензия DHA · Дубай',
  'Европейское общество ринопластов',
]

// TODO: подставить реальный номер клиники, когда клиника его передаст
const whatsapp = 'https://wa.me/79285030807'

// На GitHub Pages сайт лежит в подпапке, поэтому пути к картинкам из public/
// собираем через baseURL. Иначе на боевом адресе картинка не найдётся.
const base = useRuntimeConfig().app.baseURL
</script>

<template>
  <section id="top" class="hero">
    <!-- Разметка: пунктирный каркас, на котором держится вся композиция -->
    <div class="hero__rules" aria-hidden="true">
      <DashedRule orientation="v" pos="34%" :delay="500" />
      <DashedRule orientation="v" pos="67%" :delay="650" faint />
      <DashedRule orientation="h" pos="21%" :delay="800" faint />
      <DashedRule orientation="h" pos="82%" :delay="950" faint />
      <span class="hero__node hero__node--a" />
      <span class="hero__node hero__node--b" />
    </div>

    <div class="page hero__inner">
      <SiteHeader />

      <div class="hero__grid">
        <div class="hero__text">
          <p class="mono hero__eyebrow rise" style="--i: 0">
            [01] Дубай · Dubai London Hospital
          </p>

          <h1 class="hero__title rise" style="--i: 1">Эльдар Камалов</h1>

          <p class="hero__spec rise" style="--i: 2">
            пластический хирург, <em>ринопласт</em>
          </p>

          <p class="hero__lead rise" style="--i: 3">
            Кандидат медицинских наук, 30 лет хирургической практики. Ринопластика и
            септопластика: первичные, повторные и реконструктивные операции. Лицензия
            Управления здравоохранения Дубая (DHA).
          </p>

          <div class="hero__actions rise" style="--i: 4">
            <MarkAction href="#booking">Записаться на консультацию</MarkAction>
            <MarkAction variant="ghost" :href="whatsapp">WhatsApp</MarkAction>
          </div>
        </div>

        <figure class="hero__portrait rise" style="--i: 2">
          <div class="hero__frame">
            <img
              :src="`${base}media/doctor-portrait.png`"
              alt="Эльдар Камалов, пластический хирург"
              width="1120"
              height="1120"
              fetchpriority="high"
            />
          </div>
          <figcaption class="mono hero__caption">
            <span>// Эльдар Камалов</span>
            <span>©2026</span>
          </figcaption>
        </figure>
      </div>

      <div class="hero__facts rise" style="--i: 5">
        <DashedRule orientation="h" pos="0" :delay="1100" />
        <ul class="hero__facts-list mono">
          <li v-for="fact in facts" :key="fact">{{ fact }}</li>
        </ul>
      </div>
    </div>

    <!-- Обёртка обязательна: у элемента с writing-mode: vertical-rl логические insets
         считаются от его собственного письма, и inset-inline-end уехал бы вниз, а не вправо -->
    <div class="hero__scroll" aria-hidden="true">
      <p class="mono hero__scroll-text">Прокрутите</p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-block-size: 100svh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.hero__rules {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Узлы на пересечениях линий — маркеры измерений. Их должно быть мало. */
.hero__node {
  position: absolute;
  inline-size: 9px;
  block-size: 9px;
  opacity: 0;
  animation: node-in var(--dur-base) var(--ease-out) 1400ms forwards;
  background:
    linear-gradient(var(--rule), var(--rule)) center / 100% 1px no-repeat,
    linear-gradient(var(--rule), var(--rule)) center / 1px 100% no-repeat;
}

.hero__node--a {
  inset-inline-start: calc(34% - 4px);
  inset-block-start: calc(21% - 4px);
}

.hero__node--b {
  inset-inline-start: calc(67% - 4px);
  inset-block-start: calc(82% - 4px);
}

@keyframes node-in {
  to {
    opacity: 1;
  }
}

.hero__inner {
  position: relative;
  z-index: 1;
  flex: 1;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
}

.hero__grid {
  flex: 1;
  min-inline-size: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: var(--s-12);
  align-items: center;
  padding-block: var(--s-12);
}

/* min-inline-size: 0 обязателен: без него flex- и grid-элементы раздуваются под
   самую длинную строку и утаскивают за собой всю страницу вширь */
.hero__text {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: var(--s-6);
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
  line-height: 1.55;
  color: var(--ink-soft);
  max-inline-size: min(46ch, 100%);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-4);
  margin-block-start: var(--s-2);
}

/* --- Портрет --- */

.hero__portrait {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}

.hero__frame {
  position: relative;
  background: var(--paper);
  aspect-ratio: 4 / 4.4;
  overflow: hidden;
}

.hero__frame img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  object-position: 50% 20%;
  /* Фон снимка — светло-серый и холодный. Поднимаем яркость, чтобы он ушёл почти в белый,
     и умножаем на бумагу: тогда портрет не выглядит наклеенным прямоугольником, а лежит
     на той же странице. Контраст добираем обратно, чтобы лицо не поплыло. */
  mix-blend-mode: multiply;
  filter: grayscale(1) brightness(1.16) contrast(1.12);
}

/* Тёплый сдвиг: снимок должен жить в той же температуре, что и бумага */
.hero__frame::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--clay);
  mix-blend-mode: color;
  opacity: 0.3;
  pointer-events: none;
}

/* Нижний край растворяется в бумаге — портрет не обрывается линейкой */
.hero__frame::before {
  content: '';
  position: absolute;
  inset-inline: 0;
  inset-block-end: 0;
  block-size: 22%;
  z-index: 1;
  background: linear-gradient(to top, var(--paper), transparent);
  pointer-events: none;
}

.hero__caption {
  display: flex;
  justify-content: space-between;
  gap: var(--s-4);
}

/* --- Факты --- */

.hero__facts {
  position: relative;
  padding-block: var(--s-6) var(--s-8);
}

.hero__facts-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-3) var(--s-12);
  margin: 0;
  padding: 0;
  list-style: none;
  padding-block-start: var(--s-6);
}

.hero__scroll {
  position: absolute;
  inset-block-end: var(--s-8);
  inset-inline-end: calc(var(--page-pad) / 2);
  z-index: 1;
}

.hero__scroll-text {
  writing-mode: vertical-rl;
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

/* --- Мобильные --- */

@media (max-width: 900px) {
  .hero__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-8);
    align-items: start;
  }

  .hero__portrait {
    order: -1;
    max-inline-size: 20rem;
  }

  .hero__actions {
    inline-size: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .hero__facts-list {
    gap: var(--s-3) var(--s-6);
  }

  .hero__scroll {
    display: none;
  }

  .hero__node {
    display: none;
  }
}
</style>
