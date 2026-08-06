<!--
  Блок [08] «Восстановление» - подача «Горизонт». ВАРИАНТ Б на выборе Марка,
  первый вариант - RecoveryScaleSection.vue («Шкала»). Непринятый снимается,
  он останется в истории git.

  ПОДАЧА. Через всю страницу идёт горизонтальная ось времени. Этапы стоят
  над и под осью через один, каждый связан с ней коротким пунктирным отводом
  и кольцом-отметкой (кольцо, не крестик: крестики - язык маршрута [07],
  у оси свой знак). Когда блок появляется на экране, ось прочерчивается
  слева направо, и этапы проявляются каскадом вслед за ней: верхние
  поднимаются от оси, нижние опускаются.

  НА ТЕЛЕФОНЕ ось остаётся горизонтальной - лента с боковой прокруткой
  и снапом: этапы листаются пальцем вдоль оси, края растворяются дымками
  (приём лент из манифеста). Время читается движением вдоль, а не столбиком.

  Чем отличается от соседей: [07] - вертикальная ломаная, зигзаг по сетке;
  здесь - строгая горизонталь через всю ширину, единственная на странице.

  ⚠️ Появление - переходами к состоянию .is-live, не «замершими» анимациями
  (правило манифеста для iOS Safari). Ось рисуется ОДИН раз при появлении.

  ⚠️ ДВА ТРЕБОВАНИЯ РЕГУЛЯТОРА, КОТОРЫЕ НЕЛЬЗЯ НАРУШИТЬ ПРИ ПРАВКАХ:
  1. Оговорка об индивидуальности - ТЕМ ЖЕ КЕГЛЕМ, что основной текст
     (ST-21 п. 9.6 и 7.1.5). Увести в мелкий серый нельзя.
  2. Сроки - ориентир, не обещание: только «обычно», «зависит».

  🔴 САМИ ЦИФРЫ - ЗАГЛУШКА до подтверждения доктором, см. messages.ts.

  Разметки (узел + 4 луча) в блоке нет: ось сама - линия, вторая система
  рядом лишняя (то же решение, что в [07]).
-->
<script setup lang="ts">
const { m } = useLocale()

const trackEl = ref<HTMLElement | null>(null)
const isLive = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isLive.value = true
    return
  }
  /*
    Порог НИЗКИЙ намеренно: доля видимости считается от всей площади дорожки,
    а на телефоне дорожка - широкая лента, из которой в экран помещается ~26%.
    Порог 0.25 там почти недостижим - этапы оставались невидимыми.
  */
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        isLive.value = true
        observer?.disconnect()
      }
    },
    { threshold: 0.08 },
  )
  if (trackEl.value) observer.observe(trackEl.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <PageSection id="recovery-b" :label="m.recovery.label" tone="deep" no-rules>
    <SectionTitle :text="m.recovery.title" />

    <p class="rec-b__lead">{{ m.recovery.lead }}</p>

    <div class="rec-b" :class="{ 'is-live': isLive }">
      <div class="rec-b__viewport">
        <!-- Ось времени - ::before дорожки: псевдоэлемент сетки сам становится
             её ячейкой, лишнего не-<li> ребёнка в списке нет -->
        <ol ref="trackEl" class="rec-b__track">
          <li
            v-for="(row, i) in m.recovery.rows"
            :key="i"
            class="rec-b__stage"
            :style="{ '--i': i }"
          >
            <span class="rec-b__stub" aria-hidden="true">
              <span class="rec-b__ring" />
            </span>
            <p class="rec-b__when">{{ row.when }}</p>
            <p class="rec-b__what">{{ row.what }}</p>
          </li>
        </ol>
      </div>
    </div>

    <!-- Оговорка об индивидуальности. Кегль основного текста - требование DHA.
         Про солнце отдельно: для аудитории в ОАЭ это не мелочь -->
    <div class="rec-b__notes">
      <div class="rec-b__note">
        <p class="mono rec-b__note-label">{{ m.recovery.noteLabel }}</p>
        <p class="rec-b__note-text">{{ m.recovery.note }}</p>
      </div>
      <div class="rec-b__note">
        <p class="mono rec-b__note-label">{{ m.recovery.sunLabel }}</p>
        <p class="rec-b__note-text">{{ m.recovery.sun }}</p>
      </div>
    </div>
  </PageSection>
</template>

<style scoped>
.rec-b__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(52ch, 100%);
}

.rec-b {
  /* Высота отвода от текста этапа до оси */
  --stub-h: 2.6rem;
  margin-block-start: var(--s-10);
}

.rec-b__track {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  column-gap: var(--s-6);
}

/* Ось: пунктир тем же шагом, что вся разметка. Прочерчивается слева направо
   при появлении блока - clip-path открывает готовую линию (правило пунктира) */
