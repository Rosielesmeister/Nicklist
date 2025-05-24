import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  sendMessage,
  getMessagesForProduct,
  getMessagesForUser,
} from "../controllers/messageController.js";

const router = express.Router();

// Send a message about a product (protected)
router.post("/", authenticate, sendMessage);

// Get all messages for a product (protected)
router.get("/product/:productId", authenticate, getMessagesForProduct);

// Get all messages for the logged-in user (protected)
router.get("/user", authenticate, getMessagesForUser);

export default router;
