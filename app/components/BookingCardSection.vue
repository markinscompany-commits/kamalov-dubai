<!--
  Блок [11] «Заявка и контакты» - подача «Карта записи». ВАРИАНТ А на выборе
  Марка, второй вариант - BookingPhraseSection.vue («Анкета»). Непринятый
  снимается, он останется в истории git.

  ПОДАЧА. Разворот на две колонки: слева сама форма - поля как строки в
  медицинской карте, без рамок-коробок, только нижний пунктир, который при
  фокусе становится сплошным синим (дизайн-система, раздел 8). Справа -
  «Что будет дальше»: три шага, снимающие неизвестность после отправки,
  и прямой канал WhatsApp для тех, кому проще написать самому.

  ДОСТУПНОСТЬ. Подписи связаны с полями через for/id, ошибки объявляются
  текстом (aria-describedby + aria-invalid), а не только цветом; подтверждение
  и ошибка отправки - в живой области (aria-live). Это единственное целевое
  действие страницы - форма обязана работать с клавиатуры.

  🔴 ТРАНСПОРТ НЕ ПОДКЛЮЧЁН: адреса от клиники не получены, отправка
  имитируется - см. useBookingForm.ts.

  ⚠️ Красного в палитре нет намеренно: ошибки набраны --gold-deep и
  проговариваются текстом. Не добавлять красный «для заметности».
-->
<script setup lang="ts">
const { m } = useLocale()
const { name, phone, email, consent, status, errors, submit } = useBookingForm()

/* Тот же адрес, что в шапке и шаге 01 маршрута. 🔴 Номер - заглушка до
   передачи номера ОАЭ клиникой (client-request, строка 3.2) */
const whatsapp = 'https://wa.me/79285030807'

const pad = (i: number) => String(i + 1).padStart(2, '0')
</script>

<template>
  <PageSection id="booking" :label="m.booking.label" tone="paper" cross-y="5.5rem">
    <SectionTitle :text="m.booking.title" />

    <p class="bka__lead">{{ m.booking.lead }}</p>

    <div class="bka">
      <!-- Левая колонка: форма. При отправленной заявке - подтверждение -->
      <div class="bka__form-col" aria-live="polite">
        <form v-if="status !== 'done'" class="bka__form" novalidate @submit.prevent="submit">
          <div class="bka__field">
            <label class="mono bka__label" for="bka-name">{{ m.booking.form.name }}</label>
            <input
              id="bka-name"
              v-model="name"
              class="bka__input"
              type="text"
              name="name"
              autocomplete="name"
              :aria-invalid="!!errors.name"
              :aria-describedby="errors.name ? 'bka-name-err' : undefined"
            />
            <p v-if="errors.name" id="bka-name-err" class="bka__error">{{ errors.name }}</p>
          </div>

          <div class="bka__field">
            <label class="mono bka__label" for="bka-phone">{{ m.booking.form.phone }}</label>
            <input
              id="bka-phone"
              v-model="phone"
              class="bka__input"
              type="tel"
              name="phone"
              autocomplete="tel"
              inputmode="tel"
              :aria-invalid="!!errors.phone"
              :aria-describedby="errors.phone ? 'bka-phone-err' : undefined"
            />
            <p v-if="errors.phone" id="bka-phone-err" class="bka__error">{{ errors.phone }}</p>
          </div>

          <div class="bka__field">
            <label class="mono bka__label" for="bka-email">
              {{ m.booking.form.email }}
              <span class="bka__optional">- {{ m.booking.form.optional }}</span>
            </label>
            <input
              id="bka-email"
              v-model="email"
              class="bka__input"
              type="email"
              name="email"
              autocomplete="email"
              inputmode="email"
              :aria-invalid="!!errors.email"
              :aria-describedby="errors.email ? 'bka-email-err' : undefined"
            />
            <p v-if="errors.email" id="bka-email-err" class="bka__error">{{ errors.email }}</p>
          </div>

          <div class="bka__consent">
            <input
              id="bka-consent"
              v-model="consent"
              class="bka__check"
              type="checkbox"
              :aria-invalid="!!errors.consent"
              :aria-describedby="errors.consent ? 'bka-consent-err' : undefined"
            />
            <label class="bka__consent-label" for="bka-consent">{{ m.booking.form.consent }}</label>
          </div>
          <p v-if="errors.consent" id="bka-consent-err" class="bka__error">{{ errors.consent }}</p>

          <div class="bka__actions">
            <MarkAction type="submit" :disabled="status === 'sending'">
              {{ status === 'sending' ? m.booking.form.sending : m.booking.form.submit }}
            </MarkAction>
          </div>

          <p v-if="status === 'error'" class="bka__error bka__error--send">{{ m.booking.form.error }}</p>
        </form>

        <div v-else class="bka__done">
          <p class="bka__done-title">{{ m.booking.form.doneTitle }}</p>
          <p class="bka__done-text">{{ m.booking.form.doneText }}</p>
        </div>
      </div>

      <!-- Правая колонка: что будет дальше + прямой канал. Якорь #contacts -
         на неё ведёт пункт меню «Контакты» -->
      <div id="contacts" class="bka__aside">
        <p class="mono bka__aside-label">{{ m.booking.nextLabel }}</p>

        <ol class="bka__steps">
          <li v-for="(step, i) in m.booking.next" :key="i" class="bka__step">
            <DashedRule class="bka__step-rule" :delay="i * 90" />
            <p class="mono bka__step-num">{{ pad(i) }}</p>
            <div class="bka__step-body">
              <p class="bka__step-title">{{ step.title }}</p>
              <p class="bka__step-text">{{ step.text }}</p>
            </div>
          </li>
        </ol>

        <div class="bka__direct">
          <p class="mono bka__aside-label">{{ m.booking.altLabel }}</p>
          <p class="bka__direct-text">{{ m.booking.altText }}</p>
          <MarkAction variant="ghost" :href="whatsapp">{{ m.action.whatsapp }}</MarkAction>
        </div>
      </div>
    </div>
  </PageSection>
