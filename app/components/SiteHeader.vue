<!--
  Шапка. Закреплена сверху всегда, у неё два состояния:

  · вверху страницы — прозрачная, поверх первого экрана. Первый экран разделён пополам:
    слева чернильная половина, справа фотография на светлом. Поэтому шапка тоже поделена
    пополам ровно по той же границе — левая группа светлая, правая тёмная. Ни один элемент
    границу не пересекает, поэтому цвет каждого известен заранее и подбирать его на ходу
    не нужно;
  · после прокрутки — на бумажной подложке с пунктирной чертой снизу: логотип, разделы
    услуг, «Записаться», WhatsApp и бургер.

  Логотип латиницей, чтобы не повторять «Эльдар Камалов» рядом с заголовком первого экрана.
-->
<script setup lang="ts">
// service: true — пункт, который остаётся в шапке после прокрутки
const links = [
  { label: 'О докторе', href: '#doctor', service: false },
  { label: 'Ринопластика', href: '#rhinoplasty', service: true },
  { label: 'Септопластика', href: '#septoplasty', service: true },
  { label: 'Контакты', href: '#contacts', service: false },
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
      <!-- Левая группа: лежит на чернильной половине, поэтому светлая -->
      <div class="header__left">
        <a class="header__logo brackets" href="#top" aria-label="Доктор Камалов — наверх">
          <span class="header__logo-mark">dr.</span>
          <span class="header__logo-name">Kamalov</span>
        </a>

        <!--
          Один и тот же список в обоих состояниях. После прокрутки «О докторе» и «Контакты»
          гаснут, но МЕСТО за собой сохраняют — поэтому «Ринопластика» и «Септопластика»
          остаются ровно там же, где стояли до прокрутки, и не съезжают влево.
        -->
        <nav class="header__nav mono" aria-label="Разделы страницы">
          <a
            v-for="item in links"
            :key="item.href"
            class="header__link"
            :class="{ 'header__link--secondary': !item.service }"
            :href="item.href"
          >
            {{ item.label }}
          </a>
        </nav>
      </div>

      <!-- Правая группа: лежит на светлой половине со снимком, поэтому тёмная -->
      <div class="header__right">
        <!--
          Переключатель языка и кнопки лежат в одной ячейке сетки друг поверх друга.
          Так ширина шапки не меняется при прокрутке — состояния сменяются без скачка,
          и невидимое состояние не занимает лишнего места на узком экране.
        -->
        <div class="header__swap">
          <div class="header__lang mono">
            <button class="header__lang-btn" data-muted type="button">En</button>
            <span class="header__lang-sep" data-muted aria-hidden="true">/</span>
            <button class="header__lang-btn header__lang-btn--on" type="button" aria-current="true">
              Ru
            </button>
          </div>

          <div class="header__actions">
            <MarkAction class="header__cta" href="#booking">
              <span class="header__cta-long">Записаться на консультацию</span>
              <span class="header__cta-short">Консультация</span>
            </MarkAction>

            <MarkAction variant="ghost" :href="whatsapp">WhatsApp</MarkAction>
          </div>
        </div>

        <button
          class="header__burger"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="nav-overlay"
          aria-label="Открыть меню"
          @click="menuOpen = true"
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
  /* 92%, а не меньше: контраст логотипа с бургером важнее полупрозрачности */
  background: color-mix(in srgb, var(--paper) 92%, transparent);
  backdrop-filter: blur(14px) saturate(1.1);
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-out);
}

.header--scrolled .header__bg {
  opacity: 1;
}

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

/* --- Половины --- */

.header__left {
  display: flex;
  align-items: center;
  gap: clamp(var(--s-6), 3vw, var(--s-12));
  min-inline-size: 0;
  /* Вверху страницы левая группа лежит на чернильной половине */
  color: var(--paper);
  transition: color var(--dur-base) var(--ease-out);
}

.header__right {
  flex: none;
  display: flex;
  align-items: center;
  gap: var(--s-4);
  /* Правая группа лежит на светлой половине со снимком */
  color: var(--ink);
}

/* После прокрутки под шапкой сплошная бумага — всё становится чернильным */
.header--scrolled .header__left,
.header--menu .header__left {
  color: var(--ink);
}

/* --- Логотип --- */

.header__logo {
  flex: none;
  display: inline-flex;
  align-items: baseline;
  gap: 0.24em;
  font-family: var(--font-display);
  font-weight: 300;
  font-size: 1.5rem;
  line-height: 1;
  letter-spacing: 0.04em;
  /* Те же угловые скобки, что у кнопки WhatsApp — приём один на весь сайт */
  --brackets-inset: -0.55rem -0.7rem;
}

