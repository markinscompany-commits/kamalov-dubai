<!--
  Блок [04] «Операции» - подача «хирург дорисовывает разметку».
  Вариант А, выбран Марком 04.08.

  Профиль стоит на месте, пока справа прокручивается текст, и разметка на нём
  достраивается по ходу чтения. Три прохода по одной голове:
  форма → дыхание → вместе. Последний и есть смысл объединения двух операций
  в один блок: одна точка, две задачи, одно вмешательство.

  Цвет разделяет операции: золото - форма, синий - дыхание (см. NoseScheme).

  ⚠️ ТЕКСТА МАЛО НАМЕРЕННО (правка Марка 04.08: «очень сухо, много текста»).
  Правила этого блока:
  · что операция трогает - подписано на рисунке, в тексте не повторяется;
  · у каждого прохода не список фактов, а ДВЕ короткие заметки в строку;
  · выгода объединения - две плитки антиквой, а не строчка в абзаце;
  · риски - списком по операциям, а не двумя абзацами: пять строк подряд
    человек пролистывает, и требование показать риски выполняется только
    на бумаге. Общая оговорка внизу одна, а не по разу в каждом абзаце.

  ⚠️ FactList здесь намеренно НЕ используется: этим приёмом набран блок
  «О докторе» прямо выше, и повтор соседа читается как шаблон.

  ⚠️ Состояние переключается наблюдателем за серединой экрана, а НЕ по
  событию прокрутки: замерять раскладку на каждом кадре - прямой путь
  к подёргиванию на iPhone (design-system.md, раздел 6).

  ⚠️ На телефоне прилипания нет. Рисунок стоит в начале каждого прохода
  своим экземпляром: так он не отъедает половину высоты и не накрывает текст.
-->
<script setup lang="ts">
const { m } = useLocale()

/** Три прохода: две задачи + их объединение */
const stages = computed(() => [...m.value.surgery.parts, m.value.surgery.together])

/** Какой проход сейчас читают - его разметка и стоит на профиле */
const active = ref(0)
const activeState = computed(() => stages.value[active.value]?.state ?? 'form')

const stageEls: HTMLElement[] = []

function setStageRef(el: unknown, i: number) {
  if (el instanceof HTMLElement) stageEls[i] = el
}

let watcher: IntersectionObserver | null = null

onMounted(() => {
  /*
    Полоса в середине экрана высотой 10%: активным становится тот проход,
    который её пересёк. Наблюдатель ничего не считает при прокрутке - браузер
    сам сообщает о пересечении, поэтому кадры не теряются.
  */
  watcher = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const i = stageEls.indexOf(entry.target as HTMLElement)
        if (i >= 0) active.value = i
      }
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
  )
  for (const el of stageEls) if (el) watcher.observe(el)
})

onBeforeUnmount(() => watcher?.disconnect())
</script>

