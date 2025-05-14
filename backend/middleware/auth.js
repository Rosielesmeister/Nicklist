import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
import User from "../models/User.js"
import { generateToken } from "../server.js";
const JWT_SECRET = process.env.JWT_SECRET

console.log("JWT_SECRET:", JWT_SECRET)
console.log("JWT_SECRET in middleware:", JWT_SECRET)
// Middleware to authenticate user using JWT
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]// Extract token from Authorization header

    if (!token) {
      return res.status(401).json({ message: "Authentication required" })
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET)

    // Find user
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({ message: "User not found/(or authentication failed" })
    }

    req.user = { userId: user._id, isAdmin: user.isAdmin }
    next()
  } catch (error) {
    console.error("Authentication error:", error.message)
    res.status(401).json({ message: "Authentication failed" })
  }
}

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Access denied. Admin role required" })
  }
  next()
}

export { authenticate, isAdmin, generateToken }