const express = require("express");

const router = express.Router();

const cartController = require("../controllers/cart.controller");

const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, cartController.addToCart);

router.get("/", protect, cartController.getCart);

router.put(
    "/:productId",
    protect,
    cartController.updateCart
);

router.delete("/:productId",protect,cartController.deleteCart);

router.delete(
  "/",
  protect,
  cartController.clearCart
);


module.exports = router;