<template>
  <!-- Фон и точка разметки - те же, что у «О докторе» и «Где принимает»
       (правка Марка 04.08): при 0.161 вертикаль вставала левее, чем у соседей -->
  <PageSection
    id="surgery"
    :label="m.surgery.label"
    tone="deep"
    cross-y="5.5rem"
    :cross-fraction="0.207"
  >
    <SectionTitle :text="m.surgery.title" />
    <p class="sg__lead">{{ m.surgery.lead }}</p>

    <div class="sg__grid">
      <!-- Рисунок держится на месте, пока идут все три прохода -->
      <div class="sg__figure">
        <div class="sg__sticky">
          <NoseScheme :state="activeState" :labels="m.surgery.scheme" />
        </div>
      </div>

      <div class="sg__stages">
        <!-- У задач есть якоря (#rhinoplasty / #septoplasty): пункты меню
             «Ринопластика» и «Септопластика» ведут каждый на свою часть блока -->
        <article
          v-for="(stage, i) in stages"
          :id="'anchor' in stage ? stage.anchor : undefined"
          :key="stage.state"
          :ref="(el) => setStageRef(el, i)"
          class="sg__stage"
          :class="[`sg__stage--${stage.state}`, { 'is-active': active === i }]"
        >
          <!-- На телефоне заголовки стоят НАД схемой (правка Марка 04.08):
               порядок задаёт media-запрос, в разметке они идут подряд -->
          <p class="mono sg__step">{{ stage.step }}</p>
          <h3 class="sg__name">{{ stage.name }}</h3>
          <p v-if="'surgery' in stage" class="mono sg__surgery">{{ stage.surgery }}</p>

          <!-- На телефоне прилипания нет: у каждого прохода свой рисунок -->
          <NoseScheme class="sg__scheme-m" :state="stage.state" :labels="m.surgery.scheme" />

          <p class="sg__stage-lead">{{ stage.lead }}</p>

          <!-- Две короткие заметки в строку: пометка сверху, факт под ней -->
          <ul v-if="'facts' in stage" class="sg__notes">
            <li v-for="fact in stage.facts" :key="fact.mark" class="sg__note">
              <span class="mono sg__note-mark">{{ fact.mark }}</span>
              <span class="sg__note-text">{{ fact.text }}</span>
            </li>
          </ul>

          <!-- Риски стоят внутри своей задачи, а не разделом внизу -->
          <div v-if="'risks' in stage" class="sg__risks">
            <p class="mono sg__risks-label">{{ stage.risks.label }}</p>
            <p class="sg__risks-note">{{ stage.risks.note }}</p>
            <ul class="sg__risks-list">
              <li v-for="item in stage.risks.items" :key="item" class="sg__risk-item">{{ item }}</li>
            </ul>
          </div>

          <!-- Выгода объединения - двумя плитками, а не строчкой в абзаце -->
          <ul v-if="'marks' in stage" class="sg__tiles">
            <li v-for="mark in stage.marks" :key="mark" class="sg__tile">{{ mark }}</li>
          </ul>
          <p v-if="'note' in stage" class="sg__stage-note">{{ stage.note }}</p>
        </article>
      </div>
    </div>

    <div class="sg__action">
      <MarkAction href="#booking">{{ m.action.bookLong }}</MarkAction>
    </div>
  </PageSection>
</template>

<style scoped>
.sg__lead {
  font-size: var(--fs-lead);
  line-height: 1.5;
  max-inline-size: min(52ch, 100%);
}

.sg__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(2rem, 4vw, 4rem);
}

/* Колонка тянется на всю высоту проходов - только тогда работает прилипание */
.sg__figure {
  min-inline-size: 0;
}

.sg__sticky {
  position: sticky;
  /* Под шапкой, примерно на трети экрана: рисунок оказывается напротив текста */
  inset-block-start: calc(var(--header-h-scrolled) + 4rem);
  /* Подписи выходят за кадр рисунка вправо - им нужно место в коридоре */
  --ns-size: 22rem;
}

.sg__stages {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
}

.sg__stage {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
  /* Переход по якорю из меню: заголовок задачи не должен нырять под шапку */
  scroll-margin-block-start: calc(var(--header-h) + var(--s-6));
  /* Запас по высоте: у каждого прохода должно быть своё место на экране,
     иначе разметка на профиле переключается быстрее, чем читается текст */
  min-block-size: 54vh;
  padding-block-end: var(--s-16);
  /* Проход, который сейчас не читают, приглушён - но остаётся читаемым:
     прятать текст нельзя, это медицинские сведения */
  opacity: 0.5;
  transition: opacity var(--dur-slow) var(--ease-out);
}

.sg__stage.is-active {
  opacity: 1;
}

.sg__scheme-m {
  display: none;
}

.sg__step {
  margin: 0;
}

.sg__name {
  font-size: var(--fs-h2);
  line-height: 1.1;
  color: var(--ink);
}

/* Название операции - под её задачей: сначала что решаем, потом как называется */
.sg__surgery {
  margin: 0;
  color: var(--ink);
}

.sg__stage-lead {
  font-size: var(--fs-body);
  line-height: 1.65;
  max-inline-size: min(46ch, 100%);
  margin-block-start: var(--s-1);
}

/* --- Две короткие заметки --- */

.sg__notes {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-6);
  margin: var(--s-3) 0 0;
  padding: 0;
  list-style: none;
}

