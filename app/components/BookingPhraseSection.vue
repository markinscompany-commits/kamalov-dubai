<!--
  Блок [11] «Заявка и контакты» - подача «Анкета». ВАРИАНТ Б на выборе Марка,
  первый вариант - BookingCardSection.vue («Карта записи»). Непринятый
  снимается, он останется в истории git.

  ПОДАЧА. Форма - одна фраза крупной антиквой, поля стоят прямо внутри неё:
  «Меня зовут ___. Свяжитесь со мной по телефону ___ или почте ___».
  Человек не заполняет анкету - он дописывает предложение о себе.
  Поля подчёркнуты пунктиром, при фокусе линия становится сплошной синей.
  Под фразой - согласие, кнопка и WhatsApp; ниже в три колонки
  «Что будет дальше».

  ДОСТУПНОСТЬ. Видимых подписей у полей нет - это цена приёма, поэтому
  каждая обязана иметь aria-label; ошибки объявляются текстом под фразой
  (aria-describedby), подтверждение - в живой области (aria-live).

  🔴 ТРАНСПОРТ НЕ ПОДКЛЮЧЁН: адреса от клиники не получены, отправка
  имитируется - см. useBookingForm.ts.

  ⚠️ Красного в палитре нет намеренно: ошибки набраны --gold-deep и
  проговариваются текстом. Не добавлять красный «для заметности».
-->
<script setup lang="ts">
const { m } = useLocale()
const { name, phone, email, consent, status, errors, submit } = useBookingForm()

/* Тот же адрес, что в шапке. 🔴 Номер - заглушка до передачи номера ОАЭ */
const whatsapp = 'https://wa.me/79285030807'

const pad = (i: number) => String(i + 1).padStart(2, '0')

/** Ошибки одной строкой под фразой - у полей внутри текста места под них нет */
const errorLine = computed(() =>
  [errors.value.name, errors.value.phone, errors.value.email, errors.value.consent]
    .filter(Boolean)
    .join('. '),
)
</script>

<template>
  <PageSection id="booking-b" :label="m.booking.label" tone="paper" cross-y="5.5rem">
    <SectionTitle :text="m.booking.title" />

    <p class="bkb__lead">{{ m.booking.lead }}</p>

    <div class="bkb" aria-live="polite">
      <form v-if="status !== 'done'" class="bkb__form" novalidate @submit.prevent="submit">
        <p class="bkb__phrase">
          {{ m.booking.phrase.p1 }}
          <input
            v-model="name"
            class="bkb__input bkb__input--name"
            type="text"
            name="name"
            autocomplete="name"
            :aria-label="m.booking.form.name"
            :placeholder="m.booking.phrase.nameHint"
            :aria-invalid="!!errors.name"
            :aria-describedby="errorLine ? 'bkb-errors' : undefined"
          />.
          {{ m.booking.phrase.p2 }}
          <input
            v-model="phone"
            class="bkb__input bkb__input--phone"
            type="tel"
            name="phone"
            autocomplete="tel"
            inputmode="tel"
            :aria-label="m.booking.form.phone"
            :placeholder="m.booking.phrase.phoneHint"
            :aria-invalid="!!errors.phone"
            :aria-describedby="errorLine ? 'bkb-errors' : undefined"
          />
          {{ m.booking.phrase.p3 }}
          <input
            v-model="email"
            class="bkb__input bkb__input--email"
            type="email"
            name="email"
            autocomplete="email"
            inputmode="email"
            :aria-label="`${m.booking.form.email} (${m.booking.form.optional})`"
            :placeholder="m.booking.phrase.emailHint"
            :aria-invalid="!!errors.email"
            :aria-describedby="errorLine ? 'bkb-errors' : undefined"
          />
        </p>

        <p v-if="errorLine" id="bkb-errors" class="bkb__error">{{ errorLine }}</p>

        <div class="bkb__row">
          <div class="bkb__consent">
            <input
              id="bkb-consent"
              v-model="consent"
              class="bkb__check"
              type="checkbox"
              :aria-invalid="!!errors.consent"
            />
            <label class="bkb__consent-label" for="bkb-consent">{{ m.booking.form.consent }}</label>
          </div>

          <div class="bkb__actions">
            <MarkAction type="submit" :disabled="status === 'sending'">
              {{ status === 'sending' ? m.booking.form.sending : m.booking.form.submit }}
            </MarkAction>
            <MarkAction variant="ghost" :href="whatsapp">{{ m.action.whatsapp }}</MarkAction>
          </div>
        </div>

        <p v-if="status === 'error'" class="bkb__error">{{ m.booking.form.error }}</p>
      </form>

      <div v-else class="bkb__done">
        <p class="bkb__done-title">{{ m.booking.form.doneTitle }}</p>
        <p class="bkb__done-text">{{ m.booking.form.doneText }}</p>
      </div>
    </div>

    <!-- Что будет дальше: три колонки под фразой -->
    <div class="bkb__next">
      <p class="mono bkb__next-label">{{ m.booking.nextLabel }}</p>
      <ol class="bkb__steps">
        <li v-for="(step, i) in m.booking.next" :key="i" class="bkb__step">
          <DashedRule class="bkb__step-rule" :delay="i * 90" />
          <p class="mono bkb__step-num">{{ pad(i) }}</p>
          <p class="bkb__step-title">{{ step.title }}</p>
          <p class="bkb__step-text">{{ step.text }}</p>
        </li>
      </ol>
    </div>
  </PageSection>
