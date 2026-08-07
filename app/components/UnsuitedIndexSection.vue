<!--
  Блок [09] «Кому не подходит» - подача «Крупные номера».
  Вариант Б, выбран Марком 07.08 из двух собранных вживую; вариант А
  «Стоп-штрихи» (пунктирная вертикаль со сплошными поперечными штрихами)
  снят, он в истории git (коммит b5adabf, файл UnsuitedStopSection.vue).

  ПОДАЧА. Каждый случай - запись с крупным номером антиквой в бледном тоне
  (как незалитое караоке): пронумерованный перечень ограничений, читается
  как страница из регламента. Записи гуляют по 12-колоночной сетке через
  одну (приём асимметрии по сетке, design-system раздел 3 - но сдвиг ЗДЕСЬ
  меньше, чем в галерее [05], чтобы не повторять её ритм один в один).

  Тон текстов: «хирург предложит подождать», не «вам нельзя» - без давления
  и страха (ST-21 п. 8.1.14).

  🔴 ФОРМУЛИРОВКИ - МЕДИЦИНСКИЕ, УТВЕРЖДАЕТ ДОКТОР (см. messages.ts).
-->
<script setup lang="ts">
const { m } = useLocale()

const rootEl = ref<HTMLElement | null>(null)
const isLive = ref(false)
let observer: IntersectionObserver | null = null

const pad = (i: number) => String(i + 1).padStart(2, '0')

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
  <PageSection id="unsuited" :label="m.unsuited.label" tone="paper" cross-y="5.5rem">
    <SectionTitle :text="m.unsuited.title" />

    <p class="unsb__lead">{{ m.unsuited.lead }}</p>

    <ol ref="rootEl" class="unsb" :class="{ 'is-live': isLive }">
      <li v-for="(item, i) in m.unsuited.items" :key="i" class="unsb__item" :style="{ '--i': i }">
        <div class="unsb__inner">
          <p class="unsb__num" aria-hidden="true">{{ pad(i) }}</p>
          <div class="unsb__body">
            <h3 class="unsb__name">{{ item.title }}</h3>
            <p class="unsb__text">{{ item.text }}</p>
          </div>
        </div>
      </li>
    </ol>

    <p class="unsb__note">{{ m.unsuited.note }}</p>
  </PageSection>
</template>

<style scoped>
.unsb__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(52ch, 100%);
}

.unsb {
  list-style: none;
  margin: var(--s-8) 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(2.5rem, 5vh, 4rem);
}

/* Записи гуляют по сетке: нечётные к началу, чётные со сдвигом */
.unsb__item {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  opacity: 0;
  translate: 0 0.4rem;
  transition:
    opacity var(--dur-slow) var(--ease-out),
    translate var(--dur-slow) var(--ease-out);
  transition-delay: calc(120ms + var(--i) * 160ms);
}

.unsb.is-live .unsb__item {
  opacity: 1;
  translate: 0 0;
}

.unsb__inner {
  grid-column: 1 / span 8;
  display: flex;
  align-items: baseline;
  gap: var(--s-6);
  min-inline-size: 0;
}

.unsb__item:nth-child(even) .unsb__inner {
  grid-column: 3 / span 8;
}

/* Номер - бледной антиквой, как незалитое караоке. Только цифры, без точки */
.unsb__num {
  font-family: var(--font-display);
  font-size: clamp(2.75rem, 4.5vw, 4.25rem);
  font-weight: 300;
  line-height: 1;
  margin: 0;
  color: var(--ink-faint);
  flex: 0 0 auto;
}

.unsb__body {
  min-inline-size: 0;
}

.unsb__name {
  font-family: var(--font-display);
  font-size: clamp(1.45rem, 2.1vw, 1.9rem);
  font-weight: 300;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0 0 var(--s-2);
  color: var(--ink);
}

.unsb__text {
  font-size: var(--fs-body);
  line-height: 1.6;
  margin: 0;
  color: var(--ink-soft);
  max-inline-size: min(48ch, 100%);
}

.unsb__note {
  margin: var(--s-10) 0 0;
  font-size: var(--fs-body);
  line-height: 1.6;
  color: var(--ink-soft);
  max-inline-size: min(52ch, 100%);
}

@media (max-width: 900px) {
  /* Сдвиги на телефоне не работают - колонки во всю ширину */
  .unsb__inner,
  .unsb__item:nth-child(even) .unsb__inner {
    grid-column: 1 / -1;
  }

  .unsb__inner {
    gap: var(--s-4);
  }

  .unsb__num {
    font-size: 2.25rem;
  }
}
</style>
