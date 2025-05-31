import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false, // Allow general messages not tied to products
  },
  content: {
    type: String,
    required: true,
    maxLength: 1000,
  },
  read: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better performance
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ product: 1 });
messageSchema.index({ sentAt: -1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;