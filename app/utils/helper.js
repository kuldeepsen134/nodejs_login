const nodemailer = require('nodemailer')

const { Session, User, } = require('../models')

exports.handleError = (error, req, res,) => {
  console.log('error', error)

  if (error.details) {
    error.details.map((item) => {
      res.status(400).send({
        message: item.message.replace(/"/g, ''),
        error: true
      })
    })

    return
  }

  res.status(400).send({
    error: true,
    message: error.error ? error.error.message : error?.errors ? error.errors?.map(e => e.message) : error?.original?.sqlMessage ? error?.original?.sqlMessage : error.message ? error : error,
  })
}

exports.handleResponse = (res, data, message) => {
  res.status(200).send({ data, message, error: false, })
}

exports.getUser = async (params) => {

  const session = await Session.findOne({ where: { access_token: params } })

  if (session) {
    const user = await User.findOne({ where: { id: session.user_id } })

    if (user) {

      return user.id
    }
    else {

      return {
        message: 'User does not exist in user table.'
      }
    }
  }
  else {

    return {
      message: 'User does not exist in user table.'
    }
  }
}

const { Op } = require('sequelize')

exports.handleSearchQuery = (req, fields,) => {

  const { filters, q } = req.query
  const query = []

  let queryKeys = fields.map((key) => {

    return { [key]: { [Op.like]: `${q}` } }
  })

  q && query.push({
    [Op.or]: queryKeys
  })

  filters && query.push(filters)

  return query
}

exports.getPagination = (page, size) => {
  const limit = size ? +size : 50
  const offset = page ? (page - 1) * limit : 0

  return { limit, offset }
}

exports.getPagingResults = (data, page, limit) => {
  const { count: total_items, rows: items } = data
  const current_page = page ? +page : 1
  const total_pages = Math.ceil(total_items / limit)
  const per_page = limit
  return { items, pagination: { total_items, per_page, total_pages, current_page } }
}


exports.generateOTP = () => {
  var digits = '0123456789'; var otpLength = 6; var otp = ''

  for (let i = 1; i <= otpLength; i++) {
    var index = Math.floor(Math.random() * (digits.length))
    otp = otp + digits[index]
  }

  return otp
}

exports.createUUID = () => {
  var dt = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })

  return uuid
}

exports.sortingData = (req) => {
  const { sort } = req.query

  const sortKey = sort ? sort.replace('-', '') : 'created_at'
  const sortValue = sort ? sort.includes('-') ? 'DESC' : 'ASC' : 'DESC'

  return { sortKey, sortValue }
}

exports.sendEmail = async (email, subject, message) => {

  const transporter = nodemailer.createTransport({
    host: `${process.env.EMAIL_HOST}`,
    port: `${process.env.EMAIL_PORT}`,
    auth: {
      user: `${process.env.EMAIL_USER}`,
      pass: `${process.env.EMAIL_PASSWORD}`
    },
    // secure: true
  })

  const data = {
    from: `${process.env.EMAIL_FROM}`,
    to: `${email}`,
    subject: `${subject} - Sandbox4box`,
    html: `${message}`,
  }

  transporter.sendMail(data, (error, info) => {
    if (error) {
      res.status(error.responseCode).send(error)
    }
  })

  return
}