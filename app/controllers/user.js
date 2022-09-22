const md5 = require('md5')

const { User } = require('../models/index')
const { handleError, handleSearchQuery, getPagination, getPagingResults, handleResponse, sortingData, createUUID, sendEmail } = require('../utils/helper')
const { createUser } = require('./schema')

exports.create = async (req, res) => {

  const { error } = createUser.validate(req.body,)

  if (error) {
    handleError(error, req, res)
    return
  }

  const data = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: md5(req.body.password),
    mobile_number: req.body.mobile_number,
    username: req.body.username,
    address1: req.body.address1,
    address2: req.body.address2,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    token: createUUID(),
    status: 'pending',
  }

  User.create(data)
    .then(data => {

      const subject = 'Your account verify'
      const message = ` <div style="margin:auto; width:70%">
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:60%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="https://piecodes.in/" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Sandbox4project</a>
      </div>
      <p style="font-size:25px">Hello ${data.first_name} ${data.last_name},</p>
      
      <p>Use the code below to recover access to your Sanbox4project account.</p>
     
      <h3 style="background:#e6f3ff;width:full;margin: 0 auto;padding:10px;">
      Token: 
      ${data.token}</h3>
      
      <p>The account verification code  is only valid for 24 hours after it’s generated. If your code has already expired, you can restart the recovery process and generate a new code.
      If you haven't initiated an account recovery or password reset in the last 24 hours, ignore this message.</p>

      <p style="font-size:0.9em;">Best Regards,<br />Sandbox4project</p>
    </div>
  </div>
  </div>`

      sendEmail(data.email, subject, message)
      handleResponse(res, data, 'Your account has been created successfully.')
    })
    .catch(err => {
      handleError(err, req, res)
    })
}

exports.findAll = (req, res) => {
  const { page, size, sort } = req.query
  const { limit, offset } = getPagination(page, size)

  const sortResponse = sortingData(req)

  User.findAndCountAll(
    {
      where: handleSearchQuery(req, ['first_name', 'last_name', 'email', 'id']),
      order: [[sortResponse.sortKey, sortResponse.sortValue]],
      limit, offset,
      attributes: { exclude: ['password'] },
    })
    .then(data => {
      handleResponse(res, getPagingResults(data, page, limit))
    }).catch(err => {
      handleError(err, req, res)
    })
}

exports.findOne = (req, res) => {

  User.findByPk(req.params.id, {
  })
    .then(data => {
      handleResponse(res, data)
    }).catch(err => {
      handleError(err, req, res)
    })
}

exports.update = (req, res) => {

  User.update(req.body, { where: { id: req.params.id } })
    .then(data => {
      handleResponse(res, data)
    }).catch(err => {
      handleError(err, req, res)
    })
}

exports.delete = (req, res) => {

  User.destroy({
    where: { id: req.params.id }
  }).then(data => {
    handleResponse(res, data)
  }).catch(err => {
    handleError(err, req, res)
  })
}