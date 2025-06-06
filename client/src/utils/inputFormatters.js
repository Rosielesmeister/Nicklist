// Format card number with spaces (1234 5678 9012 3456)
export const formatCardNumber = (value) => {
	let formatted = value.replace(/\D/g, "") // Remove non-digits
	formatted = formatted.replace(/(\d{4})(?=\d)/g, "$1 ") // Add spaces every 4 digits
	
	// Max length with spaces is 19 characters
	if (formatted.length <= 19) {
		return formatted
	}
	return value // Return original if too long
}

// Format expiry date (MM/YY)
export const formatExpiryDate = (value) => {
	let formatted = value.replace(/\D/g, "")
	if (formatted.length >= 2) {
		formatted = formatted.substring(0, 2) + "/" + formatted.substring(2, 4)
	}
	return formatted
}

// Handle CVV input (only numbers, max 4 digits)
export const formatCvv = (value) => {
	return value.replace(/\D/g, "").substring(0, 4)
}