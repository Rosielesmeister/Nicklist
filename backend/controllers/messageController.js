import Message from "../models/message.js";
import User from "../models/User.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { recipient, product, content } = req.body;

    // Validation
    if (!recipient || !content) {
      return res.status(400).json({
        message: "Recipient and content are required",
      });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({
        message: "Message content cannot be empty",
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        message: "Message content too long (max 1000 characters)",
      });
    }

    // Check if recipient exists
    const recipientExists = await User.findById(recipient);
    if (!recipientExists) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Prevent self-messaging
    if (req.user.userId === recipient) {
      return res.status(400).json({
        message: "Cannot send message to yourself",
      });
    }

    const message = await Message.create({
      sender: req.user.userId,
      recipient,
      product: product || null,
      content: content.trim(),
    });

    // Populate the message with sender/recipient info
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "firstName lastName email")
      .populate("recipient", "firstName lastName email")
      .populate("product", "name");

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      message: "Error sending message.",
      error: error.message,
    });
  }
};

// Get all messages for a product
export const getMessagesForProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const messages = await Message.find({ product: productId })
      .populate("sender", "firstName lastName email")
      .populate("recipient", "firstName lastName email")
      .populate("product", "name")
      .sort({ sentAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get product messages error:", error);
    res.status(500).json({
      message: "Error fetching messages.",
      error: error.message,
    });
  }
};

// Get all messages for the logged-in user (as sender or recipient)
export const getMessagesForUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate("sender", "firstName lastName email")
      .populate("recipient", "firstName lastName email")
      .populate("product", "name")
      .sort({ sentAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get user messages error:", error);
    res.status(500).json({
      message: "Error fetching messages.",
      error: error.message,
    });
  }
};
