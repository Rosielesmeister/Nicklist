// hooks/useEditListingForm.js
import { useState, useEffect } from "react"
import { validateEditListingForm } from "../utils/editListingValidation"

export const useEditListingForm = (listing, show) => {
	// Get initial form data
	const getInitialFormData = () => ({
		name: "",
		description: "",
		price: "",
		category: "",
		state: "",
		city: "",
		region: "",
		images: [],
	})

	const [formData, setFormData] = useState(getInitialFormData())
	const [error, setError] = useState("")

	// Populate form when listing changes or modal opens
	useEffect(() => {
		if (listing && show) {
			const listingData = {
				name: listing.name || "",
				description: listing.description || "",
				price: listing.price?.toString() || "",
				category: listing.category || "",
				state: listing.state || "",
				city: listing.city || "",
				region: listing.region || "",
				images: listing.images || [],
			}

			setFormData(listingData)
			setError("") // Clear any previous errors
		}
	}, [listing, show])

	// Handle regular form input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))

		// Clear error when user starts typing
		if (error) {
			setError("")
		}
	}

	// Validate form
	const validateForm = (uploadedImages) => {
		const validationError = validateEditListingForm(formData, uploadedImages)
		if (validationError) {
			setError(validationError)
			return false
		}
		return true
	}

	// Reset form to initial state
	const resetForm = () => {
		setFormData(getInitialFormData())
		setError("")
	}

	// Set error message
	const setErrorMessage = (message) => {
		setError(message)
	}

	// Clear error
	const clearError = () => {
		setError("")
	}

	return {
		formData,
		setFormData,
		error,
		handleInputChange,
		validateForm,
		resetForm,
		setErrorMessage,
		clearError
	}
}