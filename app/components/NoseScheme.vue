<!--
  Профиль с разметкой хирурга - главный рисунок блока операций.

  Зачем именно рисунок: фотографий в этот блок поставить нельзя ни одной -
  снимки пациентов запрещены, операционные кадры запрещены, стоковые лица мы
  не ставим сами. Разметка перед операцией - единственный образ хирургии,
  который не нарушает ни одного правила: нет инструментов, нет вмешательства,
  нет сравнения внешности и нет обещания результата. Профиль обобщённый -
  это не чей-то нос и не результат операции.

  Три состояния - три прохода по одному и тому же профилю:
  · form   - оси лица, спинка, кончик (задача формы);
  · breath - линия перегородки и путь воздуха (задача дыхания);
  · both   - обе разметки сразу, в точке их пересечения загорается узел.

  Линии не проявляются, а ПРОЧЕРЧИВАЮТСЯ, как вся разметка сайта. Сделано
  масками: у каждой группы линий своя маска-шторка, она раскрывается по
  направлению линии (горизонталь - слева направо, вертикаль - сверху вниз,
  путь воздуха - справа налево, снаружи внутрь). Когда состояние сменилось,
  шторка закрывается обратно - линии убираются тем же движением, каким пришли.

  ⚠️ Почему шторками, а не через stroke-dashoffset: штрих у нас 4/6, и любое
  растягивание пути растягивает вместе с ним шаг пунктира - линия перестаёт
  быть частью общей системы. Шторка просто открывает готовую линию.

  ⚠️ Подписи - обычный текст поверх рисунка, а НЕ текст внутри SVG. Текст
  внутри SVG сжимается вместе с картинкой, и на телефоне от него остаются
  нечитаемые семь пикселей (грабли из block-manifest.md, п. 5).
-->
<script setup lang="ts">
interface SchemeLabels {
  alt: string
  axes: string
  dorsum: string
  tip: string
  septum: string
  airway: string
  both: string
}

interface Props {
  state?: 'form' | 'breath' | 'both'
  labels: SchemeLabels
}

const props = withDefaults(defineProps<Props>(), { state: 'form' })

/* Маски адресуются по id, а рисунок стоит на странице не в одном экземпляре -
   идентификаторы обязаны быть разными у каждого */
const uid = useId()

const root = ref<HTMLElement | null>(null)
/* Общий приём сайта: ушло с экрана - стёрлось, вернулось - чертится заново */
const live = useRedrawOnReturn(root, 0.2)

const formOn = computed(() => live.value && props.state !== 'breath')
const breathOn = computed(() => live.value && props.state !== 'form')
const bothOn = computed(() => live.value && props.state === 'both')
</script>

