<!--
  Блок [10] «Вопросы и ответы» - подача «Аккордеон».
  Вариант А, выбран Марком 07.08 из двух собранных вживую; вариант Б
  «Разворот» (вопрос слева - ответ справа, всё видно сразу) снят,
  он в истории git (коммит b5adabf, файл FaqSpreadSection.vue).

  ПОДАЧА. Классический раскрывающийся список в языке сайта: вопрос антиквой,
  строки разделены пунктиром, маркер - крестик из двух штрихов, который при
  раскрытии поворачивается в «минус». Открытым может быть несколько вопросов
  сразу - человек сравнивает ответы, закрывать за него ничего не нужно.

  ⚠️ ОТВЕТЫ НЕ ЛЕЖАТ В СВЁРНУТОМ HTML (v-if, не display:none) - правило
  из TimeLine: невидимый человеку текст модерация видит, скрытых текстов
  в готовой странице не держим.

  ДОСТУПНОСТЬ: кнопка на всю строку, aria-expanded + aria-controls,
  работа с клавиатуры - нативная кнопка.

  🔴 ФОРМУЛИРОВКИ УТВЕРЖДАЕТ ДОКТОР (см. messages.ts) - особенно про следы
  и снимки в госпитале.
-->
<script setup lang="ts">
const { m } = useLocale()

const open = ref<Set<number>>(new Set())

function toggle(i: number) {
  const next = new Set(open.value)
  if (next.has(i)) next.delete(i)
  else next.add(i)
  open.value = next
}
</script>

<template>
  <PageSection id="faq" :label="m.faq.label" tone="deep" cross-y="5.5rem">
    <SectionTitle :text="m.faq.title" />

    <ul class="faq">
      <li v-for="(item, i) in m.faq.items" :key="i" class="faq__item">
        <DashedRule class="faq__rule" :delay="i * 90" />

        <button
          type="button"
          class="faq__q"
          :aria-expanded="open.has(i)"
          :aria-controls="`faq-a-${i}`"
          @click="toggle(i)"
        >
          <span class="faq__q-text">{{ item.q }}</span>
          <!-- Крестик из двух штрихов тем же пером, что разметка.
               При раскрытии вертикальный штрих ложится - остаётся «минус» -->
          <span class="faq__mark" :class="{ 'is-open': open.has(i) }" aria-hidden="true" />
        </button>

        <!-- v-if, не скрытие: свёрнутых текстов в HTML не держим -->
        <div v-if="open.has(i)" :id="`faq-a-${i}`" class="faq__a">
          <p class="faq__a-text">{{ item.a }}</p>
        </div>
      </li>
    </ul>
    <DashedRule class="faq__rule faq__rule--end" :delay="m.faq.items.length * 90" />
  </PageSection>
</template>

<style scoped>
.faq {
  list-style: none;
  margin: var(--s-4) 0 0;
  padding: 0;
  max-inline-size: 62ch;
  position: relative;
}

.faq__item {
  position: relative;
}

.faq__rule {
  inset-block-start: 0;
}

/* Замыкающая линия под последним вопросом */
.faq__rule--end {
  position: relative;
  display: block;
  max-inline-size: 62ch;
}

.faq__q {
  inline-size: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-6);
  border: 0;
  background: none;
  padding: var(--s-6) 0;
  cursor: pointer;
  text-align: start;
  color: var(--ink);
}

.faq__q-text {
  font-family: var(--font-display);
  font-size: clamp(1.45rem, 2.1vw, 1.9rem);
  font-weight: 300;
  line-height: 1.2;
  letter-spacing: -0.01em;
  min-inline-size: 0;
}

.faq__q:hover .faq__q-text {
  color: var(--blue);
}

/* Маркер: крест из двух штрихов пером разметки. Открыт - вертикаль ложится */
.faq__mark {
  position: relative;
  flex: 0 0 auto;
  inline-size: 15px;
  block-size: 15px;
}

.faq__mark::before,
.faq__mark::after {
  content: '';
  position: absolute;
  background: var(--ink);
  transition: rotate var(--dur-base) var(--ease-out);
}

.faq__mark::before {
  inset-inline: 0;
  inset-block-start: calc(50% - var(--rule-w) / 2);
  block-size: var(--rule-w);
}

.faq__mark::after {
  inset-block: 0;
  inset-inline-start: calc(50% - var(--rule-w) / 2);
  inline-size: var(--rule-w);
}

.faq__mark.is-open::after {
  rotate: 90deg;
}

.faq__a {
  padding-block-end: var(--s-6);
}

.faq__a-text {
  font-size: var(--fs-body);
  line-height: 1.65;
  margin: 0;
  color: var(--ink-soft);
  max-inline-size: min(54ch, 100%);
  /* Появление ответа: без «замерших» анимаций не обойтись - но переход
     от начального состояния v-if Vue проигрывает сам при вставке */
  animation: faq-in var(--dur-base) var(--ease-out);
}

@keyframes faq-in {
  from {
    opacity: 0;
    translate: 0 -0.25rem;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

@media (max-width: 900px) {
  .faq__q {
    padding-block: var(--s-4);
  }
}
</style>
