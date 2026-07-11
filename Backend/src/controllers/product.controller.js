
const productService = require("../services/product.service");
const asyncHandler = require("../utils/asyncHandler");

const createProduct = asyncHandler(async (req, res) => {

    const product = await productService.createProduct(
        req.body,
        req.file,
        req.user.id
    );

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
    });
});

const getAllProducts = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);

  res.status(200).json({
    success: true,
    message:
      result.count > 0
        ? "Products fetched successfully."
        : "No products found.",
    ...result,
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  res.status(200).json({
    success: true,
    data: product,
  });
});

const updateProduct = asyncHandler(async (req, res) => {

    const product = await productService.updateProduct(
        req.params.id,
        req.body,
        req.file
    );

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product
    });

});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};