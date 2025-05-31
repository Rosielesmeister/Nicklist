import express from "express";
const router = express.Router();
import { authenticate } from "../middleware/auth.js";
import Message from "../models/message.js"; // Add this import
import {
  sendMessage,
  getMessagesForUser,
  getMessagesForProduct,
} from "../controllers/messageController.js";

// POST /api/messages - Send a new message
router.post("/", authenticate, sendMessage);

// GET /api/messages/user - Get all messages for the current user
router.get("/user", authenticate, getMessagesForUser);

// GET /api/messages/product/:productId - Get messages for a specific product
router.get("/product/:productId", authenticate, getMessagesForProduct);

// PATCH /api/messages/:messageId/read - Mark message as read
router.patch("/:messageId/read", authenticate, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Message.findById(messageId);
    // console.log(userId, message.recipient);
    
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only recipient can mark message as read
    // if (message.recipient !== userId) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    message.read = true;
    message.readAt = new Date();
    await message.save();

    res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    res.status(500).json({
      message: "Error marking message as read",
      error: error.message,
    });
  }
});

export default router;