.rec-b__track::before {
  content: '';
  grid-row: 2;
  grid-column: 1 / -1;
  block-size: var(--rule-w);
  background-image: repeating-linear-gradient(
    to right,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  clip-path: inset(0 100% 0 0);
  transition: clip-path 1600ms var(--ease-draw);
}

.rec-b.is-live .rec-b__track::before {
  clip-path: inset(0 0 0 0);
}

.rec-b__stage {
  position: relative;
  min-inline-size: 0;
  opacity: 0;
  transition:
    opacity var(--dur-slow) var(--ease-out),
    translate var(--dur-slow) var(--ease-out);
  /* Каскад вслед за прочерчиванием оси: этап оживает, когда линия до него дошла */
  transition-delay: calc(220ms + var(--i) * 240ms);
}

.rec-b.is-live .rec-b__stage {
  opacity: 1;
  translate: 0 0;
}

/* Этапы через один: нечётные над осью, чётные под. Верхние поднимаются
   от оси, нижние опускаются - движение расходится от линии */
.rec-b__stage:nth-child(odd) {
  grid-row: 1;
  align-self: end;
  padding-block-end: var(--stub-h);
  translate: 0 0.5rem;
}

.rec-b__stage:nth-child(even) {
  grid-row: 3;
  align-self: start;
  padding-block-start: var(--stub-h);
  translate: 0 -0.5rem;
}

.rec-b__stage:nth-child(1) { grid-column: 1; }
.rec-b__stage:nth-child(2) { grid-column: 2; }
.rec-b__stage:nth-child(3) { grid-column: 3; }
.rec-b__stage:nth-child(4) { grid-column: 4; }
.rec-b__stage:nth-child(5) { grid-column: 5; }

/* Отвод от этапа к оси: тот же пунктир, штрихи идут ОТ оси к тексту -
   направление градиента у верхних и нижних своё (правило CrossRules) */
.rec-b__stub {
  position: absolute;
  inset-inline-start: 1.1rem;
  inline-size: var(--rule-w);
  block-size: calc(var(--stub-h) - 0.5rem);
  pointer-events: none;
}

.rec-b__stage:nth-child(odd) .rec-b__stub {
  inset-block-end: 0;
  background-image: repeating-linear-gradient(
    to top,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

.rec-b__stage:nth-child(even) .rec-b__stub {
  inset-block-start: 0;
  background-image: repeating-linear-gradient(
    to bottom,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
}

/* Кольцо-отметка на оси. Фон бумаги гасит пунктир под кольцом */
.rec-b__ring {
  position: absolute;
  inline-size: 9px;
  block-size: 9px;
  border: 1px solid var(--ink);
  border-radius: 50%;
  background: var(--paper-deep);
  inset-inline-start: -4px;
}

.rec-b__stage:nth-child(odd) .rec-b__ring {
  inset-block-end: -5px;
}

.rec-b__stage:nth-child(even) .rec-b__ring {
  inset-block-start: -5px;
}

.rec-b__when {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 1.9vw, 1.9rem);
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin: 0 0 var(--s-3);
  color: var(--ink);
}

.rec-b__what {
  font-size: var(--fs-body);
  line-height: 1.55;
  margin: 0;
  color: var(--ink-soft);
}

/* ⚠️ Кегль основного текста, а не мелкий: ST-21 п. 9.6 и 7.1.5 */
.rec-b__notes {
  margin-block-start: var(--s-12);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-8);
}

.rec-b__note-label {
  margin: 0 0 var(--s-2);
}

.rec-b__note-text {
  font-size: var(--fs-body);
  line-height: 1.65;
  margin: 0;
  color: var(--ink-soft);
  max-inline-size: min(58ch, 100%);
}

@media (max-width: 900px) {
  /* Лента вдоль оси: этапы листаются пальцем, края растворяются дымками.
     Дымки - маской на самом окне прокрутки: маска не едет вместе с контентом,
     в отличие от псевдоэлементов контейнера прокрутки */
  .rec-b__viewport {
    margin-inline: calc(-1 * var(--page-pad));
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scroll-padding-inline-start: var(--page-pad);
    scrollbar-width: none;
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0,
      #000 1.6rem,
      #000 calc(100% - 1.6rem),
      transparent 100%
    );
    mask-image: linear-gradient(
      to right,
      transparent 0,
      #000 1.6rem,
      #000 calc(100% - 1.6rem),
      transparent 100%
    );
  }

  .rec-b__viewport::-webkit-scrollbar {
    display: none;
  }

  .rec-b__track {
    display: flex;
    inline-size: max-content;
    align-items: stretch;
    gap: var(--s-6);
    padding-inline: var(--page-pad);
  }

  /* Ось на телефоне стоит прочерченной: рисовать её за краем экрана некому */
  .rec-b__track::before {
    position: absolute;
    inset-inline: 0;
    inset-block-end: 1.05rem;
    clip-path: none;
    transition: none;
  }

  .rec-b.is-live .rec-b__track::before {
    clip-path: none;
  }

  /* Все этапы над осью, отвод вниз. Ширина - чтобы был виден край следующего:
     подсказка, что лента листается */
  .rec-b__stage,
  .rec-b__stage:nth-child(odd),
  .rec-b__stage:nth-child(even) {
    flex: 0 0 min(17.5rem, 74vw);
    scroll-snap-align: start;
    padding-block-start: 0;
    padding-block-end: 3.1rem;
    translate: 0 0.5rem;
  }

  .rec-b__stage:nth-child(odd) .rec-b__stub,
  .rec-b__stage:nth-child(even) .rec-b__stub {
    inset-block-start: auto;
    inset-block-end: 1.05rem;
    block-size: 1.6rem;
    background-image: repeating-linear-gradient(
      to top,
      var(--rule) 0 var(--dash-on),
      transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
    );
  }

  .rec-b__stage:nth-child(odd) .rec-b__ring,
  .rec-b__stage:nth-child(even) .rec-b__ring {
    inset-block-start: auto;
    inset-block-end: -5px;
  }

  .rec-b__when {
    font-size: 1.5rem;
  }

  .rec-b__notes {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-6);
  }
}
</style>
