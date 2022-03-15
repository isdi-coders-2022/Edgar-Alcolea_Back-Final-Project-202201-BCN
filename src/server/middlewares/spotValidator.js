const { Joi } = require("express-validation");

const spotValidator = {
  body: Joi.object({
    name: Joi.string(),
    description: Joi.string().min(20).max(300),
    location: Joi.string().min(10).max(100),
    coordinates: Joi.string(),
    image: Joi.string(),
  }),
};

module.exports = spotValidator;
