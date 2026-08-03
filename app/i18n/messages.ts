/**
 * Тексты сайта на двух языках.
 *
 * Один файл на весь контент — чтобы переводчику и Эльдару Б. на согласование
 * уходил один документ, а не десяток компонентов.
 *
 * ⚠️ Каждая формулировка проверена по compliance/content-rules.md:
 * никаких превосходных степеней, обещаний результата и упоминаний онлайн-консультации.
 * Английские медицинские формулировки требуют отдельного утверждения доктором —
 * переформулированный текст считается новым текстом.
 *
 * Тире по всему сайту короткие «-» — решение Марка.
 */

import { typoDeep } from '~/utils/typo'

export type Locale = 'ru' | 'en'

export const locales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'En' },
  { code: 'ru', label: 'Ru' },
]

const ru = {
  meta: {
    title: 'Эльдар Камалов - ринопластика и септопластика в Дубае',
    description:
      'Эльдар Камалов - врач-специалист, оториноларингология. Хирургия носа: ринопластика и септопластика. Кандидат медицинских наук, 30 лет практики. Приём в Dubai London Hospital, регистрация DHA. Запись на консультацию.',
  },
  nav: {
    /*
      short — подпись для строки разделов в шапке. Строка живёт в левой, чернильной
      половине первого экрана и не имеет права её пересекать. На английском названия
      длиннее, поэтому там подписи короче; в самом меню всегда полные.
    */
    links: [
      { label: 'О докторе', short: 'О докторе', href: '#doctor', service: false },
      // ⚠️ Блоки услуг сейчас скрыты, а пункты меню на месте (правка Марка):
      // пока блоков нет, эти ссылки никуда не ведут - клик просто ничего не делает.
      { label: 'Ринопластика', short: 'Ринопластика', href: '#rhinoplasty', service: true },
      { label: 'Септопластика', short: 'Септопластика', href: '#septoplasty', service: true },
      // menuOnly: в строке шапки места нет (с пятью пунктами английская строка
      // пересекала границу половин) - пункт живёт только в бургер-меню
      { label: 'Где принимает', short: 'Госпиталь', href: '#clinic', service: false, menuOnly: true },
      { label: 'Контакты', short: 'Контакты', href: '#contacts', service: false },
    ],
    sections: 'Разделы страницы',
    open: 'Открыть меню',
    close: 'Закрыть меню',
    toTop: 'Доктор Камалов - наверх',
    place: 'Dubai London Hospital',
    language: 'Язык сайта',
  },
  action: {
    bookLong: 'Записаться на консультацию',
    bookShort: 'Консультация',
    whatsapp: 'WhatsApp',
  },
  service: {
    risksLabel: 'Риски',
  },
  /*
    ⚠️ ТИТУЛ НА ПЕРВОМ ЭКРАНЕ = ЗАПИСЬ В РЕГИСТРАЦИИ DHA, СЛОВО В СЛОВО.
    Требование ST-21 п. 8.1.3. В сертификате DHA (Healthcare Professional Registration
    Certificate, DHA Unique ID 26320604) в строке Registration Title стоит
    «Physician - Specialist - Otolaryngology» - и ничего про пластическую хирургию.
    Поэтому титулом идёт именно он, а ринопластика и септопластика стоят ниже как
    НАЗВАНИЕ УСЛУГИ, а не как звание врача. Разница принципиальная: рекламировать
    услугу за пределами лицензированной специализации нельзя, называть операцию,
    которую делает ЛОР-хирург, - можно.

    Английская строка воспроизводит запись сертификата буквально; русская - её перевод.
    Если клиника пришлёт лицензию, активированную через Dubai London Hospital, с другой
    специализацией - меняются ровно эти две строки.
  */
  hero: {
    eyebrow: '[01] Принимает в Dubai London Hospital',
    name: 'Эльдар Камалов',
    specMain: 'Врач-специалист -',
    specEm: 'оториноларингология',
    /*
      Ровно ДВЕ строки. Третью пробовали - на 360×640 регалии выросли на строку,
      полоса с фотографией упёрлась в потолок, и кнопки ушли за нижний край экрана
      (запас --hero-text-reserve в HeroSection.vue измерен под две строки).
      Членство в Европейском обществе ринопластов убрано отсюда не поэтому, а потому
      что оно и так стоит в «О докторе» отдельным знаком в лавровой ветви - на первом
      экране это был повтор. Заодно ближе к design-brief п. 9: одна короткая строка
      опыта, остальные регалии во втором блоке.
    */
    creds: ['Ринопластика и септопластика', 'Кандидат медицинских наук, 30 лет практики'],
    photoAlt: 'Эльдар Камалов, врач-специалист по оториноларингологии',
    scroll: 'Прокрутите ↓',
  },
  manifest: {
    label: '[02] Подход',
    lead: 'Хирургия носа - это расчёт. Форма, дыхание, анатомия и срок восстановления связаны между собой. Решения принимаются до операции, а не во время неё.',
    note: 'На консультации хирург разбирает анатомию, объясняет, какие задачи операция решает, а какие - нет, и проговаривает риски. Результат зависит от индивидуальных особенностей и не может быть одинаковым у разных людей.',
  },
  /*
    Блок «О докторе». Материал взят с dr-kamalov.com и переписан под правила.
    Что НЕ перенесено и почему (compliance/content-rules.md):
    · «лауреат премии за ЛУЧШИЙ результат» - превосходная степень, ST-21 п. 6.11.
      Осталось название премии и год: награда как факт разрешена;
    · «среди пациентов - спортсмены, телеведущие, актёры, блогеры» - апелляция к
      известности (famous в списке запрещённых слов) плюс сведения о пациентах;
    · список зарубежных коллег поимённо - читается как сравнение и ничего не даёт
      человеку, который выбирает врача.
    ⚠️ Титул и специализация должны стоять СЛОВО В СЛОВО как в лицензии DHA
    (ST-21, п. 8.1.3). Пока лицензии нет, стоит формулировка с сайта врача.
  */
  doctor: {
    label: '[03] О докторе',
    title: 'Отоларинголог по образованию, ринопласт по практике.',
    lead: 'Эльдар Камалов родился в Махачкале, в семье отоларинголога и пластического хирурга Шамсутина Камалова. Ассистировал отцу ещё студентом - оттуда и специальность, и школа. В 2016 году открыл клинику и назвал её именем отца. Сегодня оперирует в Дубае.',
    // Цифры в лавровых ветвях. Только то, что подтверждено документом
    stats: [
      { value: '30+', caption: 'лет в медицине' },
      { logo: 'media/logos/lotos.svg', wide: true, caption: 'лауреат премии «Хрустальный Лотос», 2017' },
      { logo: 'media/logos/soc-rhinoplasty.png', caption: 'член Европейского общества ринопластов' },
      { logo: 'media/logos/soc-rspras.png', caption: 'член Общества РОПРЭХ' },
    ],
    // Хронология. Все годы сверены со сканами документов в assets-temp/docs
    fullName: 'Камалов Эльдар Шамсутинович',
    timelineLabel: '// Путь',
    timelineMore: 'Раскрыть',
    timelineLess: 'Свернуть',
    timeline: [
      { year: '1988', text: 'Поступил в Дагестанский государственный медицинский институт' },
      { year: '1994', text: 'Окончил институт по специальности «лечебное дело», квалификация врача' },
      { year: '2003', text: 'Защитил диссертацию, кандидат медицинских наук' },
      { year: '2016', text: 'Открыл клинику и назвал её именем отца' },
      { year: '2017', text: 'Премия «Хрустальный Лотос» в области ринопластики' },
      { year: '2020', text: 'Сертификат специалиста по оториноларингологии' },
      // ⚠️ «квалификация врача-пластического хирурга» снята намеренно: по ST-21 п. 8.1.3
      // квалификация врача указывается так, как в лицензии DHA, а там - оториноларингология.
      // Само обучение - факт, подтверждённый документом, поэтому строка осталась.
      { year: '2021', text: 'Окончил ординатуру по пластической хирургии' },
      { year: '2025', text: 'Регистрация в департаменте здравоохранения Дубая. Приём и операции - в Dubai London Hospital' },
    ],
    docsLabel: '// Документы',
    docs: [
      // ⚠️ Надпись, а не герб: ST-21 п. 7.2 запрещает эмблему госоргана в оформлении
      // без письменного разрешения. Скан с гербом внутри открывается по клику - это
      // воспроизведение документа, и оно разрешено. Файл logos/org-dha.svg оставлен
      // на месте: придёт разрешение - меняем mark обратно на logo.
      { file: 'doc-dha-2025.jpg', mark: 'DHA', title: 'Регистрация DHA, Дубай' },
      { file: 'doc-diploma-1994.jpg', logo: 'media/logos/org-dgmu.png', title: 'Диплом врача, 1994' },
      { file: 'doc-phd-2003.jpg', logo: 'media/logos/org-rgmu.png', title: 'Кандидат наук, 2003' },
      { file: 'doc-ent-2020.jpg', logo: 'media/logos/org-nuc.png', title: 'Сертификат специалиста, 2020' },
      { file: 'doc-course-2020.jpg', logo: 'media/logos/org-nuc.png', title: 'Повышение квалификации, 2020' },
      { file: 'doc-residency-2021.jpg', logo: 'media/logos/org-mgupp.png', title: 'Ординатура, 2021' },
      /*
        Благодарственное письмо Президента РФ, 2024 - УБРАНО (решение Марка, 02.08).
        Причина не вкусовая: ST-21 п. 7.2 запрещает использовать в медицинской рекламе
        название или эмблему DHA «или любого другого государственного либо публичного
        органа» без письменного разрешения. На письме - герб России и название органа.
        Плюс само письмо о благотворительной деятельности, к медицине отношения не имеет.
        Вернуть - раскомментировать строку и файлы docs/doc-letter-2024.jpg,
        logos/org-letter.png (оба на месте).
        { file: 'doc-letter-2024.jpg', logo: 'media/logos/org-letter.png', title: 'Благодарственное письмо, 2024' },
      */
    ],
    portraitAlt: 'Эльдар Камалов',
    photoAlt: 'Шамсутин Камалов, отоларинголог и пластический хирург, архивный снимок',
    photoCaption: 'Шамсутин Камалов - отоларинголог и пластический хирург. Отец и первый учитель.',
  },
  /*
    Блоки операций. Общее правило: говорим о том, какие задачи операция решает,
    а не о том, каким станет человек. Ни одного обещания результата, ни одного
    обращения к недостаткам внешности - это прямые запреты Meta и DHA.
    Блок про риски обязателен (ST-21, п. 7.1.3) и стоит внутри каждой услуги.
  */
  rhinoplasty: {
    label: '[04] Ринопластика',
    title: 'Форма и дыхание - одна задача, а не две.',
    lead: 'Ринопластика меняет форму носа: горбинку, кончик, крылья, ширину спинки. Вместе с формой хирург смотрит на дыхание - внутренний каркас носа отвечает и за то, и за другое, поэтому менять их по отдельности нельзя.',
    facts: [
      { mark: 'Форма', text: 'Горбинка, кончик, крылья, ширина спинки, пропорции носа относительно лица' },
      { mark: 'Дыхание', text: 'Носовое дыхание, в том числе при искривлённой перегородке - тогда операции совмещают' },
      { mark: 'Повторно', text: 'Коррекция после ранее перенесённых операций на носу' },
      { mark: 'Травма', text: 'Восстановление формы и проходимости носа после травм' },
      { mark: 'Техника', text: 'Открытая и закрытая ринопластика. Доступ выбирается по задаче и анатомии, а не по желанию' },
    ],
    markCaption: 'Спинка, кончик, оси',
    risks: 'Ринопластика - хирургическая операция. Она проходит под наркозом, требует восстановления и имеет риски: отёк, временное нарушение носового дыхания, изменение чувствительности, необходимость повторной коррекции. Хирург разбирает их на консультации до принятия решения. Результат зависит от анатомии и особенностей заживления и не может быть одинаковым у разных людей.',
  },
  septoplasty: {
    label: '[05] Септопластика',
    title: 'Операция про дыхание, а не про форму.',
    lead: 'Септопластика возвращает носовую перегородку в правильное положение. Задача функциональная - восстановить свободное носовое дыхание. Наружная форма носа при этом не меняется.',
    facts: [
      { mark: 'Показание', text: 'Стойкое затруднение носового дыхания, связанное с искривлением перегородки' },
      { mark: 'Что делают', text: 'Выравнивают перегородку изнутри, не меняя наружную форму носа' },
      { mark: 'Вместе', text: 'При необходимости совмещается с ринопластикой - одна операция вместо двух' },
      { mark: 'Решение', text: 'Принимается по осмотру и снимкам, а не по фотографии носа' },
    ],
    markCaption: 'Перегородка и путь воздуха',
    risks: 'Септопластика - хирургическая операция. Она проходит с обезболиванием, требует восстановления и имеет риски: отёк, сухость в носу, кровотечение, повторное искривление перегородки. Хирург разбирает их на консультации. Результат зависит от индивидуальных особенностей и не может быть одинаковым у разных людей.',
  },
  /*
    Блок «Где принимает» - Dubai London Hospital.

    Факты сверены 03.08.2026: адрес и участок 760 - 2GIS/Nominatim, круглосуточный
    режим, аккредитация ACHSI и ЛОР-отделение - сайт больницы (записано в session-log
    сессии 4). Координаты - OpenStreetMap: 25.1530° N, 55.2013° E.

    ⚠️ Телефоны больницы сюда НЕ ставим: все заявки идут через форму и WhatsApp
    клиники, звонок в регистратуру больницы - потерянный лид.

    ⚠️ Залив в английской версии - Arabian Gulf, а не Persian Gulf: в Эмиратах
    принято только это название, «Персидский» для местной аудитории - раздражитель.
    По-русски оставлен «Персидский залив» - русскоязычные жители иначе не говорят.
  */
  /*
    ⚠️ Правило блока (правка Марка 03.08): не повторять ни соседние блоки, ни
    самого себя. Лид НЕ начинается с «Эльдар Камалов» - так начинается «О докторе»
    прямо выше. Печати НЕ дублируют заголовок: печать «24/7 круглосуточный
    стационар» убрана, потому что это дословно заголовок.
  */
  clinic: {
    label: '[06] Где принимает',
    // Без точки на конце - правка Марка 04.08
    title: 'Стационар с круглосуточным наблюдением',
    // ЛОР-отделение живёт в лиде, а не отдельной печатью (правка Марка 04.08)
    lead: 'Приём, обследование и операция проходят в Dubai London Hospital - частном госпитале на первой линии Джумейры, в двух километрах от Бурдж-аль-Араба. Профильное ЛОР-отделение, операционные и палаты - в одном здании: после операции пациент остаётся здесь же, без переездов между клиниками.',
    /*
      «Печати»: пунктирное кольцо + знак + подпись. Знаки вместо текста (правка
      Марка 04.08): логотип аккредитатора и флаги языков. Печати DHA нет -
      лицензия уже раскрыта в блоке о враче. Сами знаки собраны в
      ClinicSection.vue, здесь только подписи.
    */
    stamps: [
      {
        imgAlt: 'Знак Австралийского совета по стандартам здравоохранения (ACHS)',
        caption: 'международная аккредитация госпиталей ACHSI',
      },
      { caption: 'приём на русском и английском' },
    ],
    mapLabel: '// Расположение госпиталя',
    map: {
      alt: 'Карта Дубая от Пальмы Джумейра до района Umm Suqeim: Dubai London Hospital стоит на Jumeirah Beach Road, в двух километрах северо-восточнее Бурдж-аль-Араба',
      sea: 'Персидский залив',
      road: 'Jumeirah Beach Road',
      hospital: 'Dubai London Hospital',
      area: 'Umm Suqeim 2',
      coords: '25.15° N · 55.20° E',
      burj: 'Бурдж-аль-Араб',
      palm: 'Пальма Джумейра',
      scale: '5 км',
    },
    address: '760, Jumeirah Beach Road · Umm Suqeim 2 · Дубай',
    /*
      Галерея: три кадра - вход, кабинет приёма, палата (решение Марка:
      ресепшен и томограф пользователю ничего не говорят). Подписи видны под
      кадрами, поэтому хранятся чистым текстом - «//» добавляет просмотрщик.
    */
    gallery: [
      {
        file: 'clinic/facade.jpg',
        w: 402,
        h: 575,
        caption: 'Вход в госпиталь с Jumeirah Beach Road',
        alt: 'Фасад Dubai London Hospital со стороны Jumeirah Beach Road',
      },
      {
        file: 'clinic/consulting.jpg',
        w: 1200,
        h: 800,
        caption: 'Кабинет приёма',
        alt: 'Кабинет приёма в Dubai London Hospital',
      },
      {
        file: 'clinic/ward-view.jpg',
        w: 1200,
        h: 800,
        caption: 'Одноместная палата стационара',
        alt: 'Одноместная палата стационара Dubai London Hospital',
      },
    ],
  },
  /* Просмотрщик фотографий - подписи кнопок. Общие: пригодятся и галерее «до/после» */
  viewer: {
    close: 'Закрыть',
    prev: 'Предыдущий кадр',
    next: 'Следующий кадр',
    zoomIn: 'Приблизить',
    zoomOut: 'Отдалить',
  },
  /*
    Блок «Как проходит лечение». Отвечает на вопрос «что со мной будет от заявки
    до выписки» - его на странице не было вообще.

    🟡 ВРЕМЕННЫЕ ДАННЫЕ. Тексты шагов написаны нами по общей практике и НЕ содержат
    ни одной цифры, которую мы не можем подтвердить: длительность консультации,
    число дней в стационаре и график осмотров запрошены у клиники
    (таблица `client-request/`, строки 2.3, 2.5, 2.6). Как придут - вставляются сюда.

    ⚠️ Онлайн-консультация не упоминается нигде и упоминаться не может: в Дубае это
    отдельно лицензируемая телемедицина, стандарт DHA ST-14.
  */
  treatment: {
    label: '[07] Как проходит лечение',
    title: 'Шесть шагов от заявки до последнего осмотра.',
    lead: 'Порядок одинаковый для ринопластики и септопластики. Решение об операции принимается только после очного осмотра - по фотографии носа его не принимают.',
    stepWord: 'Шаг',
    steps: [
      {
        title: 'Заявка',
        text: 'Вы оставляете заявку на сайте или пишете в WhatsApp. Клиника связывается с вами и подбирает время приёма.',
      },
      {
        title: 'Консультация',
        text: 'Очный приём в Dubai London Hospital. Хирург осматривает нос снаружи и изнутри, разбирает анатомию, объясняет, какие задачи операция решает, а какие - нет, и проговаривает риски.',
        photo: 'consulting-room.jpg',
        photoAlt: 'Кабинет приёма в Dubai London Hospital',
      },
      {
        title: 'Обследование и план',
        text: 'Анализы, снимки, осмотр анестезиолога. По результатам хирург составляет план операции и согласовывает дату.',
        photo: 'imaging.jpg',
        photoAlt: 'Кабинет компьютерной томографии в Dubai London Hospital',
      },
      {
        title: 'Операция',
        text: 'Проходит в стационаре больницы, под наркозом. Продолжительность зависит от объёма вмешательства и обсуждается заранее.',
        photo: 'operating-room.jpg',
        photoAlt: 'Операционная Dubai London Hospital',
      },
      {
        title: 'Первые дни',
        text: 'Наблюдение в палате, затем снятие повязки и швов в сроки, которые хирург назначает по ходу заживления.',
        photo: 'ward.jpg',
        photoAlt: 'Палата в Dubai London Hospital',
      },
      {
        title: 'Наблюдение',
        text: 'Контрольные осмотры по графику. Между визитами вопросы можно задать в клинику - к тому же хирургу, который оперировал.',
      },
    ],
  },
  /*
    Блок «Восстановление».

    🔴 ЦИФРЫ - ЗАГЛУШКА, ОБЯЗАТЕЛЬНА ПРОВЕРКА ДОКТОРОМ. Это медицинские утверждения,
    а по ST-21 п. 8.1.5 любое такое утверждение надо уметь подтвердить. Сроки взяты
    по общей практике ринопластики и запрошены у клиники (`client-request/`, строка 2.7).
    До подтверждения доктором блок НЕ публикуем на боевом домене.

    Ориентиры выбраны под аудиторию в ОАЭ: солнце, бассейн и море - не абстракция,
    а то, из чего состоит здешняя жизнь, и первое, о чём спрашивают.
  */
  recovery: {
    label: '[08] Восстановление',
    title: 'Сколько времени это займёт.',
    lead: 'Восстановление - часть операции, а не приложение к ней. Ниже обычные сроки. Они зависят от объёма вмешательства и от того, как заживают ткани, поэтому у разных людей отличаются.',
    columns: { when: 'Когда', what: 'Что происходит' },
    rows: [
      { when: '1-2 день', what: 'Наблюдение в клинике. Отёк и заложенность носа наиболее заметны' },
      { when: '7-10 дней', what: 'Снимают повязку. Дышать носом становится свободнее, но отёк ещё держится' },
      { when: '2 недели', what: 'Основной отёк сходит. Обычно к этому времени возвращаются к работе и к перелётам' },
      { when: '1 месяц', what: 'Внешне изменения уже незаметны для окружающих. Спорт, бассейн и море - по разрешению хирурга' },
      { when: '6-12 месяцев', what: 'Форма носа окончательно устанавливается. Мелкий отёк уходит постепенно' },
    ],
    noteLabel: 'Что важно знать',
    note: 'Сроки в таблице - ориентир, а не обещание. Они зависят от объёма операции, особенностей тканей и точности выполнения назначений. Точные сроки для вашего случая называет хирург на консультации, после осмотра.',
    sunLabel: '// Отдельно про солнце',
    sun: 'В климате Эмиратов это важнее, чем кажется: прямое солнце на свежих рубцах и в период отёка хирурги ограничивают дольше, чем всё остальное. Срок и способы защиты хирург называет на контрольном осмотре.',
  },
}

