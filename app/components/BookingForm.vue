<!--
  Форма-анкета записи - одна на два места: блок [11] на странице и попап
  (BookingModal). Подача «Анкета» принята Марком 06.08, разбивка по строкам -
  его правка (каждое поле заканчивает СВОЮ строку и забирает её остаток,
  запас под длинные данные):

  ⚠️ ПОЧТЫ В ФОРМЕ БОЛЬШЕ НЕТ (правка Марка 07.08): два способа связи рядом
  сбивали с толку - человек не понимал, что заполнять и обязательно ли оба.
  Осталось имя и телефон, фраза стала:
      Меня зовут [имя........................]
      Свяжитесь со мной
      по телефону [номер....................]

  props.source - из какого блока пришла заявка (правка Марка 07.08),
  уходит в данные заявки и в слой аналитики (useBookingForm).
  props.compact - режим попапа: кегль фразы меньше, ширина не ограничена
  (её держит само окно).

  ДОСТУПНОСТЬ. Видимые слова фразы связаны с полями как label (клик ставит
  курсор), полное имя поля даёт aria-label; ошибки объявляются текстом
  (aria-describedby); подтверждение - в живой области (aria-live).
  Идентификаторы полей - от useId: форма стоит на странице не в одном
  экземпляре.

  🔴 ТРАНСПОРТ НЕ ПОДКЛЮЧЁН: адреса от клиники не получены, отправка
  имитируется - см. useBookingForm.ts.

  ⚠️ Красного в палитре нет намеренно: ошибки набраны --gold-deep и
  проговариваются текстом.

  ⚠️ Ширину фразы в ch задавать только на элементе с кеглем самой фразы -
  на контейнере с мелким шрифтом ch сжимал строку втрое (грабля сессии 9).
-->
<script setup lang="ts">
interface Props {
  /** Из какого блока пришла заявка: hero / header / menu / surgery / treatment / booking-section */
  source: string
  /** Режим попапа: компактнее кегль, ширину держит окно */
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), { compact: false })

const { m } = useLocale()
const { name, phone, consent, status, errors, submit } = useBookingForm(props.source)

/* Тот же адрес, что в шапке. 🔴 Номер - заглушка до передачи номера ОАЭ */
const whatsapp = 'https://wa.me/79285030807'

const uid = useId()

/** Ошибки одной строкой под фразой - у полей внутри текста места под них нет */
const errorLine = computed(() =>
  [errors.value.name, errors.value.phone, errors.value.consent].filter(Boolean).join('. '),
)
</script>

<template>
  <div class="bkf" :class="{ 'bkf--compact': compact }" aria-live="polite">
    <form v-if="status !== 'done'" class="bkf__form" novalidate @submit.prevent="submit">
      <div class="bkf__phrase">
        <p class="bkf__line">
          <label class="bkf__text" :for="`${uid}-name`">{{ m.booking.phrase.l1 }}</label>
          <input
            :id="`${uid}-name`"
            v-model="name"
            class="bkf__input"
            type="text"
            name="name"
            autocomplete="name"
            :aria-label="m.booking.form.name"
            :placeholder="m.booking.phrase.nameHint"
            :aria-invalid="!!errors.name"
            :aria-describedby="errorLine ? `${uid}-errors` : undefined"
          />
        </p>

        <p class="bkf__line bkf__line--plain">{{ m.booking.phrase.l2 }}</p>

        <p class="bkf__line">
          <label class="bkf__text" :for="`${uid}-phone`">{{ m.booking.phrase.l3 }}</label>
          <input
            :id="`${uid}-phone`"
            v-model="phone"
            class="bkf__input"
            type="tel"
            name="phone"
            autocomplete="tel"
            inputmode="tel"
            :aria-label="m.booking.form.phone"
            :placeholder="m.booking.phrase.phoneHint"
            :aria-invalid="!!errors.phone"
            :aria-describedby="errorLine ? `${uid}-errors` : undefined"
          />
        </p>

      </div>

      <p v-if="errorLine" :id="`${uid}-errors`" class="bkf__error">{{ errorLine }}</p>

      <!-- Кнопки слева, согласие правее кнопок - правка Марка 06.08 -->
      <div class="bkf__row">
        <div class="bkf__actions">
          <MarkAction type="submit" :disabled="status === 'sending'">
            {{ status === 'sending' ? m.booking.form.sending : m.booking.form.submit }}
          </MarkAction>
          <MarkAction variant="ghost" :href="whatsapp">{{ m.action.whatsapp }}</MarkAction>
        </div>

        <div class="bkf__consent">
          <input
            :id="`${uid}-consent`"
            v-model="consent"
            class="bkf__check"
            type="checkbox"
            :aria-label="`${m.booking.form.consentPre} ${m.booking.form.consentLink}`"
            :aria-invalid="!!errors.consent"
          />
          <!-- Ссылка ВНЕ label: клик по ней ведёт на политику, а не щёлкает
               чекбокс. Полное имя чекбокса даёт aria-label -->
          <span class="bkf__consent-label">
            <label :for="`${uid}-consent`">{{ m.booking.form.consentPre }}</label>
            {{ ' ' }}
            <NuxtLink class="bkf__consent-link" to="/privacy">{{ m.booking.form.consentLink }}</NuxtLink>
          </span>
        </div>
      </div>

      <p v-if="status === 'error'" class="bkf__error">{{ m.booking.form.error }}</p>
    </form>

    <div v-else class="bkf__done">
      <p class="bkf__done-title">{{ m.booking.form.doneTitle }}</p>
      <p class="bkf__done-text">{{ m.booking.form.doneText }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Типографика фразы стоит на контейнере, ширина в ch - от её кегля */
.bkf__phrase {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 3.2vw, 2.9rem);
  font-weight: 300;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--ink);
  max-inline-size: min(27ch, 100%);
}

