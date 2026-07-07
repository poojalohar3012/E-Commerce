const express = require("express");

const router = express.Router();

const productController = require("../controllers/product.controller");

const {
  protect,
  authorize,
} = require("../middleware/auth.middleware");

console.log("protect:", protect);
console.log("authorize:", authorize);
console.log("createProduct:", productController.createProduct);

router.post(
  "/",
  protect,
  authorize("admin"),
  productController.createProduct
);

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

router.put(
    "/:id",
    protect,
    authorize("admin"),
    productController.updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  productController.deleteProduct
);

module.exports = router;