<!--
  Кнопка. Два вида:
  · primary — сплошная заливка чернилами, основное действие «Записаться»
  · ghost   — прозрачная, второстепенное действие

  Эффект у обеих один: в покое видны четыре угловые скобки, при наведении они
  вытягиваются и замыкаются в рамку. Рамка ПУНКТИРНАЯ — тем же шагом, что и вся
  разметка сайта, иначе кнопка выпадает из общего языка.

  У primary скобки идут снаружи с отступом: поверх тёмной заливки они бы не читались.

  Длина скобок вынесена в зарегистрированное свойство --bracket — только так её
  можно анимировать.
-->
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'ghost'
  href?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  href: undefined,
})
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :type="href ? undefined : 'button'"
    class="action"
    :class="`action--${variant}`"
  >
    <span class="action__frame" aria-hidden="true" />
    <span class="action__label"><slot /></span>
  </component>
</template>

<style scoped>
.action {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-2);
  padding-block: 1.05rem;
  padding-inline: clamp(1.25rem, 2.4vw, 2.25rem);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: center;
  white-space: nowrap;
  transition:
    background-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);
}

.action__label {
  position: relative;
  z-index: 1;
}

/* --- Уголки → пунктирная рамка --- */

.action__frame {
  position: absolute;
  --bracket: 14px;
  --bracket-color: color-mix(in srgb, var(--ink) 45%, transparent);
  --dash-x: repeating-linear-gradient(
    to right,
    var(--bracket-color) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  --dash-y: repeating-linear-gradient(
    to bottom,
    var(--bracket-color) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  background:
    var(--dash-x) left top / var(--bracket) 1px no-repeat,
    var(--dash-y) left top / 1px var(--bracket) no-repeat,
    var(--dash-x) right top / var(--bracket) 1px no-repeat,
    var(--dash-y) right top / 1px var(--bracket) no-repeat,
    var(--dash-x) left bottom / var(--bracket) 1px no-repeat,
    var(--dash-y) left bottom / 1px var(--bracket) no-repeat,
    var(--dash-x) right bottom / var(--bracket) 1px no-repeat,
    var(--dash-y) right bottom / 1px var(--bracket) no-repeat;
  transition:
    --bracket var(--dur-base) var(--ease-out),
    --bracket-color var(--dur-base) var(--ease-out);
}

.action:hover .action__frame,
.action:focus-visible .action__frame {
  --bracket: 50%;
  --bracket-color: var(--ink);
}

/* --- Основное действие --- */

.action--primary {
  background: var(--ink);
  color: var(--paper);
}

.action--primary:hover {
  background: var(--plum-deep);
}

/* Скобки снаружи: на тёмной заливке они бы пропали */
.action--primary .action__frame {
  inset: -7px;
}

/* --- Второстепенное --- */

.action--ghost {
  color: var(--ink);
}

.action--ghost .action__frame {
  inset: 0;
}

/* На узком экране длинная подпись важнее, чем строка в одну линию */
@media (max-width: 480px) {
  .action {
    white-space: normal;
  }
}
</style>
