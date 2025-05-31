import Message from "../models/message.js";
import User from "../models/User.js";
import products from "../models/products.js";

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { recipient, product, content } = req.body;
    const senderId = req.user.userId;

    // Validate required fields
    if (!recipient || !content) {
      return res.status(400).json({
        message: "Recipient and content are required",
      });
    }

    // Check if recipient exists
    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return res.status(404).json({
        message: "Recipient not found",
      });
    }

    // If product is specified, check if it exists
    let productDoc = null;
    if (product) {
      productDoc = await products.findById(product);
      if (!productDoc) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
    }

    // Create the message
    const newMessage = new Message({
      sender: senderId,
      recipient,
      product: product || null,
      content: content.trim(),
    });

    await newMessage.save();

    // Populate the message with sender, recipient, and product details
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "firstName lastName email")
      .populate("recipient", "firstName lastName email")
      .populate("product", "name price images");

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      message: "Error sending message",
      error: error.message,
    });
  }
};

// Get all messages for the current user (both sent and received)
export const getMessagesForUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate("sender", "firstName lastName email")
      .populate("recipient", "firstName lastName email")
      .populate("product", "name price images")
      .sort({ sentAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      message: "Error fetching messages",
      error: error.message,
    });
  }
};

// Get messages for a specific product
export const getMessagesForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    // Check if product exists
    const product = await products.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Get messages for this product where user is involved
    const messages = await Message.find({
      product: productId,
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate("sender", "firstName lastName email")
      .populate("recipient", "firstName lastName email")
      .populate("product", "name price images")
      .sort({ sentAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get product messages error:", error);
    res.status(500).json({
      message: "Error fetching product messages",
      error: error.message,
    });
  }
};

// Mark a message as read
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    // Only the recipient can mark a message as read
    if (message.recipient.toString() !== userId) {
      return res.status(403).json({
        message: "You can only mark your own messages as read",
      });
    }

    message.read = true;
    await message.save();

    res.status(200).json({
      message: "Message marked as read",
      messageId: message._id,
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({
      message: "Error marking message as read",
      error: error.message,
    });
  }
};

// Get conversation between two users for a specific product
export const getConversation = async (req, res) => {
  try {
    const { otherUserId, productId } = req.params;
    const userId = req.user.userId;

    const messages = await Message.find({
      $and: [
        { product: productId },
        {
          $or: [
            { sender: userId, recipient: otherUserId },
            { sender: otherUserId, recipient: userId },
          ],
        },
      ],
    })
      .populate("sender", "firstName lastName email")
      .populate("recipient", "firstName lastName email")
      .populate("product", "name price images")
      .sort({ sentAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({
      message: "Error fetching conversation",
      error: error.message,
    });
  }
};
