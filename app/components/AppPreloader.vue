<!--
  Заставка при загрузке и при смене языка.

  Собрана в языке сайта: чернильное полотно, имя врача антиквой и линия разметки,
  которая прочерчивается под ним слева направо. Уходит тем же движением, что и меню —
  полотно сворачивается вверх, открывая страницу.

  Никаких процентов и кругов: это не «идёт загрузка», а короткая пауза перед
  первым экраном.
-->
<script setup lang="ts">
const { visible } = usePreloader()
</script>

<template>
  <Transition name="pre">
    <div v-if="visible" class="pre" role="status" aria-live="polite">
      <div class="pre__inner">
        <span class="pre__mark">
          <span class="pre__mark-dr">dr.</span>
          <span>Kamalov</span>
        </span>
        <span class="pre__rule" aria-hidden="true" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.pre {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  background: var(--ink);
  color: var(--paper);
}

.pre__inner {
  display: grid;
  justify-items: center;
  gap: var(--s-6);
  /* Ширина линии равна ширине имени — линия «подчёркивает» именно его */
  inline-size: min(20rem, 62vw);
}

.pre__mark {
  display: inline-flex;
  align-items: baseline;
  gap: 0.24em;
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(1.75rem, 6vw, 2.5rem);
  line-height: 1;
  letter-spacing: 0.04em;
  animation: pre-mark 700ms var(--ease-out) both;
}

.pre__mark-dr {
  opacity: 0.6;
}

/* Пунктир того же шага, что вся разметка сайта */
.pre__rule {
  inline-size: 100%;
  block-size: 1px;
  background-image: repeating-linear-gradient(
    to right,
    color-mix(in srgb, var(--paper) 55%, transparent) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  /* Прочерчивается и остаётся: clip-path не сжимает штрихи, шаг пунктира не плывёт */
  animation: pre-draw 1100ms var(--ease-draw) 260ms both;
}

@keyframes pre-mark {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes pre-draw {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0);
  }
}

/* Уход — как у меню: полотно сворачивается вверх, содержимое уходит вперёд него */
.pre-leave-active {
  transition: clip-path 620ms var(--ease-out);
}

.pre-leave-to {
  clip-path: inset(0 0 100% 0);
}

.pre-leave-active .pre__inner {
  transition:
    opacity 240ms var(--ease-out),
    transform 420ms var(--ease-out);
}

.pre-leave-to .pre__inner {
  opacity: 0;
  transform: translateY(-14px);
}

@media (prefers-reduced-motion: reduce) {
  .pre__mark,
  .pre__rule {
    animation-duration: 0.01ms;
  }

  .pre-leave-active {
    transition-duration: 0.01ms;
  }
}

/*
  Страховка на случай, если скрипты не выполнились: заставка сама уходит через 8 секунд.
  Сама страница отдаётся готовым HTML и без скриптов читается — запирать её нельзя.
*/
@media (scripting: none) {
  .pre {
    animation: pre-failsafe 1ms 8s forwards;
  }
}

@keyframes pre-failsafe {
  to {
    opacity: 0;
    visibility: hidden;
  }
}
</style>
