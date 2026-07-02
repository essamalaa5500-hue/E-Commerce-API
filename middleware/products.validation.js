const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),

  description: Joi.string().trim().min(3).max(3000).required(),

  price: Joi.number().min(0).required(),

  stock: Joi.number().min(0).required(),

  category: Joi.string().hex().length(24).required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50),

  description: Joi.string().trim().min(3).max(3000),

  price: Joi.number().min(0),

  stock: Joi.number().min(0),

  category: Joi.string().hex().length(24),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
