import express from 'express'
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


router.post('/products', authenticate, createProduct);
router.get('/products', authenticate, getProducts);
router.get('/products/:id', authenticate, getProductById);
router.put('/products/:id',authenticate, updateProduct);
router.get('/user/products', authenticate, getProductsByUserId)
router.delete("/products/:id", authenticate, deleteProduct) 

export default router
