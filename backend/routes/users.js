import express from 'express'
const router = express.Router()
import { authenticate } from "../middleware/auth.js"


import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUser,
  deleteUser,
} from "../controllers/users.js"

// Public routes
router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)

// Protected routes
router.get("/me", authenticate, getCurrentUser)
router.put("/update", authenticate, updateUser)
router.delete("/", authenticate, deleteUser)

export default router
