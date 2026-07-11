
const mongoose = require("mongoose");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const { createProductValidation, updateProductValidation } = require("../validators/product.validator");

const uploadToCloudinary = require("../utils/cloudinaryUpload");

const createProduct = async (data, file, userId) => {
  const { error } = createProductValidation(data);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  if (!file) {
    throw new ApiError(400, "Product image is required");
  }

  const uploadedImage = await uploadToCloudinary(file.buffer);

  const product = await Product.create({
    ...data,
    image: {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
    },
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

const updateProduct = async (id, data, file) => {
  const { error } = updateProductValidation(data);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  // Find existing product
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // If a new image is uploaded
  if (file) {
    // Delete old image from Cloudinary
    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    // Upload new image
    const uploadedImage = await uploadToCloudinary(
      file.buffer,
      "ecommerce-products"
    );

    // Update image data
    data.image = {
      url: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
    };
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedProduct;
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

