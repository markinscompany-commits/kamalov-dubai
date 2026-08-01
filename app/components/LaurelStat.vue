<!--
  Цифра в лавровой ветви. Стоят рядом и держат блок «О докторе»:
  глазу нужно за что-то зацепиться раньше, чем он начнёт читать текст.

  Ветвь - файл public/media/laurel.svg, выбранный Марком из набора Freepik
  (исходник 5056945_2626229.svg в корне проекта, взят элемент с самыми тонкими
  листьями) и перекрашенный в фирменное золото.

  Почему картинкой, а не разметкой внутри компонента: в ветви 9 КБ путей, а на
  странице их четыре. Отдельный файл браузер загружает и кеширует один раз.
  Цвет запечён в файл - фирменное золото у нас одно.
-->
<script setup lang="ts">
interface Props {
  /** Что стоит внутри венка: «30+», «2017», «DHA» */
  value?: string
  /** Логотип организации вместо цифры: путь от public/ */
  logo?: string
  /** Подпись под венком */
  caption: string
}

defineProps<Props>()

const base = useRuntimeConfig().app.baseURL
</script>

<template>
  <figure class="laurel">
    <div class="laurel__mark">
      <img class="laurel__wreath" :src="`${base}media/laurel.svg`" alt="" aria-hidden="true" />

      <img v-if="logo" class="laurel__logo" :src="`${base}${logo}`" :alt="caption" />
      <span v-else class="laurel__value">{{ value }}</span>
    </div>

    <figcaption class="laurel__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.laurel {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-3);
  text-align: center;
}

/*
  Ветвь шире, чем выше (147:95), и открыта сверху. Цифра стоит в середине проёма,
  а не в геометрическом центре коробки: иначе она садится на перекрестье стеблей.
*/
.laurel__mark {
  position: relative;
  inline-size: 9.5rem;
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
  /* Подъём в проём венка */
  transform: translateY(-8%);
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(1.5rem, 2.6vw, 2.125rem);
  line-height: 1;
  letter-spacing: -0.01em;
  color: var(--ink);
  white-space: nowrap;
}

.laurel__logo {
  position: relative;
  transform: translateY(-8%);
  inline-size: 46%;
  block-size: auto;
  max-block-size: 56%;
  object-fit: contain;
}

.laurel__caption {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  line-height: 1.4;
  color: var(--ink-soft);
  max-inline-size: 11rem;
}

/* На телефоне венки уменьшены так, чтобы в ряд помещались хотя бы два */
@media (max-width: 700px) {
  .laurel__mark {
    inline-size: 6.75rem;
  }

  .laurel__value {
    font-size: 1.25rem;
  }

  .laurel__caption {
    font-size: 0.625rem;
    letter-spacing: 0.08em;
    max-inline-size: 8.5rem;
  }
}
</style>
