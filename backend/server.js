import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/products.js";
import messageRoutes from "./routes/messageRoutes.js";
import adminRoutes from "./routes/admin.js"; // Add this import
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

const generateToken = (userId) => {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables");
    throw new Error("JWT configuration error");
  }
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Nicklist API is running!" });
});

// API Routes
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes); // Add this line
app.use("/api/:messageId/read", messageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

export { generateToken };
export default app;
