const { Joi } = require("express-validation");

const userValidator = {
  body: Joi.object({
    name: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    age: Joi.string(),
    bio: Joi.string(),
    city: Joi.string(),
    image: Joi.string(),
  }),
};

module.exports = userValidator;
