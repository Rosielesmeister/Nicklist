import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  sendMessage,
  getMessagesForUser,
  getMessagesForProduct,
  markAsRead,
  getConversation,
} from "../controllers/messageController.js";

const router = express.Router();

// All message routes require authentication
router.use(authenticate);

// POST /messages - Send a new message
router.post("/", sendMessage);

// GET /messages/user - Get all messages for the current user
router.get("/user", getMessagesForUser);

// GET /messages/product/:productId - Get messages for a specific product
router.get("/product/:productId", getMessagesForProduct);

// PATCH /messages/:messageId/read - Mark a message as read
router.patch("/:messageId/read", markAsRead);

// GET /messages/conversation/:otherUserId/:productId - Get conversation between users for a product
router.get("/conversation/:otherUserId/:productId", getConversation);

export default router;
