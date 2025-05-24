import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  content: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
});
export default mongoose.model("Message", messageSchema);
