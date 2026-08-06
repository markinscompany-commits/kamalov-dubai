<!--
  Подвал. Сервисная зона, а не смысловой блок - собирается без вариантов
  подачи. Чернильная полоса: логотип тем же приёмом, что в шапке (латиница
  в угловых скобках), справа mono-строка места и года.

  🔴 К ЗАПУСКУ СЮДА ОБЯЗАТЕЛЬНО ВСТАЮТ (этап 5 плана, обе строки - в таблице
  запроса клинике):
  · номер рекламной лицензии MOH (client-request, строка 3.1) - так делают
    10 из 13 изученных клиник Дубая;
  · ссылка на политику конфиденциальности (страница пишется под PDPL ОАЭ).
  Без них подвал намеренно короткий - пустых заглушек «номер будет позже»
  на странице не ставим.
-->
<script setup lang="ts">
const { m } = useLocale()
</script>

<template>
  <footer class="footer">
    <div class="page footer__inner">
      <p class="footer__logo brackets" aria-hidden="true">dr. Kamalov</p>
      <div class="footer__meta">
        <p class="mono footer__line">{{ m.footer.name }}</p>
        <p class="mono footer__line">{{ m.footer.place }}</p>
        <p class="mono footer__line">
          <NuxtLink class="footer__link" to="/privacy">{{ m.footer.policy }}</NuxtLink>
        </p>
        <p class="mono footer__line">{{ m.footer.rights }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--ink);
  color: var(--paper);
  padding-block: clamp(2.5rem, 5vh, 4rem);
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--s-8);
}

.footer__logo {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 300;
  letter-spacing: 0.02em;
  margin: 0;
  padding: 0.35rem 0.7rem;
}

.footer__meta {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
  text-align: end;
}

/* .mono задаёт свой приглушённый цвет - на чернилах перебиваем явно
   (грабли из шапки, design-system.md раздел 2) */
.footer__line {
  margin: 0;
  color: var(--paper);
  opacity: 0.75;
}

.footer__link {
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.footer__link:hover {
  opacity: 1;
  color: var(--gold-light);
}

@media (max-width: 700px) {
  .footer__inner {
    flex-direction: column;
  }

  .footer__meta {
    text-align: start;
  }
}
</style>
