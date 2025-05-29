// routes/favorites.js
import express from "express";
const router = express.Router();
import { authenticate } from "../middleware/auth.js";
import User from "../models/User.js";
import Product from "../models/products.js";

// GET user's favorite products
router.get("/user/favorites", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate({
      path: "favorites",
      populate: {
        path: "user",
        select: "firstName lastName email",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.favorites || []);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res
      .status(500)
      .json({ message: "Error fetching favorites", error: error.message });
  }
});

// POST add product to favorites
router.post("/user/favorites/:productId", authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user exists and get current favorites
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize favorites array if it doesn't exist
    if (!user.favorites) {
      user.favorites = [];
    }

    // Check if already favorited
    if (user.favorites.includes(productId)) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    // Add to favorites
    user.favorites.push(productId);
    await user.save();

    res.status(200).json({ message: "Product added to favorites", productId });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res
      .status(500)
      .json({ message: "Error adding to favorites", error: error.message });
  }
});

// DELETE remove product from favorites
router.delete("/user/favorites/:productId", authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize favorites array if it doesn't exist
    if (!user.favorites) {
      user.favorites = [];
    }

    // Remove from favorites
    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== productId
    );
    await user.save();

    res
      .status(200)
      .json({ message: "Product removed from favorites", productId });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res
      .status(500)
      .json({ message: "Error removing from favorites", error: error.message });
  }
});

export default router;