.sg__note {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
  padding-block-start: var(--s-3);
  background-image: repeating-linear-gradient(
    to right,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  background-size: 100% var(--rule-w);
  background-repeat: no-repeat;
  background-position: 0 0;
}

.sg__note-mark {
  color: var(--ink-soft);
}

.sg__note-text {
  font-size: var(--fs-body);
  line-height: 1.5;
}

/* --- Риски внутри задачи --- */

.sg__risks {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
  margin-block-start: var(--s-5);
  padding-block-start: var(--s-4);
  background-image: repeating-linear-gradient(
    to right,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  background-size: 100% var(--rule-w);
  background-repeat: no-repeat;
  background-position: 0 0;
}

.sg__risks-label {
  margin: 0;
}

.sg__risks-note {
  font-size: var(--fs-body);
  color: var(--ink-soft);
}

.sg__risks-list {
  margin: var(--s-2) 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
}

/*
  ⚠️ Кегль рисков - тот же, что у основного текста. Это требование
  регулятора (ST-21 п. 7.1.5 и 9.6), а не вопрос вкуса: увести их
  в мелкий серый нельзя.
*/
.sg__risk-item {
  position: relative;
  font-size: var(--fs-body);
  line-height: 1.4;
  padding-inline-start: var(--s-6);
}

/* Вместо галочки - короткий штрих того же пера, что разметка */
.sg__risk-item::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0.72em;
  inline-size: var(--s-4);
  block-size: var(--rule-w);
  background: var(--rule);
}

/* --- Плитки «один наркоз / одно восстановление» --- */

.sg__tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-4);
  margin: var(--s-4) 0 0;
  padding: 0;
  list-style: none;
}

/*
  Плитка - не кнопка и не карточка с тенью: пунктирная рамка того же пера,
  что вся разметка, и фраза антиквой. Рамка собрана градиентами, а не
  border: dashed - у браузерной штриховки шаг зависит от длины стороны
  и на углах получается мусор (design-system.md, раздел 4).
*/
.sg__tile {
  min-inline-size: 0;
  padding: var(--s-5) var(--s-3);
  text-align: center;
  font-family: var(--font-display);
  font-weight: 300;
  /* Кегль подобран так, чтобы «одно восстановление» стояло в ОДНУ строку -
     и на компьютере, и на телефоне (правка Марка 04.08). Разная высота
     двух плиток рядом читается как ошибка вёрстки */
  font-size: clamp(1rem, 1.5vw, 1.375rem);
  white-space: nowrap;
  line-height: 1.15;
  color: var(--ink);
  background-image:
    repeating-linear-gradient(to right, var(--rule) 0 var(--dash-on), transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))),
    repeating-linear-gradient(to right, var(--rule) 0 var(--dash-on), transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))),
    repeating-linear-gradient(to bottom, var(--rule) 0 var(--dash-on), transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))),
    repeating-linear-gradient(to bottom, var(--rule) 0 var(--dash-on), transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off)));
  background-size:
    100% var(--rule-w),
    100% var(--rule-w),
    var(--rule-w) 100%,
    var(--rule-w) 100%;
  background-repeat: no-repeat;
  background-position:
    0 0,
    0 100%,
    0 0,
    100% 0;
}

.sg__stage-note {
  font-size: var(--fs-body);
  color: var(--ink-soft);
  max-inline-size: min(46ch, 100%);
  margin-block-start: var(--s-3);
}

@media (max-width: 900px) {
  .sg__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }

  /* Прилипающий рисунок уступает место экземплярам внутри проходов */
  .sg__figure {
    display: none;
  }

  .sg__scheme-m {
    display: block;
    margin-block: var(--s-2) var(--s-4);
  }

  .sg__stage {
    min-block-size: 0;
    padding-block-end: var(--s-12);
    /* На телефоне на экране всегда один проход - приглушать нечего */
    opacity: 1;
  }

  /* Кнопка во всю ширину: на телефоне она главное действие экрана */
  .sg__action :deep(.action) {
    inline-size: 100%;
  }

  /* Плитки на телефоне крупнее (правка Марка 04.08: clamp упирался в нижнюю
     границу и текст выходил слишком мелким). Кегль ПК не трогаем */
  .sg__tile {
    font-size: 1.25rem;
  }
}

@media (max-width: 560px) {
  /* Две колонки заметок и плиток на узком экране не помещаются */
  .sg__notes,
  .sg__tiles {
    grid-template-columns: minmax(0, 1fr);
  }

  .sg__tile {
    text-align: start;
  }
}
</style>