/* Режим попапа: кегль меньше, ширину держит окно */
.bkf--compact .bkf__phrase {
  font-size: clamp(1.45rem, 2.2vw, 1.9rem);
  max-inline-size: 100%;
}

.bkf__line {
  display: flex;
  align-items: baseline;
  gap: 0.55ch;
  margin: 0;
  min-inline-size: 0;
}

.bkf__line + .bkf__line {
  margin-block-start: 0.4em;
}

.bkf__text {
  flex: 0 0 auto;
}

/*
  Поле внутри фразы: тем же шрифтом и кеглем, снизу пунктир.
  При фокусе линия сплошная и синяя (дизайн-система, раздел 8).
*/
.bkf__input {
  flex: 1 1 4ch;
  min-inline-size: 4ch;
  border: 0;
  background: transparent;
  font: inherit;
  color: var(--blue);
  padding: 0 0.2em 0.08em;
  border-radius: 0;
  background-image: repeating-linear-gradient(
    to right,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  background-size: 100% var(--rule-w);
  background-position: 0 100%;
  background-repeat: no-repeat;
}

.bkf__input::placeholder {
  color: var(--ink-faint);
  font-style: italic;
}

.bkf__input:focus {
  outline: none;
  background-image: linear-gradient(var(--blue), var(--blue));
  background-size: 100% 2px;
}

/* Кнопки слева, согласие правее кнопок (правка Марка) */
.bkf__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-6);
  margin-block-start: var(--s-8);
}

.bkf--compact .bkf__row {
  margin-block-start: var(--s-6);
  gap: var(--s-4);
}

.bkf__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-3);
}

.bkf__consent {
  display: flex;
  align-items: flex-start;
  gap: var(--s-3);
  max-inline-size: 24rem;
}

.bkf__check {
  inline-size: 1.05rem;
  block-size: 1.05rem;
  margin-block-start: 0.15rem;
  accent-color: var(--blue);
  flex: 0 0 auto;
}

.bkf__consent-label {
  font-size: var(--fs-small);
  line-height: 1.5;
  color: var(--ink-soft);
}

/* Ссылка на политику: синий = взаимодействие */
.bkf__consent-link {
  color: var(--blue);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.bkf__consent-link:hover {
  color: var(--blue-deep);
}

/* Ошибки: текстом, не только цветом. Красного в палитре нет намеренно */
.bkf__error {
  margin: var(--s-4) 0 0;
  font-size: var(--fs-small);
  line-height: 1.45;
  color: var(--gold-deep);
}

.bkf__done-title {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0 0 var(--s-3);
  color: var(--ink);
}

.bkf__done-text {
  font-size: var(--fs-body);
  line-height: 1.65;
  margin: 0;
  color: var(--ink-soft);
  max-inline-size: min(44ch, 100%);
}

@media (max-width: 900px) {
  .bkf__row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
