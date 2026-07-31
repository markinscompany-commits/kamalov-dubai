<!--
  Кнопка. Два вида:
  · primary — сплошная заливка чернилами, основное действие «Записаться»
  · ghost   — четыре угловые скобки, при наведении они вытягиваются и замыкаются в рамку

  Скобки нарисованы восемью градиентами на псевдоэлементе, длина вынесена в
  зарегистрированное свойство --bracket — только так её можно анимировать.
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
  transition: background-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);
}

.action__label {
  position: relative;
  z-index: 1;
}

/* --- Основное действие --- */

.action--primary {
  background: var(--ink);
  color: var(--paper);
}

.action--primary:hover {
  background: var(--plum-deep);
}

/* --- Второстепенное: уголки → обводка --- */

.action--ghost {
  color: var(--ink);
}

.action--ghost::before {
  content: '';
  position: absolute;
  inset: 0;
  --bracket: 14px;
  --bracket-color: color-mix(in srgb, var(--ink) 45%, transparent);
  --c: var(--bracket-color);
  background:
    linear-gradient(var(--c), var(--c)) left top / var(--bracket) 1px no-repeat,
    linear-gradient(var(--c), var(--c)) left top / 1px var(--bracket) no-repeat,
    linear-gradient(var(--c), var(--c)) right top / var(--bracket) 1px no-repeat,
    linear-gradient(var(--c), var(--c)) right top / 1px var(--bracket) no-repeat,
    linear-gradient(var(--c), var(--c)) left bottom / var(--bracket) 1px no-repeat,
    linear-gradient(var(--c), var(--c)) left bottom / 1px var(--bracket) no-repeat,
    linear-gradient(var(--c), var(--c)) right bottom / var(--bracket) 1px no-repeat,
    linear-gradient(var(--c), var(--c)) right bottom / 1px var(--bracket) no-repeat;
  transition:
    --bracket var(--dur-base) var(--ease-out),
    --bracket-color var(--dur-base) var(--ease-out);
}

.action--ghost:hover::before,
.action--ghost:focus-visible::before {
  --bracket: 50%;
  --bracket-color: var(--ink);
}

.action--ghost:hover {
  color: var(--ink);
}

/* На узком экране длинная подпись важнее, чем строка в одну линию */
@media (max-width: 480px) {
  .action {
    white-space: normal;
  }
}
</style>
