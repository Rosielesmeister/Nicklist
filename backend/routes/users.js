import express from "express";
const router = express.Router();
import { authenticate } from "../middleware/auth.js";
import User from "../models/User.js";
import products from "../models/products.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUser,
  deleteUser,
} from "../controllers/users.js";

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected routes
router.get("/me", authenticate, getCurrentUser);
router.put("/update/:id", authenticate, updateUser);
router.delete("/user/:id", authenticate, deleteUser);

// FAVORITES ROUTES - ADD THESE NEW ROUTES

// GET user's favorite products
router.get("/user/favorites", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate({
      path: "favorites",
      model: "Product", // Make sure this matches your Product model name
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.favorites || []);
  } catch (error) {
    console.error("Get favorites error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST add product to user's favorites
router.post("/user/favorites/:productId", authenticate, async (req, res) => {
  
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    // Check if product exists
    const product = await products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find user and add to favorites if not already there
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already in favorites
    if (user.favorites && user.favorites.includes(productId)) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    // Add to favorites
    if (!user.favorites) user.favorites = [];
    user.favorites.push(productId);
    await user.save();

    res.status(200).json({ message: "Added to favorites successfully" });
  } catch (error) {
    console.error("Add to favorites error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE remove product from user's favorites
router.delete("/user/favorites/:productId", authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    // Find user and remove from favorites
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove from favorites
    if (user.favorites) {
      user.favorites = user.favorites.filter(
        (fav) => fav.toString() !== productId
      );
      await user.save();
    }

    res.status(200).json({ message: "Removed from favorites successfully" });
  } catch (error) {
    console.error("Remove from favorites error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
