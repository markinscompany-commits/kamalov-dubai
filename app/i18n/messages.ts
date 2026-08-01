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
