import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '24h' // Token expiration time

// JWT token with error handling
const generateToken = (userId) => {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables')
    throw new Error('JWT configuration error')
  }
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
};

// Register a new user
 const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user with hashed password
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    if (user) {
      try {
        // Generate JWT token
        const token = generateToken(user._id)

        res.status(201).json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
          token, 
        });
      } catch (tokenError) {
        console.error("Token generation error:", tokenError.message)
        res.status(500).json({
          message: "User created but authentication system is misconfigured. Please contact administrator.",
        });
      }
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error) {
    console.error("Registration error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}
// Login user
 const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      try {
        // Generate JWT token
        const token = generateToken(user._id)

        res.json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
          token,
        });
      } catch (tokenError) {
        console.error('Token generation error:', tokenError.message)
        res.status(500).json({ message: "Authentication system is misconfigured. Please contact administrator." })
      }
    } else {
      res.status(401).json({ message: "Invalid email or password" })
    }
  } catch (error) {
    console.error("Login error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

 const logoutUser = async (req, res) => {
  res.json({ message: "Logged out successfully" })
}

// Get current user
 const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Get current user error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
};

// Update user
 const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body
    const userId = req.user.userId

    // Find user by id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update user fields
    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.email = email || user.email

    if (password) {
      user.password = await bcrypt.hash(password, 10)
    }

    // Save updated user
    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    console.error("Update user error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
};

// Delete user
 const deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId

    const user = await User.findByIdAndDelete(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

 export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUser,
  deleteUser,
}