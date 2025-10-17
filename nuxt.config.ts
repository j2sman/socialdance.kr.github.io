// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  colorMode: {
    disableTransition: true,
    fallback: 'light',
    preference: 'light',
  },

  compatibilityDate: '2024-07-11',

  css: ['~/assets/css/main.css'],

  // Enables the development server to be discoverable by other devices when running on iOS physical devices
  devServer: {
    host: 'localhost',
    port: 12180,
  },

  devtools: {
    enabled: true,
  },

  eslint: {
    config: {
      stylistic: {
        braceStyle: '1tbs',
        commaDangle: 'never',
      },
    },
  },

  // i18n 설정
  i18n: {
    defaultLocale: 'ko',
    detectBrowserLanguage: {
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      useCookie: true,
    },
    langDir: 'locales/',
    locales: [
      { code: 'ko', file: 'ko.json', name: '한국어' },
      { code: 'en', file: 'en.json', name: 'English' },
    ],
    strategy: 'prefix_except_default',
  },

  modules: ['@nuxt/eslint', '@nuxt/ui', '@vueuse/nuxt', '@nuxtjs/supabase', '@nuxtjs/i18n'],

  // Cloudflare Pages 설정
  nitro: {
    experimental: {
      wasm: true,
    },
    preset: 'cloudflare-pages',
  },

  routeRules: {
    '/api/**': {
      cors: true,
    },
  },

  // 런타임 설정
  runtimeConfig: {
    googleCalendarApiKey: process.env.GOOGLE_CALENDAR_API_KEY,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    kakaoMapApiKey: process.env.KAKAO_MAP_API_KEY,
    naverMapClientId: process.env.NAVER_MAP_CLIENT_ID,
    naverMapClientSecret: process.env.NAVER_MAP_CLIENT_SECRET,
    // 클라이언트에서도 접근 가능
    public: {
      apiBase:
        process.env.NODE_ENV === 'production'
          ? 'https://your-domain.com/api'
          : 'http://localhost:8787/api',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      supabaseUrl: process.env.SUPABASE_URL,
    },
    sessionSecret: process.env.SESSION_SECRET,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

    // 서버 사이드에서만 접근 가능
    supabaseUrl: process.env.SUPABASE_URL,
  },
})
