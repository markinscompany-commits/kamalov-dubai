<!--
  Шапка. Закреплена сверху всегда, у неё два состояния:

  · вверху страницы — прозрачная, поверх первого экрана: логотип, разделы, переключатель языка;
  · после прокрутки — на бумажной подложке с пунктирной чертой снизу: логотип, «Записаться»,
    WhatsApp и бургер, в который уезжают разделы.

  Логотип латиницей (DR. KAMALOV), чтобы не повторять «Эльдар Камалов» рядом с заголовком
  первого экрана.
-->
<script setup lang="ts">
const links = [
  { label: 'О докторе', href: '#doctor' },
  { label: 'Ринопластика', href: '#rhinoplasty' },
  { label: 'Септопластика', href: '#septoplasty' },
  { label: 'Контакты', href: '#contacts' },
]

// TODO: подставить реальный номер клиники, когда клиника его передаст
const whatsapp = 'https://wa.me/79285030807'

const scrolled = ref(false)
const menuOpen = ref(false)

let frame = 0

function measure() {
  scrolled.value = window.scrollY > 80
}

function onScroll() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(measure)
}

onMounted(() => {
  measure()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': scrolled, 'header--menu': menuOpen }">
    <div class="header__bg" aria-hidden="true" />
    <DashedRule v-if="scrolled" class="header__rule" orientation="h" pos="100%" />

    <div class="page header__inner">
      <a class="header__logo" href="#top" aria-label="Доктор Камалов — наверх">
        <span class="header__logo-mark">Dr.</span>
        <span class="header__logo-name">Kamalov</span>
      </a>

      <!-- Верхнее состояние: разделы строкой -->
      <nav class="header__nav mono" aria-label="Разделы страницы">
        <a v-for="item in links" :key="item.href" class="header__link" :href="item.href">
          {{ item.label }}
        </a>
      </nav>

      <!--
        Автоподстройку цвета под фон здесь применить нельзя: закреплённая шапка
        (position: fixed) заводит собственный контекст наложения, и режим «разница»
        внутри неё видит только саму шапку, а не страницу под ней. Проверено замером.
        Это и не нужно: вверху страницы под шапкой всегда светлое поле — слева бумага,
        справа фон снимка, — а после прокрутки у неё появляется своя подложка.
        Инверсия живёт там, где действительно работает: на подсказке внутри первого экрана.
      -->
      <div class="header__side">
        <!--
          Переключатель языка и кнопки лежат в одной ячейке сетки друг поверх друга.
          Так ширина шапки не меняется при прокрутке — состояния сменяются без скачка,
          и невидимое состояние не занимает лишнего места на узком экране.
        -->
        <div class="header__swap">
          <div class="header__lang mono">
            <button class="header__lang-btn header__lang-btn--on" type="button" aria-current="true">
              Ru
            </button>
            <span class="header__lang-sep" data-muted aria-hidden="true">/</span>
            <button class="header__lang-btn" data-muted type="button">En</button>
          </div>

          <!-- Состояние после прокрутки: действия -->
          <div class="header__actions">
            <MarkAction class="header__cta" href="#booking">
              <span class="header__cta-long">Записаться на консультацию</span>
              <span class="header__cta-short">Записаться</span>
            </MarkAction>

            <MarkAction variant="ghost" :href="whatsapp">WhatsApp</MarkAction>
          </div>
        </div>

        <button
          class="header__burger"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="nav-overlay"
          :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
          @click="menuOpen = !menuOpen"
        >
          <span class="header__burger-box" aria-hidden="true">
            <span class="header__burger-line" />
            <span class="header__burger-line" />
          </span>
        </button>
      </div>
    </div>

    <NavOverlay id="nav-overlay" :open="menuOpen" :links="links" @close="menuOpen = false" />
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: 100;
}

/* Подложка отдельным слоем: так её можно проявлять, не трогая содержимое */
.header__bg {
  position: absolute;
  inset: 0;
  /* 92%, а не меньше: шапка проезжает над тёмной частью снимка, и контраст
     логотипа с бургером важнее полупрозрачности */
  background: color-mix(in srgb, var(--paper) 92%, transparent);
  backdrop-filter: blur(14px) saturate(1.1);
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-out);
}

.header--scrolled .header__bg {
  opacity: 1;
}

/* Пока меню открыто, подложка не нужна — под ней уже сплошной фон меню */
.header--menu .header__bg {
  opacity: 0;
}

.header__rule {
  z-index: 1;
}

.header__inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-6);
  block-size: var(--header-h);
  transition: block-size var(--dur-base) var(--ease-out);
}

.header--scrolled .header__inner {
  block-size: var(--header-h-scrolled);
}

/* --- Логотип --- */