<template>
  <figure ref="root" class="ns" :class="[`ns--${state}`, { 'is-live': live }]">
    <div class="ns__plate">
      <!-- Кадр обрезан по содержимому: в исходной системе координат вокруг
           профиля оставалось столько пустоты, что сам рисунок занимал треть
           отведённого места и терялся на странице -->
      <svg class="ns__svg" viewBox="30 4 156 216" role="img" :aria-label="labels.alt">
        <defs>
          <!-- Шторки. Каждая раскрывается по направлению своей линии, задержки
               разные - линии ложатся одна за другой, а не хором -->
          <clipPath :id="`fv-${uid}`">
            <rect class="ns__wipe ns__wipe--v" :class="{ 'is-on': formOn }" x="0" y="0" width="200" height="250" />
          </clipPath>
          <clipPath :id="`fh-${uid}`">
            <rect class="ns__wipe ns__wipe--h ns__wipe--d1" :class="{ 'is-on': formOn }" x="0" y="0" width="200" height="250" />
          </clipPath>
          <clipPath :id="`fd-${uid}`">
            <rect class="ns__wipe ns__wipe--h ns__wipe--d2" :class="{ 'is-on': formOn }" x="0" y="0" width="200" height="250" />
          </clipPath>
          <clipPath :id="`bv-${uid}`">
            <rect class="ns__wipe ns__wipe--v" :class="{ 'is-on': breathOn }" x="0" y="0" width="200" height="250" />
          </clipPath>
          <clipPath :id="`bh-${uid}`">
            <rect class="ns__wipe ns__wipe--h ns__wipe--d1" :class="{ 'is-on': breathOn }" x="0" y="0" width="200" height="250" />
          </clipPath>
          <clipPath :id="`bf-${uid}`">
            <rect class="ns__wipe ns__wipe--rev ns__wipe--d2" :class="{ 'is-on': breathOn }" x="0" y="0" width="200" height="250" />
          </clipPath>
        </defs>

        <!-- Линия профиля: лоб, переносица, спинка носа, кончик, губа, подбородок.
             Рисуется пером - сплошной штрих, поэтому его можно прочертить
             обычным сдвигом штриховки по длине пути -->
        <path
          class="ns__face"
          pathLength="1"
          d="M62 14
             C 84 36, 94 60, 92 84
             C 91 93, 99 99, 112 109
             C 123 118, 131 126, 129 133
             C 127 141, 116 144, 103 144
             C 97 145, 95 150, 96 158
             C 97 167, 90 176, 83 182
             C 74 190, 66 200, 64 214"
        />

        <!-- ЗАДАЧА ФОРМЫ -->
        <g class="ns__group">
          <!-- Вертикаль через переносицу -->
          <path class="ns__rule" :clip-path="`url(#fv-${uid})`" d="M92 40 L92 200" />
          <!-- Горизонталь на уровне кончика -->
          <path class="ns__rule" :clip-path="`url(#fh-${uid})`" d="M40 132 L176 132" />
          <!--
            Ось спинки носа: идёт от переносицы через кончик и выходит за него
            construction-лучом - иначе линия прячется под самой линией профиля.

            ⚠️ Линия намеренно СОВПАДАЕТ с профилем, а не спрямляет его. Прямая,
            проведённая рядом с изогнутым носом, читается как «вот каким он
            станет» - то есть как обещание результата, а это прямой запрет
            (Приложение 2 ST-21, п. 3 и 7). Здесь это ось измерения, не эскиз.
          -->
          <path class="ns__rule" :clip-path="`url(#fd-${uid})`" d="M92 84 L146 152" />
        </g>

        <!-- ЗАДАЧА ДЫХАНИЯ -->
        <g class="ns__group">
          <!-- Ось перегородки -->
          <path class="ns__rule" :clip-path="`url(#bv-${uid})`" d="M104 96 L104 196" />
          <!-- Горизонталь на уровне основания носа -->
          <path class="ns__rule" :clip-path="`url(#bh-${uid})`" d="M44 148 L176 148" />
          <!-- Путь воздуха: единственная тёплая линия на рисунке. Чертится
               справа налево - снаружи внутрь, по ходу вдоха -->
          <path
            class="ns__flow"
            :clip-path="`url(#bf-${uid})`"
            d="M172 104 C 142 110, 118 122, 108 140 C 102 152, 100 168, 100 190"
          />
        </g>

        <!-- Узлы. В каждом состоянии горит ровно один: свой у формы, свой
             у дыхания и общий - на пересечении линий - когда показаны обе -->
        <g class="ns__node" :class="{ 'is-on': state === 'form' && live }">
          <path d="M131 124 L131 140 M123 132 L139 132" />
        </g>
        <g class="ns__node" :class="{ 'is-on': state === 'breath' && live }">
          <path d="M104 140 L104 156 M96 148 L112 148" />
        </g>
        <!-- Пересечение линии спинки и оси перегородки: одна точка на две задачи -->
        <g class="ns__node ns__node--both" :class="{ 'is-on': bothOn }">
          <path d="M104 92 L104 108 M96 100 L112 100" />
        </g>
      </svg>

      <!-- Пометки на полях рисунка -->
      <span class="mono ns__tag ns__tag--axes" :class="{ 'is-on': formOn && !bothOn }">{{ labels.axes }}</span>
      <span class="mono ns__tag ns__tag--dorsum" :class="{ 'is-on': formOn && !bothOn }">{{ labels.dorsum }}</span>
      <span class="mono ns__tag ns__tag--tip" :class="{ 'is-on': formOn && !bothOn }">{{ labels.tip }}</span>
      <span class="mono ns__tag ns__tag--septum" :class="{ 'is-on': breathOn && !bothOn }">{{ labels.septum }}</span>
      <span class="mono ns__tag ns__tag--airway" :class="{ 'is-on': breathOn && !bothOn }">{{ labels.airway }}</span>
      <span class="mono ns__tag ns__tag--both" :class="{ 'is-on': bothOn }">{{ labels.both }}</span>
    </div>
  </figure>
</template>

<style scoped>
.ns {
  margin: 0;
}

