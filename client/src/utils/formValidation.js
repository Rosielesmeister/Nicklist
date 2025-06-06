export const validateForm = (formData) => {
	const newErrors = {}

	// Required field validation
	const requiredFields = {
		fullName: "Full name is required",
		email: "Email is required",
		phone: "Phone number is required",
		address: "Address is required",
		city: "City is required",
		state: "State is required",
		zipCode: "ZIP code is required",
		cardName: "Cardholder name is required",
		expiryDate: "Expiry date is required",
		cvv: "CVV is required",
	}

	// Check all required fields
	Object.keys(requiredFields).forEach((field) => {
		if (!formData[field]?.trim()) {
			newErrors[field] = requiredFields[field]
		}
	})

	// Card number validation (special case because of spaces)
	const cardNumberDigits = formData.cardNumber.replace(/\s/g, "")
	if (!cardNumberDigits) {
		newErrors.cardNumber = "Card number is required"
	} else if (cardNumberDigits.length < 13) {
		newErrors.cardNumber = "Please enter a valid card number"
	}

	// Email format validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (formData.email && !emailRegex.test(formData.email)) {
		newErrors.email = "Please enter a valid email address"
	}

	// Phone validation (basic)
	const phoneRegex = /^[\d\s\-\(\)\+]+$/
	if (formData.phone && !phoneRegex.test(formData.phone)) {
		newErrors.phone = "Please enter a valid phone number"
	}

	// CVV validation
	if (formData.cvv && (formData.cvv.length < 3 || formData.cvv.length > 4)) {
		newErrors.cvv = "CVV must be 3 or 4 digits"
	}

	// ZIP code validation (basic US format)
	const zipRegex = /^\d{5}(-\d{4})?$/
	if (formData.zipCode && !zipRegex.test(formData.zipCode)) {
		newErrors.zipCode = "Please enter a valid ZIP code (12345 or 12345-6789)"
	}

	return newErrors
}