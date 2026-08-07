<!--
  Главная страница целиком - общая для двух адресов: `/` (русский)
  и `/en` (английский). Язык выставляет app.vue по маршруту, здесь только
  содержимое и метаданные.
-->
<script setup lang="ts">
const { m, locale } = useLocale()

/* 🔴 Адрес рабочей версии. При переезде на боевой домен (kamalovdubai.com,
   этап 5) заменить - hreflang и canonical обязаны указывать на боевой */
const SITE = 'https://markinscompany-commits.github.io/kamalov-dubai'

// Заголовок вкладки, описание и язык страницы меняются вместе с языком.
// Функция, а не объект: иначе значения замрут на первом языке.
// hreflang связывает две языковые версии, canonical - у каждой свой адрес.
/* Карточка ссылки в соцсетях. Без неё Meta собирает превью сама, из чего
   попало и без картинки - а это первое, что видит и модератор, и человек.
   Кадр нейтральный (портрет врача): «до/после» в ленте показывать нельзя */
const pageUrl = computed(() => (locale.value === 'en' ? `${SITE}/en/` : `${SITE}/`))

useHead(() => ({
  htmlAttrs: { lang: locale.value },
  title: m.value.meta.title,
  meta: [
    { name: 'description', content: m.value.meta.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Dr. Kamalov' },
    { property: 'og:title', content: m.value.meta.title },
    { property: 'og:description', content: m.value.meta.description },
    { property: 'og:url', content: pageUrl.value },
    { property: 'og:image', content: `${SITE}/media/doctor-portrait.jpg` },
    { property: 'og:locale', content: locale.value === 'en' ? 'en_GB' : 'ru_RU' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    /* /en/ со слэшем: без него хостинг отвечает редиректом, а canonical
       и hreflang обязаны указывать на адрес, который отвечает сразу */
    { rel: 'canonical', href: locale.value === 'en' ? `${SITE}/en/` : `${SITE}/` },
    { rel: 'alternate', hreflang: 'ru', href: `${SITE}/` },
    { rel: 'alternate', hreflang: 'en', href: `${SITE}/en/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${SITE}/` },
  ],
}))
</script>

<template>
  <main>
    <HeroSection />
    <ManifestSection />
    <DoctorSection />

    <!-- [04] Операции: ринопластика и септопластика одним блоком. Подача
         «хирург дорисовывает разметку» выбрана Марком 04.08 из двух собранных
         вариантов; второй (разворот) снят, он в истории git -->
    <SurgerySection />

    <!-- [05] Результаты: галерея «до/после», подача «Журнал случаев» (вариант А,
         выбор Марка 05.08). ⚠️ Кадры - заглушка с dr-kamalov.com до материалов
         клиники с согласиями пациентов. Снимается одним движением - убрать строку -->
    <GallerySection />

    <!-- [06] Где принимает: Dubai London Hospital. Подача «Координата» принята
         Марком 03.08 - карта Джумейры, нарисованная разметкой сайта -->
    <ClinicSection />

    <!-- [07] Как проходит лечение: подача «Маршрут» (вариант А, выбор Марка
         06.08 из двух собранных вживую; вариант Б снят, он в истории git) -->
    <TreatmentPathSection />

    <!-- [08] Восстановление: подача «Шкала» (вариант А, выбор Марка 06.08
         из двух собранных вживую; вариант Б «Горизонт» снят, он в истории
         git - коммит dea10cb). 🔴 Цифры сроков - заглушка до подтверждения
         доктором (client-request, строка 2.7) -->
    <RecoveryScaleSection />

    <!-- [09] Кому не подходит: подача «Крупные номера» (вариант Б, выбор
         Марка 07.08; вариант А «Стоп-штрихи» снят - история git, b5adabf).
         🔴 Формулировки - медицинские, утверждает доктор -->
    <UnsuitedIndexSection />

    <!-- [10] Вопросы и ответы: подача «Аккордеон» (вариант А, выбор Марка
         07.08; вариант Б «Разворот» снят - история git, b5adabf).
         🔴 Формулировки утверждает доктор -->
    <FaqFoldSection />

    <!-- [11] Заявка и контакты: подача «Анкета» (вариант Б, выбор Марка
         06.08; вариант А «Карта записи» снят - история git, 2da5b87).
         «Что будет дальше» снято по правке Марка 07.08. 🔴 Транспорт заявок
         не подключён (адресов от клиники нет) - отправка имитируется,
         см. useBookingForm.ts -->
    <BookingPhraseSection />

    <SiteFooter />
  </main>
</template>
