<!--
  Профиль с разметкой - графика для блоков операций.

  Зачем: блок услуги иначе остаётся текстовым полотном, а фотографий, которые нам
  разрешено показывать, для него нет. Снимков пациентов нельзя, операционных кадров
  нельзя, стоковых улыбающихся моделей мы не ставим сами.

  Что нарисовано: линия профиля - лоб, переносица, спинка носа, кончик, губа,
  подбородок - и поверх неё пунктирные направляющие с узлом. Ровно то, что хирург
  рисует перед операцией. Это единственный визуальный образ хирургии, который
  не нарушает ни одного правила: нет инструментов, нет вмешательства, нет
  сравнения внешности и нет обещания результата.

  Рисунок обобщённый: это не чей-то нос и не результат операции.

  variant:
  · dorsum - направляющие по спинке и кончику (ринопластика: форма);
  · airway - вертикаль по перегородке и стрелка потока (септопластика: дыхание).
-->
<script setup lang="ts">
interface Props {
  variant?: 'dorsum' | 'airway'
  /** Подпись под рисунком */
  caption?: string
}

withDefaults(defineProps<Props>(), { variant: 'dorsum', caption: undefined })
</script>

<template>
  <figure class="pm">
    <svg class="pm__svg" viewBox="0 0 200 250" role="img" :aria-label="caption">
      <!-- Линия профиля -->
      <path
        class="pm__face"
        d="M62 14
           C 84 36, 94 60, 92 84
           C 91 93, 99 99, 112 109
           C 123 118, 131 126, 129 133
           C 127 141, 116 144, 103 144
           C 97 145, 95 150, 96 158
           C 97 167, 90 176, 83 182
           C 74 190, 66 200, 64 214"
      />

      <template v-if="variant === 'dorsum'">
        <!-- Спинка носа: прямая от переносицы к кончику -->
        <path class="pm__rule" d="M92 86 L131 132" />
        <!-- Горизонталь на уровне кончика -->
        <path class="pm__rule" d="M40 132 L176 132" />
        <!-- Вертикаль через переносицу -->
        <path class="pm__rule" d="M92 40 L92 200" />
        <!-- Узел на кончике -->
        <g class="pm__node">
          <path d="M131 124 L131 140 M123 132 L139 132" />
        </g>
      </template>

      <template v-else>
        <!-- Ось перегородки -->
        <path class="pm__rule" d="M104 96 L104 196" />
        <!-- Горизонталь на уровне основания носа -->
        <path class="pm__rule" d="M44 144 L176 144" />
        <!-- Путь воздуха: дуга внутрь -->
        <path class="pm__flow" d="M168 108 C 140 112, 118 122, 108 140 C 102 152, 100 168, 100 186" />
        <g class="pm__node">
          <path d="M104 136 L104 152 M96 144 L112 144" />
        </g>
      </template>
    </svg>

    <figcaption v-if="caption" class="pm__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.pm {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}

.pm__svg {
  inline-size: 100%;
  block-size: auto;
}

.pm__face {
  fill: none;
  stroke: var(--ink);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Направляющие - тем же шагом пунктира и тем же цветом, что разметка блоков */
.pm__rule {
  fill: none;
  stroke: var(--rule);
  stroke-width: 1;
  stroke-dasharray: 4 6;
}

/* Путь воздуха - фирменным золотом: единственная тёплая линия в блоке */
.pm__flow {
  fill: none;
  stroke: var(--gold);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-dasharray: 5 7;
}

.pm__node path {
  fill: none;
  stroke: var(--rule);
  stroke-width: 1;
}

.pm__caption {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  line-height: 1.5;
  color: var(--ink-soft);
  max-inline-size: 22ch;
}
</style>
