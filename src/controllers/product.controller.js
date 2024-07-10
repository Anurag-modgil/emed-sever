// productController.js
const productService = require("../services/product.service.js")
const Product = require("../models/product.model.js") // Import the Product model

// Create a new product
async function createProduct(req, res) {
  try {
    console.log(req.files,"dd")
    console.log(req.body,"body")
    return 
    const product = await productService.createProduct(req.body);
    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Delete a product by ID
async function deleteProduct(req, res) {
  try {
    const productId = req.params.id;
    const message = await productService.deleteProduct(productId);
    return res.json({ message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update a product by ID
async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    const product = await productService.updateProduct(productId, req.body);
    return res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all products
// async function getAllProducts(req, res) {
//   try {
//     const products = await productService.getAllProducts();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// Find a product by ID
async function findProductById(req, res) {
  try {
    const productId = req.params.id;
    const product = await productService.findProductById(productId);
    return res.status(200).send(product);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
}

// Find products by category
async function findProductByCategory(req, res) {
  try {
    const category = req.params.category;
    const products = await productService.findProductByCategory(category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function searchProduct(req, res) {
  try {
    const query = req.params.query;

    // Use a regular expression to perform a case-insensitive search
    const regex = new RegExp(query, 'i');

    // Find products that match the query in the name, description, or category fields
    const products = await Product.find({
      $or: [
        { brand: { $regex: regex } },
        { description: { $regex: regex } },
        { title: { $regex: regex } }
      ]
    });

    // Sort the products based on the relevance score
    const sortedProducts = products.sort((a, b) => {
      const aScore = getRelevanceScore(a, query);
      const bScore = getRelevanceScore(b, query);
      return bScore - aScore;
    });

    return res.json(sortedProducts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Helper function to calculate the relevance score of a product
function getRelevanceScore(product, query) {
  const regex = new RegExp(query, 'i');
  let score = 0;

  // Check if the query matches the product name
  if (product.title.match(regex)) {
    score += 3; // Higher weight for name match
  }

  // Check if the query matches the product description
  if (product.description.match(regex)) {
    score += 2; // Medium weight for description match
  }

  // Check if the query matches the product category
  if (product.brand.match(regex)) {
    score += 1; // Lower weight for category match
  }

  return score;
}


// Get all products with filtering and pagination
async function getAllProducts(req, res) {
  try {

    const products = await productService.getAllProducts(req.query);

    return res.status(200).send(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

const createMultipleProduct= async (req, res) => {
  try {
    await productService.createMultipleProduct(req.body)
    res
      .status(202)
      .json({ message: "Products Created Successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  findProductByCategory,
  searchProduct,
  createMultipleProduct

};
