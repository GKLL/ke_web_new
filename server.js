const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const session = require('cookie-session')
const app = require('express')()
const router = require('express').Router()
const port = process.env.PORT || 9002

app.use(bodyParser.json())

app.use(session({
  secret: 'kg',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2 * 24 * 60 * 60 * 1000 }
}))

// 用户发起登录请求, 成功后添加用户信息到 req.session.KGUser
router.post('/api/login', (req, res) => {
  if (req.body.token) {
    req.session.KGUser = { token: req.body.token, userId: req.body.userId }
    return res.json({ token: req.body.token, userId: req.body.userId })
  }

  res.status(401).json({message: '401 Bad credentials'})
})

// 用户发起注销请求
router.post('/api/logout', (req, res) => {
  if (req.session.KGUser) {
    if (delete req.session.KGUser) {
      console.log('==============Note=====================')
      console.log('delete session KGUser success')
      console.log('=======================================')
      return res.json({ ok: true })
    } else {
      return res.json({ error: 'delete session KGUser faild' })
    }
  } else {
    return res.json({ info: 'no session' })
  }
})

app.use(router)

// 初始化 nuxt.js
let config = require('./nuxt.config.js')
const nuxt = new Nuxt(config)
app.use(nuxt.render)

console.log('NODE_ENV', process.env.NODE_ENV)
console.log('__ENV', process.env.__ENV)

if(config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
  .catch((error) => {
      console.log(error)
      process.exit(1)
  })
}

// 监听指定端口
app.listen(port, '0.0.0.0')
console.log('服务器运行于 localhost:' + port)
