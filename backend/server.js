import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.js";
import jwt from "jsonwebtoken";
import productRoutes from "./routes/products.js";
import messageRoutes from "./routes/messageRoutes.js";

if (!process.env.JWT_SECRET) {
  console.error("Error: JWT_SECRET is not defined in environment variables.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET;
// console.log('JWT_SECRET:', process.env.JWT_SECRET)
const JWT_EXPIRES_IN = "24h";

const generateToken = (userId) => {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables");
    throw new Error("JWT configuration error");
  }
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api/messages", messageRoutes); // Registers /api/messages endpoints

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export { generateToken };
