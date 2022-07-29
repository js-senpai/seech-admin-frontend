import ua from './locales/ua.json'
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'seech-admin-frontend',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  server: {
    host: '127.0.0.1',
    port: 8015,
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/telegram-auth.js', mode: 'client' },
    { src: '~/plugins/datepicker.js' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/moment',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'nuxt-vue-select',
    [
      "@nuxtjs/i18n",
      {
        locales: [
          {
            code: "ua",
            iso: "ua-UA"
          }
        ],
        defaultLocale: "ua",
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: "i18n_redirected"
        },
        seo: false,
        vueI18n: {
          fallbackLocale: "ua",
          messages: {
            ua
          }
        },
        vueI18nLoader: true,
        strategy: "no_prefix",
        vuex: {
          moduleName: "i18n",
          syncLocale: true,
          syncMessages: true,
          syncRouteParams: true
        }
      }
    ],

  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.BACKEND_URL,
  },

  auth: {
    localStorage: false,
    token: {
      property: 'token',
      global: true,
      required: true,
      type: 'Bearer'
    },
    user: {
      property: 'user',
      autoFetch: true
    },
    cookie: {
      options: {
        expires: 3600
      }
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          logout: false,
          user: { url: '/user/', method: 'get' }
        }
      }
    },
    redirect: {
      logout: '/',
      callback: '/login',
      home: '/'
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    html:{
      minify:{
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyElements: true
      }
    },
  },

  publicRuntimeConfig: {
    botName: process.env.TELEGRAM_BOT_NAME,
    backendUrl: process.env.BACKEND_URL
  }

}
