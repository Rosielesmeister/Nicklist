// routes/admin.js
import express from "express";
const router = express.Router();
import { authenticate, isAdmin } from "../middleware/auth.js";
import User from "../models/User.js";
import Product from "../models/products.js";

// GET all users (Admin only)
router.get("/users", authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password") // Exclude password field
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET user statistics (Admin only)
router.get("/stats", authenticate, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ isAdmin: true });

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Recent products (last 30 days)
    const recentProducts = await Product.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.status(200).json({
      totalUsers,
      totalProducts,
      activeProducts,
      adminUsers,
      recentUsers,
      recentProducts,
    });
  } catch (error) {
    console.error("Get admin stats error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all products with user info (Admin only)
router.get("/products", authenticate, isAdmin, async (req, res) => {
  try {
    const products = await Product.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("Get all products error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE user by ID (Admin only)
router.delete("/users/:userId", authenticate, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (userId === req.user.userId) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all products by this user
    await Product.deleteMany({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User and all their products deleted successfully",
      deletedUserId: userId,
    });
  } catch (error) {
    console.error("Delete user error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH toggle user admin status (Admin only)
router.patch(
  "/users/:userId/toggle-admin",
  authenticate,
  isAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;

      // Prevent admin from removing their own admin status
      if (userId === req.user.userId) {
        return res
          .status(400)
          .json({ message: "You cannot modify your own admin status" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Toggle admin status
      user.isAdmin = !user.isAdmin;
      await user.save();

      res.status(200).json({
        message: `User ${user.isAdmin ? "promoted to" : "removed from"} admin`,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      console.error("Toggle admin status error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE product by ID (Admin only)
router.delete(
  "/products/:productId",
  authenticate,
  isAdmin,
  async (req, res) => {
    try {
      const { productId } = req.params;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      await Product.findByIdAndDelete(productId);

      res.status(200).json({
        message: "Product deleted successfully",
        deletedProductId: productId,
      });
    } catch (error) {
      console.error("Delete product error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PATCH toggle product active status (Admin only)
router.patch(
  "/products/:productId/toggle-active",
  authenticate,
  isAdmin,
  async (req, res) => {
    try {
      const { productId } = req.params;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Toggle active status
      product.isActive = !product.isActive;
      await product.save();

      res.status(200).json({
        message: `Product ${product.isActive ? "activated" : "deactivated"}`,
        product,
      });
    } catch (error) {
      console.error("Toggle product status error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET recent activity (Admin only)
router.get("/activity", authenticate, isAdmin, async (req, res) => {
  try {
    // Get recent users (last 10)
    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(10);

    // Get recent products (last 10)
    const recentProducts = await Product.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      recentUsers,
      recentProducts,
    });
  } catch (error) {
    console.error("Get recent activity error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