const en: typeof ru = {
  meta: {
    title: 'Eldar Kamalov - rhinoplasty and septoplasty in Dubai',
    description:
      'Eldar Kamalov - Physician, Specialist in Otolaryngology. Nose surgery: rhinoplasty and septoplasty. PhD in Medicine, 30 years in practice. Sees patients at Dubai London Hospital, DHA registered. Book a consultation.',
  },
  nav: {
    links: [
      { label: 'About the doctor', short: 'About', href: '#doctor', service: false },
      { label: 'Rhinoplasty', short: 'Rhinoplasty', href: '#rhinoplasty', service: true },
      { label: 'Septoplasty', short: 'Septoplasty', href: '#septoplasty', service: true },
      // menuOnly - см. пояснение в русской версии
      { label: 'Where he sees patients', short: 'Hospital', href: '#clinic', service: false, menuOnly: true },
      { label: 'Contacts', short: 'Contacts', href: '#contacts', service: false },
    ],
    sections: 'Page sections',
    open: 'Open menu',
    close: 'Close menu',
    toTop: 'Doctor Kamalov - back to top',
    place: 'Dubai London Hospital',
    language: 'Site language',
  },
  action: {
    bookLong: 'Book a consultation',
    bookShort: 'Consultation',
    whatsapp: 'WhatsApp',
  },
  service: {
    risksLabel: 'Risks',
  },
  // ⚠️ Титул воспроизводит строку Registration Title сертификата DHA буквально.
  // Пояснение - в русской версии выше.
  hero: {
    eyebrow: '[01] Sees patients at Dubai London Hospital',
    name: 'Eldar Kamalov',
    specMain: 'Physician - Specialist -',
    specEm: 'Otolaryngology',
    // Две строки, см. пояснение в русской версии.
    creds: ['Rhinoplasty and septoplasty', 'PhD in Medicine, 30 years in practice'],
    photoAlt: 'Eldar Kamalov, Physician - Specialist - Otolaryngology',
    scroll: 'Scroll ↓',
  },
  manifest: {
    label: '[02] Approach',
    lead: 'Nose surgery is a calculation. Shape, breathing, anatomy and recovery time are linked to one another. The decisions are made before the operation, not during it.',
    note: 'At the consultation the surgeon examines the anatomy, explains which tasks the operation addresses and which it does not, and goes through the risks. Results depend on individual characteristics and cannot be the same for different people.',
  },
  doctor: {
    label: '[03] About the doctor',
    title: 'An ENT surgeon by training, a rhinoplasty surgeon in practice.',
    lead: 'Eldar Kamalov was born in Makhachkala, into the family of Shamsutin Kamalov, an ENT and plastic surgeon. He assisted his father while still a student - that is where both the speciality and the school of thought come from. In 2016 he opened a clinic and named it after his father. Today he operates in Dubai.',
    stats: [
      { value: '30+', caption: 'years in medicine' },
      { logo: 'media/logos/lotos.svg', wide: true, caption: 'Crystal Lotus award laureate, 2017' },
      { logo: 'media/logos/soc-rhinoplasty.png', caption: 'member of the European Rhinoplasty Society' },
      { logo: 'media/logos/soc-rspras.png', caption: 'member of RSPRAS' },
    ],
    fullName: 'Eldar Shamsutinovich Kamalov',
    timelineLabel: '// Path',
    timelineMore: 'Show more',
    timelineLess: 'Collapse',
    timeline: [
      { year: '1988', text: 'Entered the Dagestan State Medical Institute' },
      { year: '1994', text: 'Graduated in general medicine, qualified as a physician' },
      { year: '2003', text: 'Defended his thesis, PhD in Medicine' },
      { year: '2016', text: 'Opened a clinic and named it after his father' },
      { year: '2017', text: 'Crystal Lotus award in the field of rhinoplasty' },
      { year: '2020', text: 'Specialist certificate in otorhinolaryngology' },
      { year: '2021', text: 'Completed a residency in plastic surgery' },
      { year: '2025', text: 'Registered with the Dubai Health Authority. Consultations and surgery at Dubai London Hospital' },
    ],
    docsLabel: '// Documents',
    docs: [
      // Надпись вместо герба, см. пояснение в русской версии
      { file: 'doc-dha-2025.jpg', mark: 'DHA', title: 'DHA registration, Dubai' },
      { file: 'doc-diploma-1994.jpg', logo: 'media/logos/org-dgmu.png', title: 'Medical degree, 1994' },
      { file: 'doc-phd-2003.jpg', logo: 'media/logos/org-rgmu.png', title: 'PhD in Medicine, 2003' },
      { file: 'doc-ent-2020.jpg', logo: 'media/logos/org-nuc.png', title: 'Specialist certificate, 2020' },
      { file: 'doc-course-2020.jpg', logo: 'media/logos/org-nuc.png', title: 'Professional development, 2020' },
      { file: 'doc-residency-2021.jpg', logo: 'media/logos/org-mgupp.png', title: 'Residency, 2021' },
      // Letter of appreciation, 2024 - убрано, см. пояснение в русской версии выше.
    ],
    portraitAlt: 'Eldar Kamalov',
    photoAlt: 'Shamsutin Kamalov, ENT and plastic surgeon, archive photograph',
    photoCaption: 'Shamsutin Kamalov - ENT and plastic surgeon. Father and first teacher.',
  },
  rhinoplasty: {
    label: '[04] Rhinoplasty',
    title: 'Shape and breathing are one task, not two.',
    lead: 'Rhinoplasty changes the shape of the nose: the hump, the tip, the nostrils, the width of the bridge. Along with the shape the surgeon looks at breathing - the internal framework of the nose is responsible for both, so they cannot be changed separately.',
    facts: [
      { mark: 'Shape', text: 'Hump, tip, nostrils, width of the bridge, proportions of the nose relative to the face' },
      { mark: 'Breathing', text: 'Nasal breathing, including cases with a deviated septum - the operations are then combined' },
      { mark: 'Revision', text: 'Correction after previous nose surgery' },
      { mark: 'Trauma', text: 'Restoring the shape and patency of the nose after an injury' },
      { mark: 'Technique', text: 'Open and closed rhinoplasty. The approach is chosen by the task and the anatomy, not by preference' },
    ],
    markCaption: 'Dorsum, tip, axes',
    risks: 'Rhinoplasty is a surgical operation. It is performed under anaesthesia, requires a recovery period and carries risks: swelling, temporary difficulty with nasal breathing, changes in sensation, the possibility of a revision procedure. The surgeon goes through them at the consultation, before any decision is made. The outcome depends on the anatomy and on how the tissues heal, and cannot be the same for different people.',
  },
  septoplasty: {
    label: '[05] Septoplasty',
    title: 'An operation about breathing, not about shape.',
    lead: 'Septoplasty returns the nasal septum to the correct position. The task is functional - to restore free nasal breathing. The external shape of the nose is not changed.',
    facts: [
      { mark: 'Indication', text: 'Persistent difficulty with nasal breathing related to a deviated septum' },
      { mark: 'The procedure', text: 'The septum is straightened from the inside, without changing the external shape of the nose' },
      { mark: 'Combined', text: 'Where needed it is combined with rhinoplasty - one operation instead of two' },
      { mark: 'Decision', text: 'Made on examination and imaging, not on a photograph of the nose' },
    ],
    markCaption: 'Septum and the airway',
    risks: 'Septoplasty is a surgical operation. It is performed with anaesthesia, requires a recovery period and carries risks: swelling, dryness in the nose, bleeding, recurrence of the deviation. The surgeon goes through them at the consultation. The outcome depends on individual characteristics and cannot be the same for different people.',
  },
  // Arabian Gulf, не Persian Gulf - местная норма, см. пояснение в русской версии
  clinic: {
    label: '[06] Where he sees patients',
    title: 'An inpatient hospital with round-the-clock care',
    lead: 'Consultations, tests and surgery all take place at Dubai London Hospital - a private hospital on the Jumeirah beachfront, two kilometres from the Burj Al Arab. A dedicated ENT department, the operating theatres and wards are under one roof: after surgery the patient stays in the same building, with no transfers between clinics.',
    stamps: [
      {
        imgAlt: 'The mark of the Australian Council on Healthcare Standards (ACHS)',
        caption: 'ACHSI international hospital accreditation',
      },
      { caption: 'consultations in Russian and English' },
    ],
    mapLabel: '// Where the hospital is',
    map: {
      alt: 'Map of Dubai from Palm Jumeirah to Umm Suqeim: Dubai London Hospital stands on Jumeirah Beach Road, two kilometres north-east of the Burj Al Arab',
      sea: 'Arabian Gulf',
      road: 'Jumeirah Beach Road',
      hospital: 'Dubai London Hospital',
      area: 'Umm Suqeim 2',
      coords: '25.15° N · 55.20° E',
      burj: 'Burj Al Arab',
      palm: 'Palm Jumeirah',
      scale: '5 km',
    },
    address: '760, Jumeirah Beach Road · Umm Suqeim 2 · Dubai',
    gallery: [
      {
        file: 'clinic/facade.jpg',
        w: 402,
        h: 575,
        caption: 'The hospital entrance from Jumeirah Beach Road',
        alt: 'The facade of Dubai London Hospital seen from Jumeirah Beach Road',
      },
      {
        file: 'clinic/consulting.jpg',
        w: 1200,
        h: 800,
        caption: 'A consulting room',
        alt: 'A consulting room at Dubai London Hospital',
      },
      {
        file: 'clinic/ward-view.jpg',
        w: 1200,
        h: 800,
        caption: 'A single inpatient room',
        alt: 'A single inpatient room at Dubai London Hospital',
      },
    ],
  },
  viewer: {
    close: 'Close',
    prev: 'Previous photo',
    next: 'Next photo',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
  },
  treatment: {
    label: '[07] How treatment works',
    title: 'Six steps from enquiry to the final check-up.',
    lead: 'The order is the same for rhinoplasty and septoplasty. The decision to operate is made only after an in-person examination - never from a photograph of the nose.',
    stepWord: 'Step',
    steps: [
      {
        title: 'Enquiry',
        text: 'You leave a request on the site or write on WhatsApp. The clinic gets in touch and arranges a time.',
      },
      {
        title: 'Consultation',
        text: 'An in-person appointment at Dubai London Hospital. The surgeon examines the nose outside and inside, goes through the anatomy, explains which tasks the operation addresses and which it does not, and talks through the risks.',
        photo: 'consulting-room.jpg',
        photoAlt: 'Consulting room at Dubai London Hospital',
      },
      {
        title: 'Tests and the plan',
        text: 'Blood tests, imaging, a review by the anaesthetist. Based on the results the surgeon draws up the plan and agrees a date.',
        photo: 'imaging.jpg',
        photoAlt: 'CT imaging room at Dubai London Hospital',
      },
      {
        title: 'Surgery',
        text: 'Carried out at the hospital, under anaesthesia. How long it takes depends on the extent of the procedure and is discussed in advance.',
        photo: 'operating-room.jpg',
        photoAlt: 'Operating theatre at Dubai London Hospital',
      },
      {
        title: 'The first days',
        text: 'Observation on the ward, then removal of the splint and stitches at the times the surgeon sets as healing progresses.',
        photo: 'ward.jpg',
        photoAlt: 'Patient room at Dubai London Hospital',
      },
      {
        title: 'Follow-up',
        text: 'Scheduled check-ups. Between visits you can put questions to the clinic - to the same surgeon who operated.',
      },
    ],
  },
  recovery: {
    label: '[08] Recovery',
    title: 'How long it takes.',
    lead: 'Recovery is part of the operation, not an appendix to it. Below are the usual timings. They depend on the extent of the procedure and on how the tissues heal, so they differ from one person to another.',
    columns: { when: 'When', what: 'What happens' },
    rows: [
      { when: 'Days 1-2', what: 'Observation at the clinic. Swelling and nasal congestion are at their most noticeable' },
      { when: '7-10 days', what: 'The splint comes off. Breathing through the nose gets easier, though swelling remains' },
      { when: '2 weeks', what: 'The main swelling subsides. Most people return to work and to air travel around this point' },
      { when: '1 month', what: 'Changes are no longer noticeable to others. Sport, pool and sea - once the surgeon allows it' },
      { when: '6-12 months', what: 'The shape of the nose settles for good. Minor swelling resolves gradually' },
    ],
    noteLabel: 'What to keep in mind',
    note: 'The timings above are a guide, not a promise. They depend on the extent of the operation, on individual tissue characteristics and on how closely instructions are followed. The surgeon gives you the timings for your own case at the consultation, after examining you.',
    sunLabel: '// A note on the sun',
    sun: 'In the climate of the Emirates this matters more than it might seem: surgeons restrict direct sun on fresh scars and during the swelling period for longer than almost anything else. The surgeon sets the period and the means of protection at your follow-up.',
  },
}

/*
  Тексты прогоняются через типограф один раз при сборке словаря: короткие предлоги
  и союзы приклеиваются к следующему слову неразрывным пробелом и переносятся вместе
  с ним. Делать это на каждую отрисовку было бы расточительно, а тексты не меняются.
*/
export const messages = {
  ru: typoDeep(ru),
  en: typoDeep(en),
}

export type Messages = typeof ru
