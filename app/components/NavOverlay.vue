<!--
  Меню разделов. Открывается бургером в шапке.
  Оформлено в языке сайта: пунктирные разделители, номера разделов моноширинным,
  названия — крупной антиквой.
-->
<script setup lang="ts">
interface Props {
  open: boolean
  links: { label: string; href: string }[]
}

const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

// TODO: подставить реальный номер клиники, когда клиника его передаст
const whatsapp = 'https://wa.me/79285030807'

const panel = ref<HTMLElement | null>(null)

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  (isOpen) => {
    if (typeof document === 'undefined') return
    // Пока меню открыто, страница под ним не прокручивается
    document.body.style.overflow = isOpen ? 'hidden' : ''
    if (isOpen) nextTick(() => panel.value?.focus())
  },
)

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <Transition name="nav">
    <div v-if="open" class="nav" role="dialog" aria-modal="true" aria-label="Разделы страницы">
      <div ref="panel" class="nav__panel page" tabindex="-1">
        <ul class="nav__list">
          <li v-for="(link, i) in links" :key="link.href" class="nav__item">
            <DashedRule orientation="h" pos="0" :delay="120 + i * 70" faint />
            <a class="nav__link" :href="link.href" @click="emit('close')">
              <span class="mono nav__num">[{{ String(i + 1).padStart(2, '0') }}]</span>
              <span class="nav__label">{{ link.label }}</span>
            </a>
          </li>
          <li class="nav__item nav__item--last">
            <DashedRule orientation="h" pos="0" :delay="120 + links.length * 70" faint />
          </li>
        </ul>

        <div class="nav__actions">
          <MarkAction href="#booking" @click="emit('close')">Записаться на консультацию</MarkAction>
          <MarkAction variant="ghost" :href="whatsapp">WhatsApp</MarkAction>
        </div>

        <div class="nav__foot">
          <div class="mono nav__lang">
            <button class="nav__lang-btn nav__lang-btn--on" type="button" aria-current="true">
              Ru
            </button>
            <span aria-hidden="true">/</span>
            <button class="nav__lang-btn" type="button">En</button>
          </div>
          <p class="mono nav__place">Дубай · Dubai London Hospital</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.nav {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: var(--paper-deep);
  display: flex;
  align-items: center;
}

.nav__panel {
  inline-size: 100%;
  padding-block: var(--header-h) var(--s-8);
  outline: none;
}

.nav__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav__item {
  position: relative;
}

.nav__link {
  display: flex;
  align-items: baseline;
  gap: var(--s-6);
  padding-block: clamp(var(--s-4), 2.2vh, var(--s-8));
  transition: color var(--dur-fast) var(--ease-out);
}

.nav__num {
  flex: none;
  color: var(--ink-faint);
  transition: color var(--dur-fast) var(--ease-out);
}

.nav__label {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(1.75rem, 5vw, 3.5rem);
  line-height: 1.1;
}

.nav__link:hover .nav__num {
  color: var(--plum);
}

.nav__link:hover .nav__label {
  color: var(--plum-deep);
}

.nav__item--last {
  block-size: 1px;
}

.nav__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-4);
  padding-block-start: var(--s-12);
}

.nav__foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--s-4);
  padding-block-start: var(--s-8);
}

.nav__lang {
  display: flex;
  align-items: center;
  gap: var(--s-2);
}

.nav__lang-btn {
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  color: var(--ink-faint);
  transition: color var(--dur-fast) var(--ease-out);
}

.nav__lang-btn--on,
.nav__lang-btn:hover {
  color: var(--ink);
}

.nav__place {
  margin: 0;
}

/* --- Появление --- */

.nav-enter-active,
.nav-leave-active {
  transition: opacity var(--dur-base) var(--ease-out);
}

.nav-enter-from,
.nav-leave-to {
  opacity: 0;
}
</style>
