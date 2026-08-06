<!--
  Страница политики конфиденциальности (/privacy). Ссылка на неё стоит
  у чекбокса согласия в форме заявки и в подвале.

  🔴 ТЕКСТ - ЧЕРНОВИК ДО УТВЕРЖДЕНИЯ КЛИНИКОЙ: за содержание отвечает
  медицинский директор (ST-21, разд. 7). Написан по факту работы сайта.
  При подключении веб-аналитики (этап 5) дополняется разделом о статистике.
  Реквизиты оператора данных добавляет клиника.

  Общая шапка сайта на этой странице СКРЫТА (app.vue): её пункты - якоря
  разделов главной и на /privacy вели бы в никуда. Вместо неё своя верхняя
  строка: логотип-ссылка на главную и переключатель языка.
-->
<script setup lang="ts">
import { locales } from '~/i18n/messages'

const { m, locale, setLocale } = useLocale()

useHead(() => ({
  htmlAttrs: { lang: locale.value },
  title: `${m.value.privacy.title} - dr. Kamalov`,
  meta: [{ name: 'robots', content: 'noindex' }],
}))
</script>

<template>
  <main class="pp">
    <div class="page pp__bar">
      <NuxtLink to="/" class="pp__logo brackets">dr. Kamalov</NuxtLink>

      <div class="pp__langs" role="group" :aria-label="m.nav.language">
        <button
          v-for="l in locales"
          :key="l.code"
          type="button"
          class="mono pp__lang"
          :class="{ 'is-active': l.code === locale }"
          @click="setLocale(l.code)"
        >
          {{ l.label }}
        </button>
      </div>
    </div>

    <article class="page pp__doc">
      <h1 class="pp__title">{{ m.privacy.title }}</h1>
      <p class="pp__lead">{{ m.privacy.lead }}</p>

      <section v-for="(s, i) in m.privacy.sections" :key="i" class="pp__section">
        <DashedRule class="pp__rule" :delay="i * 60" />
        <h2 class="pp__h">{{ s.h }}</h2>
        <p class="pp__p">{{ s.p }}</p>
      </section>

      <p class="mono pp__note">{{ m.privacy.note }}</p>

      <NuxtLink to="/" class="pp__back">&larr; {{ m.privacy.back }}</NuxtLink>
    </article>

    <SiteFooter />
  </main>
</template>

<style scoped>
.pp {
  min-block-size: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--paper);
}

.pp__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-6);
  padding-block: var(--s-6);
}

.pp__logo {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 300;
  letter-spacing: 0.02em;
  color: var(--ink);
  text-decoration: none;
  padding: 0.35rem 0.7rem;
}

.pp__langs {
  display: flex;
  gap: var(--s-2);
}

.pp__lang {
  border: 0;
  background: none;
  padding: 0.3rem 0.45rem;
  cursor: pointer;
  color: var(--ink-soft);
}

.pp__lang.is-active {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.pp__doc {
  flex: 1;
  padding-block: clamp(2.5rem, 6vh, 5rem) clamp(4rem, 9vh, 7rem);
  max-inline-size: calc(66ch + 2 * var(--page-pad));
  margin-inline: 0;
}

.pp__title {
  font-family: var(--font-display);
  font-size: var(--fs-h1);
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin: 0 0 var(--s-6);
  color: var(--ink);
}

.pp__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  margin: 0 0 var(--s-12);
  color: var(--ink);
  max-inline-size: min(52ch, 100%);
}

.pp__section {
  position: relative;
  padding-block: var(--s-6);
}

.pp__rule {
  inset-block-start: 0;
}

.pp__h {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 300;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0 0 var(--s-3);
  color: var(--ink);
}

.pp__p {
  font-size: var(--fs-body);
  line-height: 1.65;
  margin: 0;
  color: var(--ink-soft);
  max-inline-size: min(58ch, 100%);
}

.pp__note {
  margin: var(--s-8) 0 0;
}

.pp__back {
  display: inline-block;
  margin-block-start: var(--s-8);
  font-size: var(--fs-body);
  color: var(--blue);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.pp__back:hover {
  color: var(--blue-deep);
}
</style>
