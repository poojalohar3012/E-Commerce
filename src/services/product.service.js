
const mongoose = require("mongoose");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const {
  createProductValidation,
} = require("../validators/product.validator");

const createProduct = async (data, userId) => {
  const { error } = createProductValidation(data);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const product = await Product.create({
    ...data,
    createdBy: userId,
  });

  return product;
};

const getAllProducts = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;

  const skip = (page - 1) * limit;

  const search = query.search || "";

  const category = query.category || "";

  const minPrice = Number(query.minPrice);
const maxPrice = Number(query.maxPrice);

const allowedSortFields = [
  "price",
  "-price",
  "createdAt",
  "-createdAt",
  "name",
  "-name",
];
const sort = allowedSortFields.includes(query.sort)
  ? query.sort
  : "-createdAt";

  const filter = {};

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

 if (category) {
  filter.category = {
    $regex: `^${category}$`,
    $options: "i",
  };
}

if (minPrice || maxPrice) {
  filter.price = {};

  if (minPrice) {
    filter.price.$gte = minPrice;
  }

  if (maxPrice) {
    filter.price.$lte = maxPrice;
  }
}

  const products = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    count: products.length,
    data: products,
  };
};



const getProductById = async (id) => {
  // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

const updateProduct = async (id, data) => {
  const { error } = createProductValidation(data);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  console.log("ID:", id);
console.log("BODY:", data);

  const product = await Product.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};

