const { Joi } = require("express-validation");

const userValidator = Joi.object({
  name: Joi.string().required(),
  userName: Joi.string().required(),
  password: Joi.string().required(),
  age: Joi.number(),
  bio: Joi.string().min(20).max(300),
  city: Joi.string(),
  image: Joi.string().required(),
});

module.exports = userValidator;
