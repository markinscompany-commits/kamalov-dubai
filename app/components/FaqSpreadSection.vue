<!--
  Блок [10] «Вопросы и ответы» - подача «Разворот». ВАРИАНТ Б на выборе
  Марка, первый вариант - FaqFoldSection.vue («Аккордеон»). Непринятый
  снимается, он останется в истории git.

  ПОДАЧА. Никаких раскрытий: все вопросы и ответы видны сразу, как интервью
  на журнальном развороте - вопрос антиквой в левой колонке, ответ гротеском
  в правой. Пары разделены пунктиром и проявляются каскадом. Человек читает
  без единого клика; заодно весь текст честно лежит на странице - модерации
  нечего раскрывать.

  🔴 ФОРМУЛИРОВКИ УТВЕРЖДАЕТ ДОКТОР (см. messages.ts) - особенно про следы
  и снимки в госпитале.
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
    { threshold: 0.08 },
  )
  if (rootEl.value) observer.observe(rootEl.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <PageSection id="faq-b" :label="m.faq.label" tone="deep" cross-y="5.5rem">
    <SectionTitle :text="m.faq.title" />

    <dl ref="rootEl" class="faqb" :class="{ 'is-live': isLive }">
      <div v-for="(item, i) in m.faq.items" :key="i" class="faqb__pair" :style="{ '--i': i }">
        <DashedRule class="faqb__rule" :delay="i * 90" />
        <dt class="faqb__q">{{ item.q }}</dt>
        <dd class="faqb__a">{{ item.a }}</dd>
      </div>
    </dl>
  </PageSection>
</template>

<style scoped>
.faqb {
  margin: var(--s-4) 0 0;
}

.faqb__pair {
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--s-6);
  padding-block: var(--s-8);
  opacity: 0;
  translate: 0 0.4rem;
  transition:
    opacity var(--dur-slow) var(--ease-out),
    translate var(--dur-slow) var(--ease-out);
  transition-delay: calc(100ms + var(--i) * 150ms);
}

.faqb.is-live .faqb__pair {
  opacity: 1;
  translate: 0 0;
}

.faqb__rule {
  inset-block-start: 0;
}

.faqb__q {
  grid-column: 1 / span 5;
  font-family: var(--font-display);
  font-size: clamp(1.45rem, 2.1vw, 1.9rem);
  font-weight: 300;
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin: 0;
  color: var(--ink);
  min-inline-size: 0;
}

.faqb__a {
  grid-column: 7 / span 6;
  font-size: var(--fs-body);
  line-height: 1.65;
  margin: 0;
  color: var(--ink-soft);
  min-inline-size: 0;
  max-inline-size: min(48ch, 100%);
}

@media (max-width: 900px) {
  .faqb__pair {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-3);
    padding-block: var(--s-6);
  }

  .faqb__q,
  .faqb__a {
    grid-column: 1 / -1;
  }
}
</style>
