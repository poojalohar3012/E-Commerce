const asyncHandler = require("../utils/asyncHandler");
const cartService = require("../services/cart.service");

const addToCart = asyncHandler(async (req, res) => {
  const cart = await cartService.addToCart(
    req.user.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Product added to cart successfully.",
    data: cart,
  });
});

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);

  res.status(200).json({
    success: true,
     data: cart,
  });
});

const updateCart = asyncHandler(async (req, res) => {

    const cart = await cartService.updateCart(
        req.user.id,
        req.params.productId,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Cart updated successfully.",
        data: cart,
    });

});

const deleteCart = asyncHandler(async (req, res) => {

    const cart = await cartService.deleteCart(
        req.user.id,
        req.params.productId,
    );

    res.status(200).json({
        success: true,
        message: "Cart deleted successfully.",
        data: cart,
    });

});

const clearCart = asyncHandler(async (req, res) => {

  const cart = await cartService.clearCart(req.user.id);

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully.",
    data: cart,
  });

});

module.exports = {
  addToCart,
  getCart,
  updateCart,
  deleteCart,
  clearCart
};

