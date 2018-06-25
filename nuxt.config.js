const path = require('path')
const svgoConfig = require('./config/svgo-config.json')
const ICON_PATH = 'assets/img/svg-icons'

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'kg_web_new',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' },
      { hid: 'description', name: 'description', content: 'KG new Web' },
      { name: "renderer", content: "webkit" }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Router config
  *  路由中间件配置，可在此配置当路由变化时需要条用的中间件
  */
  router: {
    middleware: ['check-auth', 'check-device']
  },

  /**
   * 缓存配置
   */
  cache: process.env.__ENV === 'production' || process.env.__ENV === 'test' ? { max: 20, maxAge: 900000 } : false,

  /**
   *  全局CSS配置, 可引入全局的CSS配置，比如normalize.css 或 自定义的 main.css
   */
  css: [
    { src: 'assets/stylus/main.styl', lang: 'stylus' }
  ],

  /*
  ** Plugins
  */
  plugins: [
    { src: '~plugins/lazy-load', ssr: false },
    { src: '~plugins/element-ui', ssr: true },
    { src: '~plugins/video-player', ssr: false }
  ],

  /*
  ** Build configuration
  */
  build: {
    /**
     *  可视化性能分析，若要查看打包后的性能分析，可通过 `nuxt build --analyze` 或 `nuxt build -a`
     *  来构建分析代码，结果可在 http://localhost:8888 查看
     */
    analyze: {
      analyzerMode: 'static'
    },

    /**
     *  第三方库打包，也可将自定义库加入
     */
    vendor: ['axios', 'element-ui', 'v-distpicker', 'vue-cropper'],

    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      /**
       *  获取Nuxt中默认的Webpack配置，并删除掉原有配置，加入exclude属性
       *  默认不处理svg，使用单独的配置处理svg
       */
      const rule = config.module.rules.find(r => r.test.toString() === '/\\.(png|jpe?g|gif|svg)$/')
      config.module.rules.splice(config.module.rules.indexOf(rule), 1)

      config.module.rules.push({
        test: /\.(png|jpe?g|gif|svg|webp)$/,
        loader: 'url-loader',
        exclude: [ path.resolve(ICON_PATH) ],
        query: {
          limit: 1000, // 1KO
          name: 'img/[name].[hash:7].[ext]'
        }
      })

      config.module.rules.push({
        test: /\.svg$/,
        include: [ path.resolve(ICON_PATH) ],
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              symbolId: 'icon-[name]'
            }
          },
          {
            loader: 'svgo-loader',
            options: svgoConfig
          }
        ]
      })
    },

    /*
    ** Postcss配置
    */
    postcss: [
      require('postcss-nested')(),
      require('postcss-responsive-type')(),
      require('postcss-hexrgba')(),
      require('autoprefixer')({
        browsers: ['last 3 versions']
      })
    ]
  },

  env: {
    __ENV: process.env.__ENV
  },

  dev: (process.env.NODE_ENV !== 'production')
}
