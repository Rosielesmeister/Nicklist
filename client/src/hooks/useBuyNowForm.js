import { useState } from "react"
import { useAuth } from "./useAuth"
import { formatCardNumber, formatExpiryDate, formatCvv } from "../utils/inputFormatters"
import { validateForm as validateFormUtil } from "../utils/formValidation"

export const useBuyNowForm = () => {
	const { user } = useAuth()

	// Initial form data with better organization
	const getInitialFormData = () => ({
		// Contact Information
		fullName:
			user?.firstName && user?.lastName
				? `${user.firstName} ${user.lastName}`
				: user?.name || "",
		email: user?.email || "",
		phone: "",

		// Shipping Information
		address: "",
		city: "",
		state: "",
		zipCode: "",

		// Payment Information
		cardNumber: "",
		cardName: "",
		expiryDate: "",
		cvv: "",

		// Order notes
		orderNotes: "",
	})

	const [formData, setFormData] = useState(getInitialFormData())
	const [errors, setErrors] = useState({})

	// Handle regular form input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}))
		}
	}

	// Format card number with spaces (1234 5678 9012 3456)
	const handleCardNumberChange = (e) => {
		const formatted = formatCardNumber(e.target.value)
		
		// Only update if format is valid
		if (formatted !== e.target.value || formatted.length <= 19) {
			setFormData((prev) => ({
				...prev,
				cardNumber: formatted,
			}))

			// Clear card number error
			if (errors.cardNumber) {
				setErrors((prev) => ({
					...prev,
					cardNumber: "",
				}))
			}
		}
	}

	// Format expiry date (MM/YY)
	const handleExpiryChange = (e) => {
		const formatted = formatExpiryDate(e.target.value)

		setFormData((prev) => ({
			...prev,
			expiryDate: formatted,
		}))

		// Clear expiry error
		if (errors.expiryDate) {
			setErrors((prev) => ({
				...prev,
				expiryDate: "",
			}))
		}
	}

	// Handle CVV input (only numbers, max 4 digits)
	const handleCvvChange = (e) => {
		const formatted = formatCvv(e.target.value)
		
		setFormData((prev) => ({
			...prev,
			cvv: formatted,
		}))

		// Clear CVV error
		if (errors.cvv) {
			setErrors((prev) => ({
				...prev,
				cvv: "",
			}))
		}
	}

	// Validate form
	const validateForm = () => {
		const newErrors = validateFormUtil(formData)
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	// Reset form to initial state
	const resetForm = () => {
		setFormData(getInitialFormData())
		setErrors({})
	}

	// Set a general error (for API errors, etc.)
	const setGeneralError = (message) => {
		setErrors(prev => ({ ...prev, general: message }))
	}

	// Clear all errors
	const clearErrors = () => {
		setErrors({})
	}

	return {
		formData,
		errors,
		handleInputChange,
		handleCardNumberChange,
		handleExpiryChange,
		handleCvvChange,
		validateForm,
		resetForm,
		setGeneralError,
		clearErrors
	}
}