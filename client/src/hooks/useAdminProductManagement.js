// hooks/useAdminProductManagement.js
import { useState } from "react"
import { adminAPI } from "../api/api"
import { confirmProductDeletion, formatApiError } from "../utils/adminDashboardHelpers"

export const useAdminProductManagement = (products, setProducts, fetchStats, setError) => {
	const [loading, setLoading] = useState(false)

	// Delete a product
	const handleDeleteProduct = async (productId) => {
		// Ask for confirmation before deleting
		if (!confirmProductDeletion()) {
			return // User clicked "Cancel", so don't delete
		}

		try {
			setLoading(true)
			await adminAPI.deleteProduct(productId)
			
			// Update the products list by removing the deleted product
			setProducts(products.filter((product) => product._id !== productId))
			
			// Refresh stats since product count changed
			await fetchStats()
			
			setError("") // Clear any previous errors
		} catch (err) {
			setError(formatApiError(err, "delete product"))
		} finally {
			setLoading(false)
		}
	}

	// Toggle product's active status (activate or deactivate)
	const handleToggleProductActive = async (productId) => {
		try {
			setLoading(true)
			const data = await adminAPI.toggleProductActive(productId)
			
			// Update the specific product in our products list
			setProducts(products.map((product) =>
				product._id === productId
					? { ...product, isActive: data.product.isActive }
					: product
			))
			
			setError("") // Clear any previous errors
		} catch (err) {
			setError(formatApiError(err, "toggle product status"))
		} finally {
			setLoading(false)
		}
	}

	return {
		loading,
		handleDeleteProduct,
		handleToggleProductActive,
	}
}