const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),

  description: Joi.string().trim().min(3).max(500).required(),

  image: Joi.string().uri().required(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(3).max(50),

  description: Joi.string().trim().min(3).max(500),

  image: Joi.string().uri(),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
