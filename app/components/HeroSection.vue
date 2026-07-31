<!--
  Первый экран.

  Обязательные элементы (бриф + договор, п. 1.3): имя врача, специализация, фото,
  краткое описание опыта, кнопка «Записаться на консультацию», кнопка WhatsApp.

  Композиция: экран ровно пополам. Слева чернильная половина со светлым текстом,
  справа фотография на светлом фоне.

  ФОТОГРАФИЯ. У снимка есть охранная зона — голова с запасом сверху и обе руки
  целиком. Она не должна обрезаться ни на одном разрешении. Поэтому кадр вписывается
  в область ЦЕЛИКОМ (object-fit: contain), а не заполняет её. Свободное место
  закрывается фоном ровно того же цвета, что и фон снимка (--photo-bg), поэтому
  край кадра не виден. Пропорция кадра — --photo-ar, режется tools/crop-portrait.ps1.

  РАЗМЕТКА. По блоку проходят ровно две линии: одна вертикаль и одна горизонталь.
  Пересечение стоит в пустом месте, чтобы линии не шли поверх текста. Рисуются
  двумя слоями: светлым на чернильной половине, тёмным на светлой.

  Все формулировки — факты. Ни одной превосходной степени и ни одного обещания
  результата: см. compliance/content-rules.md.
-->
<script setup lang="ts">
// TODO: подставить реальный номер клиники, когда клиника его передаст
const whatsapp = 'https://wa.me/79285030807'

// Позиции линий задаются переменными в CSS — они разные на десктопе и на телефоне
const verticals = ['var(--hero-line-x)']
const horizontals = ['var(--hero-line-y)']

// На GitHub Pages сайт лежит в подпапке, поэтому путь к картинке собираем через baseURL
const base = useRuntimeConfig().app.baseURL
</script>

<template>
  <section id="top" class="hero">
    <!--
      Два слоя одной и той же разметки, обрезанные по границе половин: светлый виден
      на чернильной половине, тёмный — на светлой. Так одна линия читается через весь
      экран независимо от того, что под ней. Оба слоя лежат ПОД фотографией: там, где
      стоит снимок, он их закрывает.
    -->
    <div class="hero__rules hero__rules--light" aria-hidden="true">
      <GridLines :verticals="verticals" :horizontals="horizontals" :delay="600" />
    </div>
    <div class="hero__rules hero__rules--dark" aria-hidden="true">
      <GridLines :verticals="verticals" :horizontals="horizontals" :delay="600" />
    </div>

    <!--
      Один кадр на все разрешения — он режется ровно по охранной зоне, а вписывается
      целиком, поэтому подгонять пропорции под каждый экран больше не нужно.
      Два файла отличаются только размером в пикселях, браузер берёт нужный сам.
    -->
    <div class="hero__photo">
      <img
        :src="`${base}media/doctor-portrait.jpg`"
        :srcset="`${base}media/doctor-portrait-sm.jpg 900w, ${base}media/doctor-portrait.jpg 1600w`"
        sizes="(max-width: 900px) 100vw, 50vw"
        alt="Эльдар Камалов, пластический хирург"
        width="1600"
        height="1473"
        fetchpriority="high"
      />
    </div>

    <div class="page hero__inner">
      <p class="mono hero__eyebrow rise" style="--i: 0">[01] Принимает в Dubai London Hospital</p>

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
  /* Высота берётся из замеренной один раз --app-height, а не из «живой» высоты окна.
     Иначе на телефоне при скрытии адресной строки экран пересчитывается прямо во
     время прокрутки и дёргается. Лесенка запасных значений — для старых браузеров. */
  block-size: 100vh;
  block-size: 100svh;
  block-size: var(--app-height, 100svh);
  min-block-size: 34rem;
  overflow: hidden;
  /* Замыкаем смешивание на секции */
  isolation: isolate;
  /* Слева чернильная половина, справа поле под фотографию — тон в тон с её фоном */
  background: linear-gradient(
    to right,
    var(--ink) 0 var(--photo-start),
    var(--photo-bg) var(--photo-start) 100%
  );

  /* Пересечение разметки: в пустом поле между текстом и краем фотографии,
     по высоте — между шапкой и подписью «[01] …» */
  --hero-line-x: 44.3%;
  --hero-line-y: 15.3%;
}

/* --- Разметка: два слоя, обрезанные по границе половин --- */

