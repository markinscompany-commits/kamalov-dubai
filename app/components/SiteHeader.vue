<script setup lang="ts">
const nav = [
  { label: 'О докторе', href: '#doctor' },
  { label: 'Ринопластика', href: '#rhinoplasty' },
  { label: 'Септопластика', href: '#septoplasty' },
  { label: 'Контакты', href: '#contacts' },
]
</script>

<template>
  <header class="header">
    <a class="header__mark" href="#top">
      <span class="header__mark-name">Эльдар Камалов</span>
    </a>

    <nav class="header__nav mono" aria-label="Разделы страницы">
      <a v-for="item in nav" :key="item.href" class="header__link" :href="item.href">
        {{ item.label }}
      </a>
    </nav>

    <div class="header__lang mono">
      <button class="header__lang-btn header__lang-btn--on" type="button" aria-current="true">Ru</button>
      <span class="header__lang-sep" aria-hidden="true">/</span>
      <button class="header__lang-btn" type="button">En</button>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-8);
  padding-block: var(--s-6);
}

.header__mark-name {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.header__nav {
  display: flex;
  gap: var(--s-8);
}

.header__link {
  position: relative;
  padding-block-end: 3px;
  color: var(--ink-soft);
  transition: color var(--dur-fast) var(--ease-out);
}

.header__link::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  inset-block-end: 0;
  block-size: 1px;
  background-image: repeating-linear-gradient(
    to right,
    var(--ink) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  clip-path: inset(0 100% 0 0);
  transition: clip-path var(--dur-base) var(--ease-out);
}

.header__link:hover {
  color: var(--ink);
}

.header__link:hover::after {
  clip-path: inset(0 0 0 0);
}

.header__lang {
  display: flex;
  align-items: center;
  gap: var(--s-2);
}

.header__lang-btn {
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  color: var(--ink-faint);
  transition: color var(--dur-fast) var(--ease-out);
}

.header__lang-btn:hover {
  color: var(--ink);
}

.header__lang-btn--on {
  color: var(--ink);
}

.header__lang-sep {
  color: var(--ink-faint);
}

@media (max-width: 900px) {
  .header__nav {
    display: none;
  }
}
</style>
