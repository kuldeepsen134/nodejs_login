const nodemailer = require('nodemailer')

const md5 = require('md5')

const { User, Session } = require('../models')

const { handleError, createUUID, handleResponse, sendEmail, getUser } = require('../utils/helper')
const { accountVerifyUser, forgotPasswordUser, forgotPasswordVerifyUser, loginUser } = require('./schema')

exports.userVerify = async (req, res) => {

  const { error } = accountVerifyUser.validate(req.body,)
  if (error) {
    handleError(error, req, res)
    return
  }

  const user = await User.findOne({ where: { id: req.body.user_id, token: req.body.token } })

  if (user) {
    User.update({
      token: null,
      status: 'active'
    },
      { where: { id: user.id } })
      .catch(err => {
        handleError(err, req, res)
      })
    return handleResponse(res, [], 'your account successfully activated')
  }
  else {
    return handleError('Token does not vailid', req, res)
  }
}

exports.login = async (req, res) => {

  const { error } = loginUser.validate(req.body,)

  if (error) {
    handleError(error, req, res)
    return
  }

  const user = await User.findOne({ where: { email: req.body.email, password: md5(req.body.password) } })

  if (user === null) {
    handleError('The combination of password and email is not vailid', req, res)
  }
  else
    if (user.status === 'active') {

      if (user) {

        const session = await Session.findOne({ where: { user_id: user.id } })

        if (session) {
          const uuid = createUUID()
          session.update({
            access_token: uuid,
          }, {
            where: { id: user.id }
          })

          return handleResponse(res, uuid, `Logged in successFully.`)
        }

        else {
          const data = {
            access_token: createUUID(),
            user_id: user.id
          }

          Session.create(data)
            .then(data => {
              return handleResponse(res, data, `Logged in successFully.`)
            }).catch(err => {
              handleError(err, req, res)
            })
        }
      }
      else {
        handleError('Email or Password Incorrect.', req, res)
      }
    }
    else {
      handleError('Account is not active.', req, res)
    }
}

exports.forgotPassword = async (req, res) => {

  const { error } = forgotPasswordUser.validate(req.body,)

  if (error) {
    handleError(error, req, res)
    return
  }

  const user = await User.findOne({ where: { email: req.body.email } })

  if (user === null) {
    res.status(400).send({ error: true, message: 'User not found' })
  }

  if (user) {
    const email = req.body.email
    const token = createUUID()

    const subject = 'Your forgot password code'

    const message = ` <div style="margin:auto; width:70%">
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:60%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="https://piecodes.in/" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Sandbox4project</a>
      </div>
      <p style="font-size:25px">Hello ${user.first_name} ${user.last_name},</p>
      
      <p>Use the code below to recover access to your Sanbox4project account.</p>
     
      <h3 style="background:#e6f3ff;width:full;margin: 0 auto;padding:10px;">
      Recovery code: 
      ${token}</h3>
      
      <p>The recovery code is only valid for 24 hours after it’s generated. If your code has already expired, you can restart the recovery process and generate a new code.
      If you haven't initiated an account recovery or password reset in the last 24 hours, ignore this message.</p>

      <p style="font-size:0.9em;">Best Regards,<br />Sandbox4project</p>
    </div>
  </div>
  </div>`

    User.update({
      email: email,
      token: token
    },
      { where: { id: user.id } })
      .then(data => {
        sendEmail(email, user.first_name, subject, message)
        handleResponse(res, data, `We have sent recovery code to the email on aas***@***ail.com`)
      })
      .catch(err => {
        handleError(err, req, res)
      })
  }
}

exports.forgotPasswordVerify = async (req, res) => {
  const { error } = forgotPasswordVerifyUser.validate(req.body,)

  if (error) {
    handleError(error, req, res)
    return
  }

  const user = await User.findOne({ where: { token: req.body.token, email: req.body.email } })

  if (user) {

    if (req.body.new_password === req.body.confirm_password) {

      User.update({
        token: null,
        password: md5(req.body.new_password),
        status: 'active'
      },
        {
          where: { id: user.id }
        })
        .then(data => {
          return handleResponse(res, [], 'You have successfully reset your password')
        })
        .catch(err => {
          handleError(err, req, res)
        })
    }
    else
      return handleError('Password and confirm password should be same.', req, res)
  }
  else
    if (!user) {
      return handleError('This verification link has already been used', req, res)
    }
}

exports.me = async (req, res) => {

  const userId = await getUser(req.headers.authorization)

  if (userId) {

    const user = await User.findOne({ where: { id: userId } })

    return handleResponse(res, user, 'Me login is successfully')
  }
  else handleError('Unauthorized user!', req, res)
}