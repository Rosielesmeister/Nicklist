import { useState } from "react"
import { useAuth } from "./useAuth"
import { productsAPI } from "../api/api"

export const useListingUpdate = () => {
	const { user } = useAuth()
	const [isLoading, setIsLoading] = useState(false)

	const updateListing = async (listing, formData, uploadedImages) => {
		// Check authentication
		if (!user?.token && !localStorage.getItem("token")) {
			throw new Error("You must be logged in to edit a listing")
		}

		// Check if listing exists
		if (!listing?._id) {
			throw new Error("Listing information is missing")
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
			}

			console.log("Updating listing with data:", listingData)

			// Use centralized API instead of duplicate fetch code
			const updatedListing = await productsAPI.updateProduct(
				listing._id,
				listingData,
			)

			console.log("✅ Listing updated successfully:", updatedListing)

			return updatedListing.product || updatedListing
		} catch (err) {
			console.error("❌ Error updating listing:", err)

			// Handle different types of errors
			if (err.message.includes("401")) {
				throw new Error("Your session has expired. Please log in again.")
			} else if (err.message.includes("403")) {
				throw new Error("You do not have permission to edit this listing.")
			} else if (err.message.includes("400")) {
				throw new Error("Please check all required fields and try again.")
			} else {
				throw new Error(err.message || "Failed to update listing. Please try again.")
			}
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		updateListing
	}
}