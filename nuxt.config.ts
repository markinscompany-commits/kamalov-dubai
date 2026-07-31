// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-07-31',
  devtools: { enabled: true },

  modules: ['@nuxt/fonts'],

  css: ['~/assets/css/tokens.css', '~/assets/css/base.css'],

  // Шрифты самохостим: аудитория в ОАЭ, каждый внешний домен — лишняя задержка
  fonts: {
    families: [
      { name: 'Cormorant Garamond', provider: 'google', weights: [300, 400], styles: ['normal', 'italic'] },
      { name: 'IBM Plex Sans', provider: 'google', weights: [400, 500] },
      { name: 'IBM Plex Mono', provider: 'google', weights: [400] },
    ],
    defaults: {
      // кириллица обязательна — основная аудитория кампании русскоязычная
      subsets: ['latin', 'cyrillic'],
    },
  },

  app: {
    // На GitHub Pages сайт лежит в подпапке /kamalov-dubai/.
    // Значение подставляется переменной NUXT_APP_BASE_URL при сборке в GitHub Actions,
    // локально остаётся «/».
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'ru' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#f4efe6' },
      ],
    },
  },

  // Полностью статическая сборка: HTML отдаётся готовым, отдельный сервер не нужен
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },
})
