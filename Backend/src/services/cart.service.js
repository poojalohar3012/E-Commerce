const { get } = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const { addToCartValidation, updateCartValidation} = require("../validators/cart.validator");

const addToCart = async (userId, data) => {

  const { error } = addToCartValidation(data);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { productId, quantity } = data;
    const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }
    let cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
  cart = await Cart.create({
    user: userId,
    items: [
      {
        product: productId,
        quantity,
      },
    ],
  });

  return cart;
}

const itemIndex = cart.items.findIndex(
  (item) => item.product.toString() === productId
);

if (itemIndex > -1) {
  cart.items[itemIndex].quantity += quantity;
}else {
  cart.items.push({
    product: productId,
    quantity,
  });
}
await cart.save();

return cart;
};

const getCart = async (userId) => {
    const cart = await Cart.findOne({
  user: userId,
}).populate("items.product");
if (!cart) {
  throw new ApiError(404, "Cart is empty");
}
let totalItems = 0;
let totalAmount = 0;

cart.items.forEach((item) => {
  totalItems += item.quantity;
  totalAmount += item.product.price * item.quantity;
});

return {
  totalItems,
  totalAmount,
  data: cart,
};
};


const updateCart = async (userId, productId, data) => {

  const { error } = updateCartValidation(data);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new ApiError(404, "Product not found in cart");
  }

  // Update quantity
  cart.items[itemIndex].quantity = data.quantity;

  // Save changes
  await cart.save();

  // Return updated cart
  return cart;
};

const deleteCart = async (userId, productId) => {

  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new ApiError(404, "Product not found in cart");
  }

  // Delete quantity
 cart.items.splice(itemIndex, 1);

  // Save changes
  await cart.save();

  // Return updated cart
  return cart;
};


const clearCart = async (userId) => {

  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Remove all items
  cart.items = [];

  await cart.save();

  return cart;
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  deleteCart,
  clearCart
};