.hero__rules {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* ⚠️ clip-path — свойство физическое, логического аналога нет. Для арабской версии
   обе обрезки разворачиваются вручную (см. design-system.md, раздел 9). */
.hero__rules--light {
  --rule: color-mix(in srgb, var(--paper) 34%, transparent);
  --rule-node: color-mix(in srgb, var(--paper) 72%, transparent);
  clip-path: inset(0 calc(100% - var(--photo-start)) 0 0);
}

.hero__rules--dark {
  --rule: color-mix(in srgb, var(--ink) 26%, transparent);
  --rule-node: color-mix(in srgb, var(--ink) 55%, transparent);
  clip-path: inset(0 0 0 var(--photo-start));
}

/* --- Фотография --- */

.hero__photo {
  position: absolute;
  z-index: 1;
  inset-block: 0;
  inset-inline-end: 0;
  inline-size: calc(100% - var(--photo-start));
  /* Фон не нужен: половина уже залита --photo-bg самой секцией. Так линии разметки
     остаются видны там, где кадр не достаёт до верха. */
}

.hero__photo img {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  /* Кадр вписывается ЦЕЛИКОМ: охранная зона не обрезается ни при какой пропорции
     окна. Прижат к низу — руки всегда на месте, свободное место уходит наверх,
     где фон совпадает с фоном снимка и стыка не видно. */
  object-fit: contain;
  object-position: 50% 100%;
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

/* --- Низкие окна на десктопе: экран обязан оставаться целым ---
   Только от 901 px: на телефоне высота окна меняется при скрытии адресной строки,
   и правило по высоте пересобирало бы первый экран прямо во время прокрутки. */

@media (min-width: 901px) and (max-height: 820px) {
  .hero__title {
    font-size: clamp(2.25rem, 4.2vw, 3.5rem);
  }

  .hero__spec {
    font-size: clamp(1.25rem, 2vw, 1.625rem);
  }
}

/* --- Планшеты и телефоны ---

   Раскладка гибкая, а не сложенная из посчитанных заранее отступов: сначала своё
   место получают подпись, заголовок, регалии и кнопки, а фотография забирает то,
   что осталось. Поэтому кнопки не могут уехать за нижний край, а высота блока не
   зависит от правил по высоте окна — значит и не прыгает при прокрутке. */

@media (max-width: 900px) {
  .hero {
    --photo-start: 0%;
    --hero-caption: 2.25rem;
    /* Пересечение уходит вниз влево: ниже кнопок и левее всего текста —
       единственное место на узком экране, где линии никого не задевают.
       1.1rem от низа: у содержимого снизу отступ 2rem, значит линия проходит
       под кнопками даже на самом низком телефоне, где запаса высоты нет совсем. */
    --hero-line-x: max(0.8rem, calc(var(--page-pad) - 0.75rem));
    --hero-line-y: calc(100% - 1.1rem);

    display: flex;
    flex-direction: column;
    background: var(--ink);
    /* Не жёсткая высота, а минимальная: если текст вдруг не влезет, блок вырастет,
       а не обрежет содержимое */
    block-size: auto;
    min-block-size: 100vh;
    min-block-size: 100svh;
    min-block-size: var(--app-height, 100svh);
    padding-block-start: calc(var(--header-h) + var(--hero-caption));
  }

  /* Подпись стоит НАД фотографией, под шапкой. Отступ по краям — тот же, что у всей
     страницы: абсолютное позиционирование считается от padding-box, поэтому
     inset-inline: 0 прижал бы её к самому краю.
     Отсчёт идёт от секции: у .hero__inner на телефоне снят position: relative. */
  .hero__eyebrow {
    position: absolute;
    inset-block-start: calc(var(--header-h) - 0.25rem);
    inset-inline: var(--page-pad);
    margin: 0;
  }

  /* Светлая разметка на телефоне видна везде: половин здесь нет, фон сплошь чернильный */
  .hero__rules--light {
    clip-path: none;
  }

  .hero__rules--dark {
    display: none;
  }

  /* Фотография — обычный элемент потока, забирает свободное место.
     Верхняя граница — своя же пропорция: выше кадра полоса не растёт. */
  .hero__photo {
    position: static;
    z-index: 1;
    inline-size: 100%;
    flex: 1 1 0;
    min-block-size: 9rem;
    max-block-size: calc(100vw / var(--photo-ar));
    /* Здесь фон нужен: вокруг чернильная секция, а поля кадра должны совпадать с ним */
    background: var(--photo-bg);
  }

  /* position: static — чтобы подпись считала свой отступ от секции, а не отсюда.
     z-index у элемента гибкой раскладки работает и без позиционирования. */
  .hero__inner {
    position: static;
    block-size: auto;
    flex: 0 0 auto;
    align-content: start;
    padding-block: var(--s-6) var(--s-8);
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
</style>
