<!--
  Блок [09] «Кому не подходит» - подача «Стоп-штрихи». ВАРИАНТ А на выборе
  Марка, второй вариант - UnsuitedIndexSection.vue («Крупные номера»).
  Непринятый снимается, он останется в истории git.

  ПОДАЧА. Вдоль блока идёт вертикальный пунктир - продолжение языка разметки.
  На каждом случае его пересекает короткий СПЛОШНОЙ поперечный штрих: разметка
  здесь останавливается. Единственное место на сайте, где штрих сплошной, -
  и это смысл блока: «не сейчас». Случаи проявляются каскадом сверху вниз.

  Тон текстов: «хирург предложит подождать», не «вам нельзя» - без давления
  и страха (ST-21 п. 8.1.14).

  🔴 ФОРМУЛИРОВКИ - МЕДИЦИНСКИЕ, УТВЕРЖДАЕТ ДОКТОР (см. messages.ts).

  Разметки (узел + 4 луча) в блоке нет: пунктирная вертикаль своя,
  вторая система линий рядом лишняя (то же решение, что в [07] и [08]).
-->
<script setup lang="ts">
const { m } = useLocale()

const rootEl = ref<HTMLElement | null>(null)
const isLive = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isLive.value = true
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        isLive.value = true
        observer?.disconnect()
      }
    },
    /* Порог низкий: доля видимости считается от всей высоты списка,
       на телефоне он выше экрана (грабли ленты из [08]) */
    { threshold: 0.08 },
  )
  if (rootEl.value) observer.observe(rootEl.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <PageSection id="unsuited" :label="m.unsuited.label" tone="paper" no-rules>
    <SectionTitle :text="m.unsuited.title" />

    <p class="uns__lead">{{ m.unsuited.lead }}</p>

    <div ref="rootEl" class="uns" :class="{ 'is-live': isLive }">
      <span class="uns__line" aria-hidden="true" />

      <ol class="uns__list">
        <li v-for="(item, i) in m.unsuited.items" :key="i" class="uns__item" :style="{ '--i': i }">
          <!-- Сплошной поперечный штрих: разметка останавливается -->
          <span class="uns__stop" aria-hidden="true" />
          <h3 class="uns__name">{{ item.title }}</h3>
          <p class="uns__text">{{ item.text }}</p>
        </li>
      </ol>
    </div>

    <p class="uns__note">{{ m.unsuited.note }}</p>
  </PageSection>
</template>

<style scoped>
.uns__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(52ch, 100%);
}

/* Гуттер слева: в нём живёт пунктирная вертикаль, текст её не встречает */
.uns {
  --uns-gutter: 2.6rem;
  position: relative;
  padding-inline-start: var(--uns-gutter);
  margin-block-start: var(--s-8);
  max-inline-size: 62ch;
}

.uns__line {
  position: absolute;
  inset-block: 0.4rem;
  inset-inline-start: 0;
  inline-size: var(--rule-w);
  background-image: repeating-linear-gradient(
    to bottom,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

.uns__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(2.25rem, 4.5vh, 3.5rem);
}

.uns__item {
  position: relative;
  min-inline-size: 0;
  opacity: 0;
  translate: 0 0.4rem;
  transition:
    opacity var(--dur-slow) var(--ease-out),
    translate var(--dur-slow) var(--ease-out);
  transition-delay: calc(120ms + var(--i) * 160ms);
}

.uns.is-live .uns__item {
  opacity: 1;
  translate: 0 0;
}

/*
  Стоп-штрих: единственная СПЛОШНАЯ линия в разметке сайта - намеренно.
  Стоит на пунктире серединой (сдвиг на полтолщины - правило CrossRules).
*/
.uns__stop {
  position: absolute;
  inset-inline-start: calc(-1 * var(--uns-gutter) - 0.7rem);
  inset-block-start: 0.62em;
  inline-size: 1.5rem;
  block-size: var(--rule-w);
  background: var(--ink);
}

.uns__name {
  font-family: var(--font-display);
  font-size: clamp(1.45rem, 2.1vw, 1.9rem);
  font-weight: 300;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0 0 var(--s-2);
  color: var(--ink);
}

.uns__text {
  font-size: var(--fs-body);
  line-height: 1.6;
  margin: 0;
  color: var(--ink-soft);
  max-inline-size: min(52ch, 100%);
}

.uns__note {
  margin: var(--s-10) 0 0;
  font-size: var(--fs-body);
  line-height: 1.6;
  color: var(--ink-soft);
  max-inline-size: min(52ch, 100%);
}

@media (max-width: 900px) {
  .uns {
    --uns-gutter: 1.9rem;
  }

  .uns__stop {
    inset-inline-start: calc(-1 * var(--uns-gutter) - 0.45rem);
    inline-size: 1.1rem;
  }
}
</style>
