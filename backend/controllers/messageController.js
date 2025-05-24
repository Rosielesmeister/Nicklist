import Message from "../models/message.js";

// Send a message (already exists)
export const sendMessage = async (req, res) => {
  try {
    const { recipient, product, content } = req.body;
    const message = await Message.create({
      sender: req.user.userId,
      recipient,
      product,
      content,
    });
    res.status(201).json(message);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending message.", error: error.message });
  }
};

// Get all messages for a product
export const getMessagesForProduct = async (req, res) => {
  try {
    const messages = await Message.find({ product: req.params.productId })
      .populate("sender", "firstName lastName email")
      .populate("recipient", "firstName lastName email")
      .sort({ sentAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching messages.", error: error.message });
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
    res
      .status(500)
      .json({ message: "Error fetching messages.", error: error.message });
  }
};
