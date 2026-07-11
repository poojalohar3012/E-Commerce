const Joi = require("joi");

const addToCartValidation = (data) => {
  const schema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).default(1),
  });

  return schema.validate(data);
};

const updateCartValidation = (data) => {
  const schema = Joi.object({
    quantity: Joi.number().integer().min(1).required(),
  });

  return schema.validate(data);
};

module.exports = {
  addToCartValidation,
  updateCartValidation
};