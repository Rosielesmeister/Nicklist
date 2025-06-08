import { useState, useEffect } from "react"
import { productsAPI } from "../api/api"
import { MESSAGES } from "../components/common/Constant"

export const useProducts = () => {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	// Fetch all products from API
	const fetchProducts = async () => {
		try {
			setLoading(true)
			setError("")

			const response = await productsAPI.getAllProducts()
			setProducts(Array.isArray(response) ? response : [])
		} catch (err) {
			console.error("Error fetching products:", err)
			setError(MESSAGES.error)
			setProducts([])
		} finally {
			setLoading(false)
		}
	}

	// Add a new product to the state (when user creates a listing)
	const addProduct = (newProduct) => {
		const productToAdd = newProduct.product || newProduct
		setProducts((prev) => [productToAdd, ...prev])
	}

	// Clear any error messages
	const clearError = () => setError("")

	// Fetch products when hook is first used
	useEffect(() => {
		fetchProducts()
	}, [])

	// Return everything the component needs
	return {
		products, // Array of all products
		loading, // Boolean - is data loading?
		error, // String - error message if any
		fetchProducts, // Function - refetch data
		addProduct, // Function - add new product
		clearError, // Function - clear errors
	}
}
