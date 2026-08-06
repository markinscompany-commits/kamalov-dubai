<!--
  Кнопка. Два вида:
  · primary — сплошная заливка, основное действие «Записаться»
  · ghost   — прозрачная, с угловыми скобками (общий приём `.brackets` из base.css)

  Цвета берутся из --action-* : на светлой половине они одни, на тёмной другие,
  и переопределяются снаружи, а не отдельным вариантом компонента.
-->
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'ghost'
  href?: string
  /** Для кнопки в форме: type="submit". Ссылок не касается */
  type?: 'button' | 'submit'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  href: undefined,
  type: 'button',
})
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :type="href ? undefined : type"
    class="action"
    :class="[`action--${variant}`, { brackets: variant === 'ghost' }]"
  >
    <span class="action__label"><slot /></span>
  </component>
</template>

<style scoped>
.action {
  --action-fill: var(--ink);
  /* При наведении глубокие чернила светлеют ровно до фирменного синего:
     цвет клиники появляется в тот момент, когда человек тянется к кнопке */
  --action-fill-hover: var(--blue);
  --action-on-fill: var(--paper);
  --action-line: var(--ink);

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

/* --- Основное действие --- */

.action--primary {
  background: var(--action-fill);
  color: var(--action-on-fill);
}

.action--primary:hover {
  background: var(--action-fill-hover);
}

/* --- Второстепенное --- */

.action--ghost {
  color: var(--action-line);
}

/* Пока заявка отправляется, кнопка заблокирована - без прыжков размера */
.action:disabled {
  opacity: 0.55;
  cursor: default;
  pointer-events: none;
}

/* На узком экране длинная подпись важнее, чем строка в одну линию */
@media (max-width: 480px) {
  .action {
    white-space: normal;
  }
}
</style>
