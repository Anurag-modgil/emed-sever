// Create a new product
// import findBySalt from "../models/product.model"
const Product = require("../models/product.model");


// Create a new product
async function createProduct(reqData) {
  const product = new Product({
    title: reqData.title,
    description: reqData.description,
    discountedPrice: reqData.discountedPrice,
    discountPersent: reqData.discountPersent,
    imageUrl: reqData.imageUrl,
    brand: reqData.brand,
    price: reqData.price,
    quantity: reqData.quantity,
    salt:reqData.salt,
  });

  const savedProduct = await product.save();

  return savedProduct;
}

// Delete a product by ID
async function deleteProduct(productId) {
  const product = await findProductById(productId);

  if (!product) {
    throw new Error("product not found with id - : ", productId);
  }

  await Product.findByIdAndDelete(productId);

  return "Product deleted Successfully";
}

// Update a product by ID
async function updateProduct(productId, reqData) {
  const updatedProduct = await Product.findByIdAndUpdate(productId, reqData);
  return updatedProduct;
}

// Find a product by ID
const findProductById = async (id) => {
  try {
    const product = await Product.findById(id).exec();

    if (!product) {
      throw new Error("Product not found with id " + id);
    }

    return product;
  } catch (error) {
    throw new Error("Error finding product by id: " + error.message);
  }
};
const findProductsBySalt = async (salt) => {
  try {
    const products = await Product.findBySalt({ salt }).exec();
    

    if (!products || products.length === 0) {
      throw new Error("No products found with salt " + salt);
     
    }

    return products;
  } catch (error) {
    throw new Error("Error finding products by salt: " + error.message);
  }
};
// Get all products with filtering and pagination
async function getAllProducts(reqQuery) {
  let {
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    stock,
    pageNumber,
    pageSize,
  } = reqQuery;
  (pageSize = pageSize || 25), (pageNumber = pageNumber || 1);
  let query = Product.find();

  if (minPrice && maxPrice) {
    query = query.where("discountedPrice").gte(minPrice).lte(maxPrice);
  }

  if (minDiscount) {
    query = query.where("discountPersent").gt(minDiscount);
  }

  if (stock) {
    if (stock === "in_stock") {
      query = query.where("quantity").gt(0);
    } else if (stock === "out_of_stock") {
      query = query.where("quantity").lte(0);
    }
  }

  if (sort) {
    const sortDirection = sort === "price_high" ? -1 : 1;
    query = query.sort({ discountedPrice: sortDirection });
  }

  // Apply pagination
  const totalProducts = await Product.countDocuments(query);

  const skip = (pageNumber - 1) * pageSize;

  query = query.skip(skip).limit(pageSize);

  const products = await query.exec();

  const totalPages = Math.ceil(totalProducts / pageSize);

  return { content: products, currentPage: pageNumber, totalPages: totalPages };
}


async function createMultipleProduct(products) {
  for (let product of products) {
    await createProduct(product);
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  findProductsBySalt,
  createMultipleProduct,
};
