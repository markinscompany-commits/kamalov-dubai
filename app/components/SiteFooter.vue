<!--
  Подвал. Сервисная зона, а не смысловой блок - собирается без вариантов подачи.
  Чернильная полоса: логотип тем же приёмом, что в шапке (латиница в угловых
  скобках), дальше сведения.

  ПЕРЕСОБРАН 07.08 по правке Марка. Было: логотип слева, прижатый к верхнему
  краю, и все четыре строки одной колонкой справа - читалось свалкой, а справа
  было тесно. Стало три колонки по смыслу:

      кто          →  имя врача и титул из лицензии
      чем подтверждён →  номер лицензии DHA, срок и кнопка «посмотреть»
      где принимает   →  госпиталь и адрес

  и отдельной строкой внизу, за пунктирной чертой, - политика и год.

  Почему данные лицензии переехали СЮДА с карточки документа: подвал - обычное
  место для регуляторных сведений, там их и ищут, а на карточке в блоке
  «О докторе» длинная строка с номером ломала ровный ряд значков. На карточке
  осталось короткое «Лицензия DHA».

  Скан лицензии открывается в том же модальном окне, что фотографии госпиталя
  и документы врача, - отдельной вкладки нет нигде на сайте.

  🔴 К ЗАПУСКУ сюда встаёт номер рекламной лицензии MOH клиники
  (client-request, строка 3.1): строка `moh` уже заведена и пустая, блок
  появится сам, как только в ней будет значение. Пустых заглушек
  «номер будет позже» на странице не ставим.
-->
<script setup lang="ts">
const { m, locale } = useLocale()

/* Логотип перезагружает страницу, как в шапке (правка Марка 07.08):
   «в начало» должно возвращать к настоящему началу, а не к прокрутке наверх */
const base = useRuntimeConfig().app.baseURL
const homeHref = computed(() => (locale.value === 'ru' ? `${base}ru` : base))

/* Просмотр лицензии - тем же компонентом, что галереи. Кадр один,
   поэтому стрелки листания в нём просто некуда вести */
const licenceOpen = ref<number | null>(null)
const licenceItems = computed(() => [
  {
    file: 'docs/doc-dha-2026.webp',
    alt: m.value.footer.licenceAlt,
    caption: m.value.footer.licenceAlt,
  },
])
</script>

<template>
  <footer class="footer">
    <div class="page footer__inner">
      <div class="footer__cols">
        <!-- Кто -->
        <div class="footer__col footer__col--brand">
          <a class="footer__logo brackets" :href="homeHref" :aria-label="m.nav.toTop">dr. Kamalov</a>
          <p class="footer__name">{{ m.footer.name }}</p>
          <p class="mono footer__line">{{ m.footer.role }}</p>
        </div>

        <!-- Чем подтверждён -->
        <div class="footer__col">
          <p class="mono footer__label">{{ m.footer.licenceLabel }}</p>
          <p class="mono footer__line">{{ m.footer.licence }}</p>
          <p class="mono footer__line">{{ m.footer.licenceValid }}</p>
          <button class="mono footer__view" type="button" @click="licenceOpen = 0">
            {{ m.footer.licenceView }}
          </button>

          <!-- Появится сам, когда клиника передаст номер -->
          <template v-if="m.footer.moh">
            <p class="mono footer__label footer__label--gap">{{ m.footer.mohLabel }}</p>
            <p class="mono footer__line">{{ m.footer.moh }}</p>
          </template>
        </div>

        <!-- Где принимает -->
        <div class="footer__col">
          <p class="mono footer__label">{{ m.footer.placeLabel }}</p>
          <p class="mono footer__line">{{ m.footer.place }}</p>
          <p class="mono footer__line">{{ m.footer.address }}</p>
        </div>
      </div>

      <div class="footer__bottom">
        <NuxtLink class="mono footer__link" to="/privacy">{{ m.footer.policy }}</NuxtLink>
        <p class="mono footer__line">{{ m.footer.rights }}</p>
      </div>
    </div>

    <PhotoViewer v-model:index="licenceOpen" :items="licenceItems" />
  </footer>
</template>

<style scoped>
.footer {
  background: var(--ink);
  color: var(--paper);
  /* Тёмная поверхность: фокус - светлым золотом, правило дизайн-системы */
  --focus: var(--gold-light);
  --rule: color-mix(in srgb, var(--paper) 34%, transparent);
  padding-block: clamp(3rem, 6vh, 4.5rem);
}

.footer__inner {
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
  min-inline-size: 0;
}

.footer__cols {
  display: grid;
  /* Первая колонка шире: в ней логотип и имя антиквой */
  grid-template-columns: 1.4fr 1fr 1.2fr;
  gap: var(--s-8);
  align-items: start;
  min-inline-size: 0;
}

.footer__col {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
  min-inline-size: 0;
}

/* Логотип больше не приклеен к верхнему краю: под ним имя и титул,
   и колонка читается как одна группа */
.footer__col--brand {
  gap: var(--s-3);
}

.footer__logo {
  align-self: start;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 300;
  letter-spacing: 0.02em;
  color: inherit;
  padding: 0.35rem 0.7rem;
  /* Уголки торчат за текст - сдвигаем на их ширину, чтобы по левому краю
     страницы выравнивался уголок, а не буква (тот же приём, что в шапке) */
  margin-inline-start: 0.7rem;
  transition: color var(--dur-fast) var(--ease-out);
}

.footer__logo:hover {
  color: var(--gold-light);
}

.footer__name {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 300;
  font-size: 1.5rem;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

/* .mono задаёт свой приглушённый цвет - на чернилах перебиваем явно
   (грабли из шапки, design-system.md раздел 2). Насыщенность 500 и ступень
   крупнее: тонкий Plex Mono на тёмном читается хуже, чем на бумаге */
.footer__line,
.footer__label,
.footer__view,
.footer__link {
  margin: 0;
  color: var(--paper);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.5;
}

.footer__line {
  opacity: 0.75;
}

.footer__label {
  opacity: 0.5;
}

.footer__label--gap {
  margin-block-start: var(--s-4);
}

/* Кнопка просмотра лицензии: подчёркнута пунктиром того же шага, что вся
   разметка сайта - сплошная линия выпадала бы из языка страницы */
.footer__view {
  align-self: start;
  margin-block-start: var(--s-2);
  padding: 0;
  padding-block-end: 3px;
  text-align: start;
  background-image: repeating-linear-gradient(
    to right,
    currentColor 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: 0 100%;
  transition: color var(--dur-fast) var(--ease-out);
}

.footer__view:hover,
.footer__view:focus-visible {
  color: var(--gold-light);
}

/*
  Нижняя строка отделена пунктиром того же шага, что вся разметка сайта.
  Линия нарисована ФОНОМ, а не компонентом DashedRule: тот позиционируется
  абсолютно и во флекс-колонке уехал бы к верхнему краю подвала.
*/
.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-6);
  flex-wrap: wrap;
  padding-block-start: var(--s-5);
  background-image: repeating-linear-gradient(
    to right,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: 0 0;
}

.footer__link {
  opacity: 0.75;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  transition: color var(--dur-fast) var(--ease-out);
}

.footer__link:hover {
  opacity: 1;
  color: var(--gold-light);
}

/* Планшет: адрес и лицензия встают в один ряд под именем */
@media (max-width: 900px) {
  .footer__cols {
    grid-template-columns: 1fr 1fr;
    gap: var(--s-6) var(--s-8);
  }

  .footer__col--brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .footer__cols {
    grid-template-columns: 1fr;
    gap: var(--s-6);
  }
}
</style>
