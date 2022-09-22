const Joi = require('joi')

const createUser = Joi.object().keys({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  mobile_number: Joi.string().min(10).max(13).pattern(/^[0-9]+$/).required(),
  username: Joi.string().min(6).required(),

  address1: Joi.string().required(),
  address2: Joi.string().empty(''),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required()
})

const accountVerifyUser = Joi.object().keys({
  user_id: Joi.string().required(),
  token: Joi.string().required(),
})

const loginUser = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const forgotPasswordUser = Joi.object().keys({
  email: Joi.string().email().required(),
})

const forgotPasswordVerifyUser = Joi.object().keys({
  email: Joi.string().email().required(),
  token: Joi.string().required(),
  new_password: Joi.string().min(6).required(),
  confirm_password: Joi.string().min(6).required(),
})

module.exports = {
  createUser,
  accountVerifyUser,
  loginUser,
  forgotPasswordUser,
  forgotPasswordVerifyUser,
}
