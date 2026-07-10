const Joi = require("joi");

const createProductValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),

    description: Joi.string().required(),

    price: Joi.number().min(0).required(),

    category: Joi.string().required(),

    stock: Joi.number().min(0).required(),

    image: Joi.string().allow("").optional(),
  });

  return schema.validate(data);
};

const updateProductValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number(),
    category: Joi.string(),
    stock: Joi.number(),
  });

  return schema.validate(data);
};

module.exports = {
  createProductValidation,
  updateProductValidation
};