.header__logo-mark,
.header__logo-name {
  font-size: 1em;
}


/* --- Разделы и услуги: занимают одну и ту же ячейку --- */

.header__nav {
  display: flex;
  gap: clamp(var(--s-4), 2vw, var(--s-8));
  min-inline-size: 0;
  /* Перебиваем цвет класса .mono: иначе ссылки наследуют приглушённый чернильный
     от него, а не светлый от половины шапки — и на тёмном фоне гаснут */
  color: inherit;
}

/* После прокрутки второстепенные пункты гаснут, но место сохраняют:
   услуги остаются ровно на своих позициях */
.header__link--secondary {
  transition:
    opacity var(--dur-base) var(--ease-out),
    visibility var(--dur-base);
}

.header--scrolled .header__link--secondary {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.header__link {
  position: relative;
  padding-block-end: 3px;
  color: inherit;
  /* Без приглушения, крупнее и плотнее обычного моношрифта: на чернильном фоне
     тонкий приглушённый текст переставал читаться */
  opacity: 1;
  font-size: 0.72rem;
  font-weight: 500;
  white-space: nowrap;
  transition: opacity var(--dur-fast) var(--ease-out);
}

.header__link::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  inset-block-end: 0;
  block-size: 1px;
  background-image: repeating-linear-gradient(
    to right,
    currentColor 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  clip-path: inset(0 100% 0 0);
  transition: clip-path var(--dur-base) var(--ease-out);
}

.header__link:hover {
  opacity: 1;
}

.header__link:hover::after {
  clip-path: inset(0 0 0 0);
}

/* --- Правая часть --- */

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
  /* Та же причина, что у разделов: .mono задаёт свой цвет */
  color: inherit;
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
  color: inherit;
  transition: opacity var(--dur-fast) var(--ease-out);
}

.header__lang-btn:hover {
  opacity: 1;
}

.header__lang-btn--on {
  opacity: 1;
}

[data-muted] {
  opacity: 0.5;
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

/* --- Бургер: две черты, при наведении верхняя удлиняется --- */

.header__burger {
  flex: none;
  display: grid;
  place-items: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  margin-inline-end: -0.6rem;
  color: inherit;
}

.header__burger-box {
  display: grid;
  gap: 6px;
  inline-size: 22px;
}

.header__burger-line {
  block-size: 1px;
  background: currentColor;
  transition: inline-size var(--dur-base) var(--ease-out);
}

.header__burger-line:last-child {
  inline-size: 70%;
  justify-self: start;
}

.header__burger:hover .header__burger-line:last-child {
  inline-size: 100%;
}

/* Пока меню открыто, бургер прячем — в меню есть свой крестик */
.header--menu .header__burger {
  opacity: 0;
  pointer-events: none;
}

/* --- Узкие экраны --- */

/*
  Вверху страницы разделы строкой живут в левой половине, а она вдвое уже страницы —
  все четыре помещаются только на широком экране. После прокрутки половин уже нет
  (под шапкой сплошная бумага) и остаются всего два пункта, поэтому там строка
  показывается и на средних ширинах, только без пустого места от погашенных пунктов.
*/
@media (max-width: 1439px) {
  /* display: none, а не прозрачность — иначе невидимая строка продолжает занимать
     место и распирает шапку на узком экране */
  .header__nav {
    display: none;
  }

  .header--scrolled .header__nav {
    display: flex;
  }

  .header--scrolled .header__link--secondary {
    display: none;
  }
}

@media (max-width: 1100px) {
  .header--scrolled .header__nav {
    display: none;
  }
}

@media (max-width: 900px) {
  /* На телефоне первый экран не делится пополам: под шапкой чернильная полоса,
     фотография начинается ниже. Значит вся шапка светлая — до прокрутки. */
  .header__left,
  .header__right {
    color: var(--paper);
  }

  /* Размытие подложки на телефоне — дорогая операция на каждый кадр прокрутки.
     Ставим непрозрачный фон: выглядит так же, а дёрганья не даёт. */
  .header__bg {
    background: var(--paper);
    backdrop-filter: none;
  }

  .header--scrolled .header__left,
  .header--scrolled .header__right,
  .header--menu .header__left,
  .header--menu .header__right {
    color: var(--ink);
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

  .header__right {
    gap: var(--s-2);
  }

  .header__logo {
    font-size: 1.25rem;
  }
}
</style>
