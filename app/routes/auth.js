var router = require('express').Router()

const { auth } = require('../controllers/index')

module.exports = app => {
  router.post('/login', auth.login)
  router.post('/reset-password-email', auth.forgotPassword)
  router.post('/update-password', auth.forgotPasswordVerify)
  router.get('/me', auth.me)
  router.post('/users/verify', auth.userVerify)

  app.use('/', router)
}