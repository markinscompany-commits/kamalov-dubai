<!--
  Текст наливается цветом по мере прокрутки — приём из 5c.co.

  Заливаем по словам, а не сплошным градиентом: background-clip: text красит весь блок
  сразу, и на многострочном тексте эффект «караоке» не читается.

  Прогресс считаем от позиции скролла, а не по таймеру — иначе текст живёт своей жизнью
  независимо от того, что делает человек.
-->
<script setup lang="ts">
interface Props {
  text: string
}

const props = defineProps<Props>()

const root = ref<HTMLElement | null>(null)
const progress = ref(0)

/**
 * Режем текст вместе с пробелами и отдаём пробел отдельным узлом с white-space: pre-wrap.
 * Иначе Vue выбрасывает пробельные текстовые узлы между тегами, слова склеиваются в одну
 * неразрывную строку и растягивают всю страницу вширь.
 */
const tokens = computed(() =>
  props.text
    .split(/(\s+)/)
    .filter((t) => t.length > 0)
    .map((t, i) => ({ text: t, space: /^\s+$/.test(t), key: `${i}-${t}` })),
)

const words = computed(() => tokens.value.filter((t) => !t.space))
const activeCount = computed(() => Math.round(progress.value * words.value.length))

/** Порядковый номер слова среди слов (пробелы не считаем) */
const wordIndex = computed(() => {
  let n = -1
  return tokens.value.map((t) => (t.space ? -1 : ++n))
})

let frame = 0
let observer: IntersectionObserver | null = null
let live = false

/*
  Положение блока в документе и его высота замеряются РЕДКО — при появлении и при
  изменении размеров окна, — а не на каждом кадре прокрутки.

  Зачем. getBoundingClientRect() заставляет браузер пересчитать раскладку прямо
  сейчас, посреди кадра. На телефоне это стоило заметно и давало те самые
  микроподёргивания. Теперь во время прокрутки читается только scrollY, а он
  бесплатный: положение относительно экрана считается вычитанием.
*/
let docTop = 0
let blockH = 0
let vh = 0

function remeasure() {
  const node = root.value
  if (!node) return
  const rect = node.getBoundingClientRect()
  docTop = rect.top + window.scrollY
  blockH = rect.height
  vh = window.innerHeight
  apply()
}

function apply() {
  if (!blockH) return
  const top = docTop - window.scrollY
  const start = vh * 0.85 // начинаем, когда верх текста поднялся до 85% экрана
  const end = vh * 0.4 // заканчиваем, когда низ прошёл 40%
  const p = (start - top) / (start - end + blockH)
  progress.value = Math.min(1, Math.max(0, p))
}

function onScroll() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(apply)
}

function onResize() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(remeasure)
}

function listen(on: boolean) {
  if (on === live) return
  live = on
  if (on) {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    remeasure()
  } else {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    cancelAnimationFrame(frame)
  }
}

onMounted(() => {
  remeasure()
  /*
    Слушаем прокрутку только пока блок рядом с экраном. Замер положения на каждом кадре
    заставляет браузер пересчитывать раскладку, и на телефоне это давало микроподёргивания
    даже там, где текста ещё не видно.
  */
  observer = new IntersectionObserver((entries) => listen(entries[0]?.isIntersecting ?? false), {
    rootMargin: '200px 0px',
  })
  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  listen(false)
})
</script>

<template>
  <p ref="root" class="karaoke">
    <span
      v-for="(token, i) in tokens"
      :key="token.key"
      :class="
        token.space
          ? 'karaoke__space'
          : ['karaoke__word', { 'karaoke__word--on': wordIndex[i] < activeCount }]
      "
      >{{ token.text }}</span
    >
  </p>
</template>

<style scoped>
.karaoke {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 300;
  font-size: var(--fs-h1);
  line-height: 1.18;
  max-inline-size: min(22ch, 100%);
}

.karaoke__word {
  color: var(--ink-faint);
  transition: color var(--dur-base) var(--ease-out);
}

.karaoke__word--on {
  color: var(--ink);
}

/* pre-wrap: пробел сохраняется и при этом остаётся местом переноса строки */
.karaoke__space {
  white-space: pre-wrap;
}
</style>
