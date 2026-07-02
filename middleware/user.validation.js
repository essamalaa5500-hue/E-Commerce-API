const Joi = require("joi");

const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50),

  email: Joi.string().trim().email(),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s()]{8,20}$/),

  role: Joi.string().valid("admin", "user"),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50),

  email: Joi.string().trim().email(),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s()]{8,20}$/),
});

module.exports = {
  updateUserSchema,
  updateProfileSchema,
};
