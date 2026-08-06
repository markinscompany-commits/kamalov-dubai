<!--
  Блок [11] «Заявка и контакты» - подача «Анкета».
  Вариант Б, выбран Марком 06.08 из двух собранных вживую; вариант А
  «Карта записи» снят, он в истории git (коммит 2da5b87, файл
  BookingCardSection.vue).

  ПОДАЧА. Форма - фраза крупной антиквой, поля стоят прямо внутри неё:
  человек не заполняет анкету, а дописывает предложение о себе.

  ⚠️ РАЗБИВКА ПО СТРОКАМ - ПРАВКА МАРКА 06.08, НЕ МЕНЯТЬ БЕЗ ЕГО КОМАНДЫ:
      Меня зовут [имя........................]
      Свяжитесь со мной по
      телефону [номер.......................]
      почте [адрес..........................]
  Каждое поле заканчивает СВОЮ строку и забирает весь её остаток - это запас
  под длинные данные. В первой версии поля стояли в потоке фразы с фиксированной
  шириной, и тесты Марка показали: сколько-нибудь длинное имя, номер или почта
  не помещались и не были видны целиком.

  Ниже фразы - строка действий: кнопки слева, ЧЕКБОКС СОГЛАСИЯ ПРАВЕЕ КНОПОК
  (правка Марка), в подписи согласия - ссылка на страницу политики (/privacy).

  ДОСТУПНОСТЬ. Видимые слова фразы связаны с полями как label (клик ставит
  курсор), но полное имя поля даёт aria-label - «телефону» сам по себе ничего
  не говорит; ошибки объявляются текстом под фразой (aria-describedby),
  подтверждение - в живой области (aria-live).

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
  <PageSection id="booking" :label="m.booking.label" tone="paper" cross-y="5.5rem">
    <SectionTitle :text="m.booking.title" />

    <p class="bkb__lead">{{ m.booking.lead }}</p>

    <div class="bkb" aria-live="polite">
      <form v-if="status !== 'done'" class="bkb__form" novalidate @submit.prevent="submit">
        <div class="bkb__phrase">
          <p class="bkb__line">
            <label class="bkb__text" for="bkb-name">{{ m.booking.phrase.l1 }}</label>
            <input
              id="bkb-name"
              v-model="name"
              class="bkb__input"
              type="text"
              name="name"
              autocomplete="name"
              :aria-label="m.booking.form.name"
              :placeholder="m.booking.phrase.nameHint"
              :aria-invalid="!!errors.name"
              :aria-describedby="errorLine ? 'bkb-errors' : undefined"
            />
          </p>

          <p class="bkb__line">{{ m.booking.phrase.l2 }}</p>

          <p class="bkb__line">
            <label class="bkb__text" for="bkb-phone">{{ m.booking.phrase.l3 }}</label>
            <input
              id="bkb-phone"
              v-model="phone"
              class="bkb__input"
              type="tel"
              name="phone"
              autocomplete="tel"
              inputmode="tel"
              :aria-label="m.booking.form.phone"
              :placeholder="m.booking.phrase.phoneHint"
              :aria-invalid="!!errors.phone"
              :aria-describedby="errorLine ? 'bkb-errors' : undefined"
            />
          </p>

          <p class="bkb__line">
            <label class="bkb__text" for="bkb-email">{{ m.booking.phrase.l4 }}</label>
            <input
              id="bkb-email"
              v-model="email"
              class="bkb__input"
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
        </div>

        <p v-if="errorLine" id="bkb-errors" class="bkb__error">{{ errorLine }}</p>

        <!-- Кнопки слева, согласие правее кнопок - правка Марка 06.08 -->
        <div class="bkb__row">
          <div class="bkb__actions">
            <MarkAction type="submit" :disabled="status === 'sending'">
              {{ status === 'sending' ? m.booking.form.sending : m.booking.form.submit }}
            </MarkAction>
            <MarkAction variant="ghost" :href="whatsapp">{{ m.action.whatsapp }}</MarkAction>
          </div>

          <div class="bkb__consent">
            <input
              id="bkb-consent"
              v-model="consent"
              class="bkb__check"
              type="checkbox"
              :aria-label="`${m.booking.form.consentPre} ${m.booking.form.consentLink}`"
              :aria-invalid="!!errors.consent"
            />
            <!-- Ссылка стоит ВНЕ label: клик по ней должен вести на политику,
                 а не щёлкать чекбокс. Полное имя чекбокса даёт aria-label -->
            <span class="bkb__consent-label">
              <label for="bkb-consent">{{ m.booking.form.consentPre }}</label>
              {{ ' ' }}
              <NuxtLink class="bkb__consent-link" to="/privacy">{{ m.booking.form.consentLink }}</NuxtLink>
            </span>
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

/*
  Фраза-анкета. Типографика стоит на КОНТЕЙНЕРЕ, а ширина задана в ch -
  тогда ch считается от кегля самой фразы. На этом уже обожглись: ширина
  в ch на контейнере с мелким шрифтом сжала строку втрое, и поле имени
  осталось на 99px.
*/
.bkb__phrase {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 3.2vw, 2.9rem);
  font-weight: 300;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--ink);
  max-inline-size: min(27ch, 100%);
}

/*
  Строка фразы: текст + поле, поле забирает ВЕСЬ остаток строки -
  запас под длинные данные (правка Марка, см. шапку файла).
*/
.bkb__line {
  display: flex;
  align-items: baseline;
  gap: 0.55ch;
  margin: 0;
  min-inline-size: 0;
}

.bkb__line + .bkb__line {
  margin-block-start: 0.4em;
}

.bkb__text {
  flex: 0 0 auto;
}

/*
  Поле внутри фразы: тем же шрифтом и кеглем, снизу пунктир.
  При фокусе линия сплошная и синяя (дизайн-система, раздел 8).
*/
.bkb__input {
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

.bkb__input::placeholder {
  color: var(--ink-faint);
  font-style: italic;
}

.bkb__input:focus {
  outline: none;
  background-image: linear-gradient(var(--blue), var(--blue));
  background-size: 100% 2px;
}

/* Кнопки слева, согласие правее кнопок (правка Марка) */
.bkb__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-6);
  margin-block-start: var(--s-8);
}

.bkb__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-3);
}

.bkb__consent {
  display: flex;
  align-items: flex-start;
  gap: var(--s-3);
  max-inline-size: 24rem;
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

/* Ссылка на политику: синий = взаимодействие (дизайн-система, раздел 1) */
.bkb__consent-link {
  color: var(--blue);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.bkb__consent-link:hover {
  color: var(--blue-deep);
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
