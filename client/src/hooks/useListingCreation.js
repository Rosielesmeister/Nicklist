import { useState } from "react"
import { useAuth } from "./useAuth"
import { productsAPI } from "../api/api"

export const useListingCreation = () => {
	const { user } = useAuth()
	const [isLoading, setIsLoading] = useState(false)

	const createListing = async (formData, uploadedImages) => {
		// Check authentication
		if (
			!user?.token &&
			!localStorage.getItem("token") &&
			!localStorage.getItem("authToken")
		) {
			throw new Error("You must be logged in to create a listing")
		}

		setIsLoading(true)

		try {
			// Prepare listing data
			const listingData = {
				name: formData.name.trim(),
				description: formData.description.trim(),
				price: parseFloat(formData.price),
				category: formData.category,
				state: formData.state,
				city: formData.city.trim(),
				region: formData.region,
				images: uploadedImages,
				contactEmail: user?.email,
				user: user?._id,
				isActive: true,
			}

			console.log("Creating listing with data:", listingData)

			// Use centralized API instead of duplicate fetch code
			const newListing = await productsAPI.createProduct(listingData)

			console.log("✅ Listing created successfully:", newListing)

			return newListing
		} catch (err) {
			console.error("❌ Error creating listing:", err)

			// Handle different types of errors
			if (err.message.includes("401")) {
				throw new Error("Your session has expired. Please log in again.")
			} else if (err.message.includes("403")) {
				throw new Error("You do not have permission to create listings.")
			} else if (err.message.includes("400")) {
				throw new Error("Please check all required fields and try again.")
			} else {
				throw new Error(err.message || "Failed to create listing. Please try again.")
			}
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		createListing
	}
}