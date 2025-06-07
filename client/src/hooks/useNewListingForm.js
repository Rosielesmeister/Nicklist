// hooks/useNewListingForm.js
import { useState } from "react"
import { validateNewListingForm } from "../utils/newListingValidation"

export const useNewListingForm = () => {
	// Get initial form data (always empty for new listings)
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
		const validationError = validateNewListingForm(formData, uploadedImages)
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