<!--
  Блок [04] «Операции» - ВАРИАНТ А: «хирург дорисовывает разметку».

  Подача: профиль стоит на месте, пока справа прокручивается текст, и разметка
  на нём достраивается по ходу чтения. Три прохода по одному носу -
  форма → дыхание → вместе. Последний и есть смысл объединения двух операций
  в один блок: одна точка, две задачи, одно вмешательство.

  Почему так, а не списком: фотографий сюда поставить нельзя ни одной (см.
  NoseScheme.vue), а два текста подряд про две операции читаются как статья и
  пролистываются. Здесь же главная метафора сайта - разметка перед операцией -
  становится не оформлением, а объяснением.

  ⚠️ Состояние переключается наблюдателем за серединой экрана, а НЕ по событию
  прокрутки: замерять раскладку на каждом кадре - прямой путь к подёргиванию
  на iPhone (design-system.md, раздел 6).

  ⚠️ На телефоне прилипания нет. Рисунок стоит в начале каждого прохода своим
  экземпляром: так на маленьком экране он не отъедает половину высоты и не
  накрывает текст. Какой экземпляр показать - решает медиазапрос.

  ⚠️ Риски обеих операций стоят открытым текстом внизу блока, а не за
  переключателем: ST-21 п. 7.1.3 требует показывать выгоды и риски наравне.
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
  <PageSection
    id="surgery"
    :label="m.surgery.label"
    tone="paper"
    cross-y="5.5rem"
    :cross-fraction="0.161"
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
        <article
          v-for="(stage, i) in stages"
          :key="stage.state"
          :ref="(el) => setStageRef(el, i)"
          class="sg__stage"
          :class="{ 'is-active': active === i }"
        >
          <!-- На телефоне прилипания нет: у каждого прохода свой рисунок -->
          <NoseScheme class="sg__scheme-m" :state="stage.state" :labels="m.surgery.scheme" />

          <p class="mono sg__step">{{ stage.step }}</p>
          <h3 class="sg__name">{{ stage.name }}</h3>
          <p v-if="'surgery' in stage" class="mono sg__surgery">{{ stage.surgery }}</p>

          <p class="sg__stage-lead">{{ stage.lead }}</p>

          <FactList v-if="'facts' in stage" :items="stage.facts" />

          <ul v-if="'marks' in stage" class="sg__marks">
            <li v-for="mark in stage.marks" :key="mark" class="mono sg__mark">{{ mark }}</li>
          </ul>
        </article>
      </div>
    </div>

    <!-- Риски: обе операции, открытым текстом, тем же кеглем, что основной -->
    <div class="sg__risks">
      <p class="mono sg__risks-label">{{ m.surgery.risksLabel }}</p>
      <div class="sg__risks-cols">
        <div v-for="part in m.surgery.parts" :key="part.state" class="sg__risk">
          <p class="mono sg__risk-title">{{ part.risksLabel }}</p>
          <p class="sg__risk-text">{{ part.risks }}</p>
        </div>
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
  max-inline-size: min(56ch, 100%);
}

.sg__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(2rem, 5vw, 5rem);
}

/* Колонка тянется на всю высоту проходов - только тогда работает прилипание */
.sg__figure {
  min-inline-size: 0;
}

.sg__sticky {
  position: sticky;
  /* Под шапкой, примерно на трети экрана: рисунок оказывается напротив текста */
  inset-block-start: calc(var(--header-h-scrolled) + 5rem);
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
  gap: var(--s-4);
  /* Запас по высоте: у каждого прохода должно быть своё место на экране,
     иначе разметка на профиле переключается быстрее, чем читается текст */
  min-block-size: 58vh;
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
  max-inline-size: min(54ch, 100%);
  margin-block-start: var(--s-2);
}

/* Две короткие пометки третьего прохода. Не список фактов - там нечего
   расписывать, это ровно два слова, и им хватает пунктирной черты сверху */
.sg__marks {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-8);
  margin: var(--s-2) 0 0;
  padding: 0;
  list-style: none;
}

.sg__mark {
  padding-block-start: var(--s-4);
  color: var(--ink);
  background-image: repeating-linear-gradient(
    to right,
    var(--rule) 0 var(--dash-on),
    transparent var(--dash-on) calc(var(--dash-on) + var(--dash-off))
  );
  background-size: 100% var(--rule-w);
  background-repeat: no-repeat;
  background-position: 0 0;
}

/* --- Риски --- */

.sg__risks {
  display: flex;
  flex-direction: column;
  gap: var(--s-6);
}

.sg__risks-label {
  margin: 0;
}

.sg__risks-cols {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(2rem, 4vw, 4rem);
}

.sg__risk {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
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

.sg__risk-title {
  margin: 0;
  color: var(--ink);
}

/* Тот же кегль, что основной текст - требование регулятора, не вопрос вкуса */
.sg__risk-text {
  font-size: var(--fs-body);
  color: var(--ink-soft);
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
    margin-block-end: var(--s-4);
  }

  .sg__stage {
    min-block-size: 0;
    padding-block-end: var(--s-12);
    /* На телефоне на экране всегда один проход - приглушать нечего */
    opacity: 1;
  }

  .sg__risks-cols {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--s-8);
  }

  /* Кнопка во всю ширину: на телефоне она главное действие экрана */
  .sg__action :deep(.action) {
    inline-size: 100%;
  }
}
</style>
