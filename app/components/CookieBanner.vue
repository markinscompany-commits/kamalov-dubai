<!--
  Согласие на статистику посещений.

  Показывается ТОЛЬКО когда счётчик реально настроен (см. useCookieConsent):
  пока кук нет, спрашивать не о чем, а лишнее окно на платном трафике - это
  прямая потеря заявок.

  Подача - язык сайта: полоса бумаги внизу экрана, пунктирная черта сверху,
  два равноправных действия. Ни предвыбранных галочек, ни «продолжая
  пользоваться, вы соглашаетесь»: по закону ОАЭ о персональных данных
  согласие - это действие человека, а не следствие того, что он листает дальше.
  Крестика «закрыть» тоже нет намеренно - закрытие без ответа читалось бы
  как молчаливое согласие.

  ⚠️ Полоса не перекрывает содержимое насовсем: она внизу, невысокая,
  и уходит сразу после ответа.
-->
<script setup lang="ts">
const { m } = useLocale()
const { showBanner, accept, decline } = useCookieConsent()
</script>

<template>
  <Transition name="ck">
    <aside v-if="showBanner" class="ck" role="region" :aria-label="m.cookies.label">
      <DashedRule class="ck__rule" orientation="h" pos="0%" :delay="0" />

      <div class="page ck__inner">
        <p class="ck__text">
          {{ m.cookies.text }}
          <NuxtLink class="ck__link" :to="m.cookies.href">{{ m.cookies.more }}</NuxtLink>
        </p>

        <div class="ck__actions">
          <MarkAction variant="ghost" @click="decline">{{ m.cookies.decline }}</MarkAction>
          <MarkAction @click="accept">{{ m.cookies.accept }}</MarkAction>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.ck {
  position: fixed;
  inset-inline: 0;
  inset-block-end: 0;
  /* Ниже попапа записи (150) и просмотрщика (140), но выше шапки (100):
     согласие не должно перекрывать целевое действие страницы */
  z-index: 120;
  background: var(--paper-raised);
}

.ck__rule {
  position: absolute;
  inset-inline: 0;
  inset-block-start: 0;
}

.ck__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-6);
  padding-block: var(--s-4);
  min-inline-size: 0;
}

.ck__text {
  margin: 0;
  min-inline-size: 0;
  /* Тот же кегль, что основной текст: обязательные сведения в мелкий серый
     не уводим - требование ST-21 п. 7.1.5 и общее правило системы */
  font-size: var(--fs-body);
  line-height: 1.5;
  color: var(--ink-soft);
  max-inline-size: min(62ch, 100%);
}

.ck__link {
  color: var(--blue);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.ck__actions {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: var(--s-3);
}

.ck__actions :deep(.action) {
  padding-block: 0.8rem;
}

/* Появление и уход - выездом снизу: полоса приходит из-за края экрана,
   а не проявляется поверх содержимого */
.ck-enter-active,
.ck-leave-active {
  transition:
    transform var(--dur-base) var(--ease-out),
    opacity var(--dur-base) var(--ease-out);
}

.ck-enter-from,
.ck-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 760px) {
  .ck__inner {
    flex-direction: column;
    align-items: stretch;
    gap: var(--s-4);
  }

  .ck__actions {
    /* Кнопки делят строку поровну - обе одинаково доступны большим пальцем */
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
