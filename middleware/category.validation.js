const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),

  description: Joi.string().trim().min(3).max(500).required(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(3).max(50),

  description: Joi.string().trim().min(3).max(500),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
