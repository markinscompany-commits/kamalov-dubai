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
      'Эльдар Камалов - пластический хирург, ринопласт. Кандидат медицинских наук, 30 лет практики. Приём в Dubai London Hospital, лицензия DHA. Запись на консультацию.',
  },
  nav: {
    /*
      short — подпись для строки разделов в шапке. Строка живёт в левой, чернильной
      половине первого экрана и не имеет права её пересекать. На английском названия
      длиннее, поэтому там подписи короче; в самом меню всегда полные.
    */
    links: [
      { label: 'О докторе', short: 'О докторе', href: '#doctor', service: false },
      { label: 'Ринопластика', short: 'Ринопластика', href: '#rhinoplasty', service: true },
      { label: 'Септопластика', short: 'Септопластика', href: '#septoplasty', service: true },
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
  hero: {
    eyebrow: '[01] Принимает в Dubai London Hospital',
    name: 'Эльдар Камалов',
    specMain: 'пластический хирург,',
    specEm: 'ринопласт',
    creds: ['Кандидат медицинских наук, 30 лет практики,', 'член Европейского общества ринопластов'],
    photoAlt: 'Эльдар Камалов, пластический хирург',
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
      { value: '2017', caption: 'премия «Хрустальный Лотос»' },
      { value: 'DHA', caption: 'регистрация в Дубае' },
    ],
    // Хронология. Все годы сверены со сканами документов в assets-temp/docs
    timelineLabel: '// Путь',
    timeline: [
      { year: '1988', text: 'Поступил в Дагестанский государственный медицинский институт' },
      { year: '1994', text: 'Окончил институт по специальности «лечебное дело», квалификация врача' },
      { year: '2003', text: 'Защитил диссертацию, кандидат медицинских наук' },
      { year: '2016', text: 'Открыл клинику и назвал её именем отца' },
      { year: '2017', text: 'Премия «Хрустальный Лотос» в области ринопластики' },
      { year: '2020', text: 'Сертификат специалиста по оториноларингологии' },
      { year: '2021', text: 'Ординатура по пластической хирургии, квалификация врача-пластического хирурга' },
      { year: '2025', text: 'Регистрация в департаменте здравоохранения Дубая. Приём и операции - в Dubai London Hospital' },
    ],
    societies: 'Член Европейского общества ринопластов и Общества пластических, реконструктивных и эстетических хирургов России.',
    docsLabel: '// Документы',
    docs: [
      { file: 'doc-diploma-1994.jpg', title: 'Диплом врача', meta: '1994 · Дагестанский медицинский институт' },
      { file: 'doc-phd-2003.jpg', title: 'Кандидат медицинских наук', meta: '2003 · диссертационный совет РГМУ' },
      { file: 'doc-ent-2020.jpg', title: 'Сертификат специалиста', meta: '2020 · оториноларингология' },
      { file: 'doc-course-2020.jpg', title: 'Повышение квалификации', meta: '2020 · оториноларингология, 144 часа' },
      { file: 'doc-residency-2021.jpg', title: 'Диплом об окончании ординатуры', meta: '2021 · пластическая хирургия' },
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
}

const en: typeof ru = {
  meta: {
    title: 'Eldar Kamalov - rhinoplasty and septoplasty in Dubai',
    description:
      'Eldar Kamalov - plastic surgeon, rhinoplasty specialist. PhD in Medicine, 30 years in practice. Sees patients at Dubai London Hospital, DHA licensed. Book a consultation.',
  },
  nav: {
    links: [
      { label: 'About the doctor', short: 'About', href: '#doctor', service: false },
      { label: 'Rhinoplasty', short: 'Rhinoplasty', href: '#rhinoplasty', service: true },
      { label: 'Septoplasty', short: 'Septoplasty', href: '#septoplasty', service: true },
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
  hero: {
    eyebrow: '[01] Sees patients at Dubai London Hospital',
    name: 'Eldar Kamalov',
    specMain: 'plastic surgeon,',
    specEm: 'rhinoplasty specialist',
    creds: ['PhD in Medicine, 30 years in practice,', 'member of the European Rhinoplasty Society'],
    photoAlt: 'Eldar Kamalov, plastic surgeon',
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
      { value: '2017', caption: 'Crystal Lotus award' },
      { value: 'DHA', caption: 'registered in Dubai' },
    ],
    timelineLabel: '// Path',
    timeline: [
      { year: '1988', text: 'Entered the Dagestan State Medical Institute' },
      { year: '1994', text: 'Graduated in general medicine, qualified as a physician' },
      { year: '2003', text: 'Defended his thesis, PhD in Medicine' },
      { year: '2016', text: 'Opened a clinic and named it after his father' },
      { year: '2017', text: 'Crystal Lotus award in the field of rhinoplasty' },
      { year: '2020', text: 'Specialist certificate in otorhinolaryngology' },
      { year: '2021', text: 'Residency in plastic surgery, qualified as a plastic surgeon' },
      { year: '2025', text: 'Registered with the Dubai Health Authority. Consultations and surgery at Dubai London Hospital' },
    ],
    societies: 'Member of the European Rhinoplasty Society and of the Russian Society of Plastic, Reconstructive and Aesthetic Surgeons.',
    docsLabel: '// Documents',
    docs: [
      { file: 'doc-diploma-1994.jpg', title: 'Medical degree', meta: '1994 · Dagestan Medical Institute' },
      { file: 'doc-phd-2003.jpg', title: 'PhD in Medicine', meta: '2003 · Pirogov university council' },
      { file: 'doc-ent-2020.jpg', title: 'Specialist certificate', meta: '2020 · otorhinolaryngology' },
      { file: 'doc-course-2020.jpg', title: 'Professional development', meta: '2020 · otorhinolaryngology, 144 hours' },
      { file: 'doc-residency-2021.jpg', title: 'Residency diploma', meta: '2021 · plastic surgery' },
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