.ns__plate {
  position: relative;
  inline-size: 100%;
  max-inline-size: var(--ns-size, 21rem);
  /* Пропорция кадра рисунка - та же, что в viewBox */
  aspect-ratio: 156 / 216;
}

.ns__svg {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  overflow: visible;
}

/* --- Профиль --- */

.ns__face {
  fill: none;
  stroke: var(--ink);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  /* pathLength=1 приводит длину пути к единице, поэтому штрих и сдвиг
     задаются долями, а не пикселями - и не зависят от формы линии */
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 1400ms var(--ease-draw);
}

.ns.is-live .ns__face {
  stroke-dashoffset: 0;
}

/* --- Разметка --- */

.ns__rule {
  fill: none;
  stroke: var(--rule);
  stroke-width: var(--rule-w);
  /* Тот же шаг пунктира, что у разметки блоков: 4 через 6 */
  stroke-dasharray: var(--dash-on) var(--dash-off);
  /* Штрих и толщина считаются в экранных пикселях, а не в системе рисунка.
     Без этого рисунок на десктопе увеличен в 1.7 раза - и вместе с ним
     растянут шаг пунктира, который на всём сайте одинаковый */
  vector-effect: non-scaling-stroke;
}

.ns__flow {
  fill: none;
  stroke: var(--gold);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-dasharray: 5 7;
}

/* --- Шторки, которыми линии прочерчиваются --- */

.ns__wipe {
  transform-box: view-box;
  transition: transform var(--dur-draw) var(--ease-draw);
}

.ns__wipe--h,
.ns__wipe--rev {
  transform: scaleX(0);
}

.ns__wipe--v {
  transform: scaleY(0);
}

.ns__wipe--h,
.ns__wipe--v {
  transform-origin: 0 0;
}

/* Путь воздуха идёт снаружи внутрь, поэтому его шторка открывается справа.
   ⚠️ Начало отсчёта у transform-box: view-box - левый верхний угол КАДРА
   (30 4), а не нуль системы координат. Поэтому правый край это 156px -
   ширина кадра, а не 200px */
.ns__wipe--rev {
  transform-origin: 156px 0;
}

.ns__wipe--d1 {
  transition-delay: 140ms;
}

.ns__wipe--d2 {
  transition-delay: 280ms;
}

.ns__wipe.is-on {
  transform: scale(1);
}

/* --- Узлы --- */

.ns__node path {
  fill: none;
  stroke: var(--rule);
  stroke-width: var(--rule-w);
  vector-effect: non-scaling-stroke;
}

.ns__node {
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-out);
}

.ns__node.is-on {
  opacity: 1;
  /* Узел появляется после того, как линии сошлись, а не вместе с ними */
  transition-delay: 620ms;
}

/* Общий узел заметнее: это смысловая точка блока */
.ns__node--both path {
  stroke: var(--gold-deep);
  stroke-width: 1.4;
  vector-effect: non-scaling-stroke;
}

/* --- Пометки на полях --- */

.ns__tag {
  position: absolute;
  white-space: nowrap;
  color: var(--ink-soft);
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-out);
  pointer-events: none;
}

.ns__tag.is-on {
  opacity: 1;
  /* Подпись приходит последней - когда линии уже легли */
  transition-delay: 760ms;
}

/*
  Координаты пересчитаны из системы рисунка (кадр 30 4 156 216):
  доля по ширине = (x - 30) / 1.56, доля по высоте = (y - 4) / 2.16.

  Подписи стоят СПРАВА от своих линий: слева от рисунка идёт колонка
  с номером раздела, места там нет. Часть подписей выходит за кадр рисунка -
  так и задумано, справа от него пустое поле.
*/
.ns__tag--axes {
  inset-inline-start: 42%;
  inset-block-start: 9%;
}

.ns__tag--dorsum {
  inset-inline-start: 77%;
  inset-block-start: 68%;
}

.ns__tag--tip {
  inset-inline-start: 95%;
  inset-block-start: 55%;
}

.ns__tag--airway {
  inset-inline-start: 94%;
  inset-block-start: 39%;
}

.ns__tag--septum {
  inset-inline-start: 51%;
  inset-block-start: 82%;
}

.ns__tag--both {
  inset-inline-start: 53%;
  inset-block-start: 38%;
  color: var(--gold-deep);
}

@media (max-width: 900px) {
  .ns__plate {
    max-inline-size: var(--ns-size-m, 12rem);
  }
}
</style>