</template>

<style scoped>
.bka__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(52ch, 100%);
}

.bka {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: clamp(2.5rem, 5vw, 5.5rem);
  margin-block-start: var(--s-8);
  align-items: start;
}

/* --- Форма --- */

.bka__form {
  display: flex;
  flex-direction: column;
  gap: var(--s-6);
  max-inline-size: 34rem;
}

.bka__field {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
  min-inline-size: 0;
}

.bka__label {
  color: var(--ink-soft);
}

.bka__optional {
  text-transform: none;
  letter-spacing: 0.04em;
}

/*
  Поле без рамки-коробки: только нижняя пунктирная линия, при фокусе она
  становится сплошной и синей (дизайн-система, раздел 8). Линия - фоном,
  а не border: у штрихового бордера шаг пунктира гуляет.
*/
.bka__input {
  border: 0;
  background: transparent;
  padding-block: 0.55rem 0.65rem;
  font-family: var(--font-text);
  font-size: var(--fs-body);
  color: var(--ink);
  background-image: repeating-linear-gradient(
    to right,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  background-size: 100% var(--rule-w);
  background-position: 0 100%;
  background-repeat: no-repeat;
  border-radius: 0;
}

/* Фокус показывает сама линия - это и есть его видимая замена, по системе.
   Толщина растёт до 2px, чтобы фокус был виден и боковым зрением */
.bka__input:focus {
  outline: none;
  background-image: linear-gradient(var(--blue), var(--blue));
  background-size: 100% 2px;
}

.bka__consent {
  display: flex;
  align-items: flex-start;
  gap: var(--s-3);
}

.bka__check {
  inline-size: 1.05rem;
  block-size: 1.05rem;
  margin-block-start: 0.15rem;
  accent-color: var(--blue);
  flex: 0 0 auto;
}

.bka__consent-label {
  font-size: var(--fs-small);
  line-height: 1.5;
  color: var(--ink-soft);
}

.bka__actions {
  margin-block-start: var(--s-2);
}

/* Ошибки: текстом, не только цветом. Красного в палитре нет намеренно */
.bka__error {
  margin: 0;
  font-size: var(--fs-small);
  line-height: 1.45;
  color: var(--gold-deep);
}

.bka__error--send {
  margin-block-start: var(--s-2);
}

/* Подтверждение вместо формы */
.bka__done-title {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0 0 var(--s-3);
  color: var(--ink);
}

.bka__done-text {
  font-size: var(--fs-body);
  line-height: 1.65;
  margin: 0;
  color: var(--ink-soft);
  max-inline-size: min(44ch, 100%);
}

/* --- Правая колонка --- */

.bka__aside {
  min-inline-size: 0;
  /* Пункт меню «Контакты» ведёт сюда - якорь не должен нырять под шапку */
  scroll-margin-block-start: calc(var(--header-h) + var(--s-4));
}

.bka__aside-label {
  margin: 0 0 var(--s-4);
}

.bka__steps {
  list-style: none;
  margin: 0 0 var(--s-8);
  padding: 0;
}

.bka__step {
  position: relative;
  display: grid;
  grid-template-columns: 2.2rem minmax(0, 1fr);
  gap: var(--s-4);
  padding-block: var(--s-4);
}

.bka__step-rule {
  inset-block-start: 0;
}

.bka__step-num {
  margin: 0;
  padding-block-start: 0.3rem;
}

.bka__step-title {
  font-size: var(--fs-body);
  font-weight: 500;
  line-height: 1.4;
  margin: 0 0 var(--s-1);
  color: var(--ink);
}

.bka__step-text {
  font-size: var(--fs-body);
  line-height: 1.55;
  margin: 0;
  color: var(--ink-soft);
}

.bka__direct-text {
  font-size: var(--fs-body);
  line-height: 1.55;
  margin: 0 0 var(--s-4);
  color: var(--ink-soft);
}

@media (max-width: 900px) {
  .bka {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-12);
  }

  .bka__form {
    max-inline-size: none;
  }
}
</style>
