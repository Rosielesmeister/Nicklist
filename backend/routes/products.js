<<<<<<< HEAD
import express from "express";
const router = express.Router();
import { authenticate } from "../middleware/auth.js";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByUserId,
  addBookmark,
  removeBookmark,
  getBookmarks,
} from "../controllers/productControllers.js";

router.post("/products", authenticate, createProduct);
router.get("/products", getProducts);
router.get("/products/:id", authenticate, getProductById);
router.put("/products/:id", authenticate, updateProduct);
router.get("/user/products", authenticate, getProductsByUserId);
router.delete("/products/:id", authenticate, deleteProduct);
router.post("/products/:id/bookmark", authenticate, addBookmark);
router.delete("/products/:id/bookmark", authenticate, removeBookmark);
router.get("/user/bookmarks", authenticate, getBookmarks);

export default router;
=======
import express from "express"
const router = express.Router()
import { authenticate } from "../middleware/auth.js"

import {
	createProduct,
	getProducts,
	getProductById,
	updateProduct,
	deleteProduct,
	getProductsByUserId,
} from "../controllers/products.js"

router.post("/products", authenticate, createProduct)
router.get("/products", getProducts)
router.get("/products/:id", authenticate, getProductById)
router.put("/products/:id", authenticate, updateProduct)
router.get("/user/products", authenticate, getProductsByUserId)
router.delete("/products/:id", authenticate, deleteProduct)

export default router
>>>>>>> main
