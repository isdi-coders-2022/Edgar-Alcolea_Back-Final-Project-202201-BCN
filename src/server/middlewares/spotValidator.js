const { Joi } = require("express-validation");

const spotValidator = Joi.object({
  name: Joi.string().required(),
  marked: Joi.number().default(0),
  description: Joi.string().min(20).max(300),
  createdBy: Joi.string(),
  markedBy: Joi.array().default([]),
  location: Joi.string().min(10).max(100),
  coordinates: Joi.array(),
  image: Joi.string().required(),
});

module.exports = spotValidator;