.header__logo {
  flex: none;
  display: inline-flex;
  align-items: baseline;
  gap: 0.32em;
  font-family: var(--font-display);
  font-weight: 300;
  font-size: 1.5rem;
  line-height: 1;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  transition: color var(--dur-fast) var(--ease-out);
}

.header__logo-mark {
  font-size: 0.62em;
  letter-spacing: 0.14em;
  color: var(--ink-soft);
}

.header__logo-name {
  letter-spacing: 0.08em;
}

.header__logo:hover {
  color: var(--plum-deep);
}

/* --- Разделы строкой (только вверху страницы) --- */

.header__nav {
  display: flex;
  gap: var(--s-8);
  transition: opacity var(--dur-fast) var(--ease-out);
}

.header--scrolled .header__nav {
  opacity: 0;
  pointer-events: none;
}

.header__link {
  position: relative;
  padding-block-end: 3px;
  color: var(--ink-soft);
  transition: color var(--dur-fast) var(--ease-out);
}

.header__link::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  inset-block-end: 0;
  block-size: 1px;
  background-image: repeating-linear-gradient(
    to right,
    var(--ink) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  clip-path: inset(0 100% 0 0);
  transition: clip-path var(--dur-base) var(--ease-out);
}

.header__link:hover {
  color: var(--ink);
}

.header__link:hover::after {
  clip-path: inset(0 0 0 0);
}

/* --- Правая часть --- */

.header__side {
  flex: none;
  display: flex;
  align-items: center;
  gap: var(--s-4);
}

/* Оба состояния — в одной ячейке, друг поверх друга */
.header__swap {
  display: grid;
  justify-items: end;
  align-items: center;
}

.header__swap > * {
  grid-area: 1 / 1;
}

.header__lang {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  transition: opacity var(--dur-fast) var(--ease-out);
}

.header--scrolled .header__lang {
  opacity: 0;
  pointer-events: none;
}

.header__lang-btn {
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  color: var(--ink-faint);
  transition: color var(--dur-fast) var(--ease-out);
}

.header__lang-btn--on,
.header__lang-btn:hover {
  color: var(--ink);
}

.header__lang-sep {
  color: var(--ink-faint);
}

/* В режиме инверсии собственные цвета детей ломают смешивание — гасим их здесь,
   иерархия внутри держится на прозрачности (data-muted) */
.blend-invert .header__lang-btn,
.blend-invert .header__lang-sep {
  color: inherit;
}

/* Действия появляются только после прокрутки */
.header__actions {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-6px);
  transition:
    opacity var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-out);
}

.header--scrolled .header__actions {
  opacity: 1;
  pointer-events: auto;
  transform: none;
}

.header__actions :deep(.action) {
  padding-block: 0.7rem;
  font-size: 0.66rem;
}

.header__cta-short {
  display: none;
}

/* --- Бургер: две черты, при наведении верхняя укорачивается --- */

.header__burger {
  flex: none;
  display: grid;
  place-items: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  margin-inline-end: -0.6rem;
}

.header__burger-box {
  display: grid;
  gap: 6px;
  inline-size: 22px;
}

.header__burger-line {
  block-size: 1px;
  /* currentColor, а не var(--ink): в режиме инверсии черты должны белеть вместе с текстом */
  background: currentColor;
  transition:
    transform var(--dur-base) var(--ease-out),
    inline-size var(--dur-base) var(--ease-out);
}

.header__burger-line:last-child {
  inline-size: 70%;
  justify-self: start;
}

.header__burger:hover .header__burger-line:last-child {
  inline-size: 100%;
}

/* Открытое меню — черты складываются в крест */
.header--menu .header__burger-line:first-child {
  transform: translateY(3.5px) rotate(13deg);
}

.header--menu .header__burger-line:last-child {
  inline-size: 100%;
  transform: translateY(-3.5px) rotate(-13deg);
}

/* --- Узкие экраны --- */

/* Пока разделы видны строкой, бургер не нужен — он появляется вместе с кнопками */
@media (min-width: 1101px) {
  .header:not(.header--scrolled):not(.header--menu) .header__burger {
    opacity: 0;
    pointer-events: none;
  }

  .header__burger {
    transition: opacity var(--dur-base) var(--ease-out);
  }
}

@media (max-width: 1100px) {
  .header__nav {
    display: none;
  }
}

@media (max-width: 720px) {
  .header__cta-long {
    display: none;
  }

  .header__cta-short {
    display: inline;
  }

  /* WhatsApp и языки живут в меню — в шапке телефона хватает записи и бургера */
  .header__actions :deep(.action--ghost),
  .header__lang {
    display: none;
  }

  .header__side {
    gap: var(--s-2);
  }

  .header__logo {
    font-size: 1.25rem;
  }
}
</style>
