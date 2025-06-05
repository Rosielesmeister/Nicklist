import products from "../models/products.js";
import User from "../models/User.js"; // Import User model
import dotenv from "dotenv";
dotenv.config();

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      region,
      state,
      city,
      images,
      contactEmail,
    } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !region ||
      !contactEmail
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Create a new product
    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User information is missing." });
    }

    const newProduct = await products.create({
      name,
      description,
      price,
      state,
      city,
      category,
      region,
      images,
      contactEmail,
      user: req.user.userId,
    });

    res
      .status(201)
      .json({ message: "Product created successfully.", product: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product.", error: error.message });
  }
};

// get all the products by user id
const getProductsByUserId = async (req, res) => {
  try {
    const userId = req.user.userId; // Get user ID from the authenticated user
    const userProducts = await products.find({ user: userId });

    if (!userProducts || userProducts.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this user." });
    }

    res.status(200).json(userProducts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products.", error: error.message });
  }
};

// get all the products - PUBLIC ROUTE (no authentication required)
const getProducts = async (req, res) => {
  try {
    const allProducts = await products
      .find()
      .populate("user", "_id firstName lastName email") // ENSURE THIS LINE EXISTS
      .sort({ createdAt: -1 });

    res.status(200).json(allProducts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products.", error: error.message });
  }
};

// get a single product by id - PROTECTED ROUTE
const getProductById = async (req, res) => {
  try {
    const product = await products
      .findById(req.params.id)
      .populate("user", "_id firstName lastName email"); // ENSURE THIS LINE EXISTS

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product.", error: error.message });
  }
};

// update a product by id
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, region, images, contactEmail } =
      req.body;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !region ||
      !contactEmail
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const updatedProduct = await products.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, region, images, contactEmail },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({
      message: "Product updated successfully.",
      product: updatedProduct,
    });
    res.status(200).json({
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product.", error: error.message });
  }
};

// delete a product by id
// Updated productControllers.js - deleteProduct function with better error handling

const deleteProduct = async (req, res) => {
  try {
    console.log("Delete request received for product ID:", req.params.id);
    console.log("User making request:", req.user);

    // Find product first
    const product = await products.findById(req.params.id);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: "Product not found." });
    }

    console.log("Product found:", product);
    console.log("Product owner:", product.user.toString());
    console.log("Current user:", req.user.userId);

    // Authorization check: only owner can delete
    if (product.user.toString() !== req.user.userId.toString()) {
      console.log("Authorization failed - user does not own this product");
      return res
        .status(403)
        .json({ message: "You can only delete your own listings." });
    }

    // Delete the product
    await products.findByIdAndDelete(req.params.id);
    console.log("Product deleted successfully");

    res.status(200).json({
      message: "Product deleted successfully.",
      deletedId: req.params.id,
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res
      .status(500)
      .json({ message: "Error deleting product.", error: error.message });
  }
};

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByUserId,
  //addBookmark,
  //removeBookmark,
  //getBookmarks, i comment these out b/c they are used above and it cause the code to break using them in both places. rosie
};