</template>

<style scoped>
.bkb__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(52ch, 100%);
}

.bkb {
  margin-block-start: var(--s-10);
}

/* Фраза-анкета: антиква, поля живут прямо в строке */
.bkb__phrase {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 3.2vw, 2.9rem);
  font-weight: 300;
  line-height: 1.6;
  letter-spacing: -0.01em;
  margin: 0;
  color: var(--ink);
  max-inline-size: 28ch;
}

/*
  Поле внутри фразы: тем же шрифтом и кеглем, что фраза, снизу пунктир.
  При фокусе линия сплошная и синяя (дизайн-система, раздел 8).
*/
.bkb__input {
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
  max-inline-size: 100%;
}

.bkb__input::placeholder {
  color: var(--ink-faint);
  font-style: italic;
}

.bkb__input:focus {
  outline: none;
  background-image: linear-gradient(var(--blue), var(--blue));
  background-size: 100% 2px;
}

.bkb__input--name {
  inline-size: 7ch;
}

.bkb__input--phone {
  inline-size: 11ch;
}

.bkb__input--email {
  inline-size: 12ch;
}

.bkb__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-6);
  margin-block-start: var(--s-8);
  max-inline-size: 52rem;
}

.bkb__consent {
  display: flex;
  align-items: flex-start;
  gap: var(--s-3);
  max-inline-size: 26rem;
}

.bkb__check {
  inline-size: 1.05rem;
  block-size: 1.05rem;
  margin-block-start: 0.15rem;
  accent-color: var(--blue);
  flex: 0 0 auto;
}

.bkb__consent-label {
  font-size: var(--fs-small);
  line-height: 1.5;
  color: var(--ink-soft);
}

.bkb__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-3);
}

/* Ошибки: текстом, не только цветом. Красного в палитре нет намеренно */
.bkb__error {
  margin: var(--s-4) 0 0;
  font-size: var(--fs-small);
  line-height: 1.45;
  color: var(--gold-deep);
}

.bkb__done-title {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0 0 var(--s-3);
  color: var(--ink);
}

.bkb__done-text {
  font-size: var(--fs-body);
  line-height: 1.65;
  margin: 0;
  color: var(--ink-soft);
  max-inline-size: min(44ch, 100%);
}

/* --- Что будет дальше --- */

.bkb__next {
  margin-block-start: var(--s-16);
}

.bkb__next-label {
  margin: 0 0 var(--s-4);
}

.bkb__steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--s-8);
}

.bkb__step {
  position: relative;
  padding-block-start: var(--s-4);
  min-inline-size: 0;
}

.bkb__step-rule {
  inset-block-start: 0;
}

.bkb__step-num {
  margin: 0 0 var(--s-2);
}

.bkb__step-title {
  font-size: var(--fs-body);
  font-weight: 500;
  line-height: 1.4;
  margin: 0 0 var(--s-1);
  color: var(--ink);
}

.bkb__step-text {
  font-size: var(--fs-body);
  line-height: 1.55;
  margin: 0;
  color: var(--ink-soft);
}

@media (max-width: 900px) {
  .bkb__phrase {
    line-height: 1.75;
  }

  /* Поля на телефоне тянутся почти на строку - палец должен попадать легко */
  .bkb__input--name,
  .bkb__input--phone,
  .bkb__input--email {
    inline-size: min(14ch, 100%);
  }

  .bkb__row {
    flex-direction: column;
    align-items: flex-start;
  }

  .bkb__steps {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-6);
  }
}
</style>
