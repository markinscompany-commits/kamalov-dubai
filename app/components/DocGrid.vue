<!--
  Документы врача - лента одинаковых карточек (DocCard).

  Зачем на странице: диплом и сертификат - единственное доказательство квалификации,
  которое можно показать, не нарушая правил. Отзывы нельзя, «до/после» нельзя,
  обещать результат нельзя - а документ это факт, который человек проверяет глазами.

  Лентой, а не сеткой: документов семь и будет больше, в сетке они разъезжались на
  несколько рядов и блок разрастался. Не влезли - лента прокручивается вбок.

  ЗАТУХАНИЕ ПО КРАЯМ (правка Марка). Слева и справа появляются мягкие «шторки», но
  НЕ синхронно: каждая живёт своей стороной. Слева - только если лента прокручена и
  что-то уже ушло за левый край. Справа - только пока справа ещё есть неувиденное.
  Долистал до конца - правая гаснет. Это подсказка «здесь есть продолжение», а не
  украшение, поэтому она и не должна гореть просто так.
-->
<script setup lang="ts">
interface Doc {
  file: string
  logo?: string
  logoWide?: boolean
  /** Надпись вместо герба - для документов госорганов, см. DocCard */
  mark?: string
  title: string
}

interface Props {
  items: Doc[]
  /** Подпись на полях над сеткой */
  label: string
}

defineProps<Props>()

const strip = ref<HTMLElement | null>(null)
const fadeStart = ref(false)
const fadeEnd = ref(false)

/** Порог в пикселях: на дробных значениях прокрутки шторка иначе мигает у самого края */
const EDGE = 2

function update() {
  const el = strip.value
  if (!el) return
  fadeStart.value = el.scrollLeft > EDGE
  fadeEnd.value = el.scrollLeft + el.clientWidth < el.scrollWidth - EDGE
}

let observer: ResizeObserver | null = null

onMounted(() => {
  update()
  strip.value?.addEventListener('scroll', update, { passive: true })
  // Ширина ленты меняется и без прокрутки: поворот экрана, подгрузка шрифтов
  observer = new ResizeObserver(update)
  if (strip.value) observer.observe(strip.value)
})

onBeforeUnmount(() => {
  strip.value?.removeEventListener('scroll', update)
  observer?.disconnect()
})
</script>

<template>
  <div class="docs">
    <p class="mono docs__label">{{ label }}</p>

    <div class="docs__viewport">
      <ul ref="strip" class="docs__strip">
        <li v-for="doc in items" :key="doc.file" class="docs__cell">
          <DocCard
            :file="doc.file"
            :logo="doc.logo"
            :logo-wide="doc.logoWide"
            :mark="doc.mark"
            :title="doc.title"
          />
        </li>
      </ul>

      <span class="docs__fade docs__fade--start" :class="{ 'is-on': fadeStart }" aria-hidden="true" />
      <span class="docs__fade docs__fade--end" :class="{ 'is-on': fadeEnd }" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
.docs {
  /* Ширина карточки: рассчитана так, чтобы название помещалось в две строки */
  --doc-w: 11rem;
  --docs-fade: 3.5rem;

  display: flex;
  flex-direction: column;
  gap: var(--s-5);
}

.docs__label {
  margin: 0;
}

/* Окно, в котором живут лента и шторки. Шторки висят на нём, а не на ленте:
   иначе они уезжали бы вместе с содержимым */
.docs__viewport {
  position: relative;
  min-inline-size: 0;
}

.docs__strip {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scroll-snap-type: x proximity;
  /*
    Системная полоса прокрутки убрана: она серая, толстая и в чертёжную графику
    не вписывается. Что лента прокручивается, показывают шторки по краям.
  */
  scrollbar-width: none;
}

.docs__strip::-webkit-scrollbar {
  display: none;
}

.docs__cell {
  flex: 0 0 var(--doc-w);
  /* Наложение уголков: каждая следующая карточка заходит на предыдущую на пиксель */
  margin-inline-start: -1px;
  min-inline-size: 0;
  scroll-snap-align: start;
}

/* У первой карточки наложения нет - иначе весь ряд уезжает от левого края */
.docs__cell:first-child {
  margin-inline-start: 0;
}

/* --- Шторки --- */

.docs__fade {
  position: absolute;
  inset-block: 0;
  inline-size: var(--docs-fade);
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-out);
}

.docs__fade.is-on {
  opacity: 1;
}

.docs__fade--start {
  inset-inline-start: 0;
  background: linear-gradient(to right, var(--fade-to, var(--paper)), transparent);
}

.docs__fade--end {
  inset-inline-end: 0;
  background: linear-gradient(to left, var(--fade-to, var(--paper)), transparent);
}

@media (max-width: 700px) {
  .docs {
    --doc-w: 9.5rem;
    --docs-fade: 2.5rem;
  }
}
</style>
