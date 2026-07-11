const express = require("express");

const router = express.Router();

const productController = require("../controllers/product.controller");

const upload = require("../middleware/upload.middleware");

const {
  protect,
  authorize,
} = require("../middleware/auth.middleware");

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  productController.createProduct
);

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

router.patch(
    "/:id",
    protect,
    authorize("admin"),
    upload.single("image"),
    productController.updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  productController.deleteProduct
);

module.exports = router;