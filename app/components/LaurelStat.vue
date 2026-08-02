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

      <div class="laurel__inner">
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
    </div>

    <figcaption class="laurel__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.laurel {
  /*
    ГДЕ СТОИТ ЗНАК ВНУТРИ ВЕТВИ.

    ⚠️ Раньше это был подъём в процентах (translateY), и в этом была ошибка:
    проценты в translateY считаются от высоты САМОГО ЗНАКА. Логотипы разные по
    высоте - значит один и тот же процент поднимал каждый на свою величину, и
    ряд разъезжался по вертикали. Марк это поймал: ровно встал только самый
    высокий знак.

    Теперь задаётся ЛИНИЯ, на которой стоит центр знака, - одна на все венки.
    Отсчёт от верха коробки, доля считается от ШИРИНЫ (так работают проценты
    в padding). Размер знака на положение больше не влияет вообще.
  */
  --mark-room: 20%; /* запас над ветвью: знак выходит за неё и не наезжает на текст */
  --mark-y: 8%; /* насколько линия ниже верхнего края ветви */
  /*
    Высота знака. Задана длиной, а не долей: доля считалась бы от ячейки сетки,
    у которой высота «по содержимому» - получается кольцевая зависимость, и
    браузер молча уменьшает картинку. На этом уже обожглись.
  */
  --mark-size: 2.9rem;

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
  /* Коробка выше самой ветви: сверху добавлен запас под поднятый знак */
  padding-block-start: var(--mark-room);
}

/* Ветвь идёт в потоке и держит собственную пропорцию сама */
.laurel__wreath {
  display: block;
  inline-size: 100%;
  block-size: auto;
}

/*
  Слой знака. Отступ сверху ставит ЛИНИЮ, к которой прижат верх знака, а сам знак
  сдвигается вверх на половину своей высоты - и его центр садится ровно на линию.
  Половина высоты здесь не «подъём», а способ центрирования: она одинаково работает
  и для цифры, и для квадратного герба, и для вытянутого логотипа.
*/
.laurel__inner {
  position: absolute;
  inset: 0;
  padding-block-start: calc(var(--mark-room) + var(--mark-y));
  display: grid;
  align-content: start;
  justify-items: center;
}

.laurel__value {
  transform: translateY(-50%);
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(1.75rem, 2.8vw, 2.25rem);
  line-height: 1;
  letter-spacing: -0.01em;
  color: var(--ink);
  white-space: nowrap;
}

/*
  Логотип ограничен И по высоте, И по ширине: у логотипов разные пропорции, и без
  второго предела квадратный герб вылезает на листья.
*/
.laurel__logo {
  transform: translateY(-50%);
  inline-size: auto;
  block-size: auto;
  max-block-size: var(--mark-size);
  max-inline-size: 62%;
  object-fit: contain;
}

/* Горизонтальный логотип ниже, но шире */
.laurel__logo--wide {
  max-block-size: calc(var(--mark-size) * 0.72);
  max-inline-size: 72%;
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

  .laurel {
    --mark-size: 2.2rem;
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
