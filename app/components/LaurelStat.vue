<!--
  Знак отличия в лавровой ветви: внутри цифра или логотип, под ветвью подпись.
  Стоят рядом и держат блок «О докторе» - глазу нужно за что-то зацепиться
  раньше, чем он начнёт читать текст.

  Ветвь - файл public/media/laurel.svg, выбранный Марком из набора Freepik
  и перекрашенный в фирменное золото. Картинкой, а не разметкой внутри
  компонента: в ветви 9 КБ путей, а на странице их четыре - отдельный файл
  браузер грузит и кеширует один раз.

  ⚠️ Содержимое стоит НЕ в геометрическом центре коробки. Ветвь открыта сверху
  и сходится внизу, поэтому по центру цифра садится прямо на перекрестье
  стеблей - Марк это поймал на скриншоте. Проём находится выше середины,
  туда контент и поднят (--mark-lift).
-->
<script setup lang="ts">
interface Props {
  /** Что стоит внутри венка: «30+» */
  value?: string
  /** Логотип вместо цифры: путь от public/ */
  logo?: string
  /** Логотип широкий (горизонтальный) - тогда его размер считается по ширине */
  wide?: boolean
  /** Подпись под венком */
  caption: string
}

withDefaults(defineProps<Props>(), { value: undefined, logo: undefined, wide: false })

const base = useRuntimeConfig().app.baseURL
</script>

<template>
  <figure class="laurel">
    <div class="laurel__mark">
      <img class="laurel__wreath" :src="`${base}media/laurel.svg`" alt="" aria-hidden="true" />

      <img
        v-if="logo"
        class="laurel__logo"
        :class="{ 'laurel__logo--wide': wide }"
        :src="`${base}${logo}`"
        alt=""
        aria-hidden="true"
      />
      <span v-else class="laurel__value">{{ value }}</span>
    </div>

    <figcaption class="laurel__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.laurel {
  /*
    Насколько контент поднят к проёму ветви. Считается от ВЫСОТЫ САМОГО ЗНАКА
    (так работает translateY в процентах), а не от высоты коробки.

    ⚠️ 45% - предел. Марк просил 60%, но при нём верх логотипов выходит за ветвь
    и наезжает на абзац выше: у знака остаётся всего половина высоты запаса.
    При 45% знак стоит вплотную к верхнему краю проёма и никуда не вылезает.
    Проверяется кадром в увеличении - tools/laurel-check.mjs.
  */
  --mark-lift: 45%;

  /*
    Знак занимает всю свою колонку. Без этого фигура сжимается по длине подписи,
    и ветвь с короткой подписью получается мельче соседних - ряд разъезжается.
  */
  inline-size: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-4);
  text-align: center;
}

/*
  Ветвь шире, чем выше (147:95). Ширина у всех знаков одна, поэтому ряд стоит
  ровно даже с разными по формату логотипами внутри.
*/
.laurel__mark {
  position: relative;
  inline-size: 100%;
  max-inline-size: 10.5rem;
  margin-inline: auto;
  aspect-ratio: 147 / 95;
  display: grid;
  place-items: center;
}

.laurel__wreath {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
}

.laurel__value {
  position: relative;
  transform: translateY(calc(-1 * var(--mark-lift)));
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(1.75rem, 2.8vw, 2.25rem);
  line-height: 1;
  letter-spacing: -0.01em;
  color: var(--ink);
  white-space: nowrap;
}

/*
  Логотип вписывается в проём и ограничен И по ширине, И по высоте: у логотипов
  разные пропорции, и без второго ограничения квадратный герб вылезает на листья.
*/
.laurel__logo {
  position: relative;
  transform: translateY(calc(-1 * var(--mark-lift)));
  inline-size: auto;
  block-size: auto;
  max-inline-size: 42%;
  max-block-size: 44%;
  object-fit: contain;
}

/* Горизонтальный логотип шире и ниже - ему нужен другой предел */
.laurel__logo--wide {
  max-inline-size: 56%;
  max-block-size: 30%;
}

.laurel__caption {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1.6;
  color: var(--ink-soft);
  /* Подпись не шире своей ветви: иначе соседние подписи сливаются в одну строку */
  max-inline-size: 13rem;
}

@media (max-width: 700px) {
  .laurel {
    gap: var(--s-3);
  }

  .laurel__mark {
    max-inline-size: 8rem;
  }

  .laurel__value {
    font-size: 1.5rem;
  }

  .laurel__caption {
    font-size: 0.625rem;
    letter-spacing: 0.06em;
    max-inline-size: 100%;
  }
}
</style>
