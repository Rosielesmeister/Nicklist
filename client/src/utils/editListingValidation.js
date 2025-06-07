import { VALIDATION_RULES } from "../components/common/Constant"

export const validateEditListingForm = (formData, uploadedImages) => {
	const errors = []

	// Required field validation
	const requiredFields = {
		name: "Product name",
		description: "Description",
		price: "Price",
		category: "Category",
		state: "State",
		city: "City",
		region: "Region",
	}

	Object.keys(requiredFields).forEach((field) => {
		if (!formData[field]?.trim()) {
			errors.push(requiredFields[field])
		}
	})

	if (errors.length > 0) {
		return `Please fill in the following required fields: ${errors.join(", ")}`
	}

	// Price validation
	const price = parseFloat(formData.price)
	if (isNaN(price) || price < VALIDATION_RULES.MIN_PRICE) {
		return `Price must be at least $${VALIDATION_RULES.MIN_PRICE}`
	}

	// Length validation
	if (formData.name.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
		return `Product name must be ${VALIDATION_RULES.NAME_MAX_LENGTH} characters or less`
	}

	if (formData.description.length > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH) {
		return `Description must be ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters or less`
	}

	// Image validation
	if (uploadedImages.length > VALIDATION_RULES.MAX_IMAGES) {
		return `Maximum ${VALIDATION_RULES.MAX_IMAGES} images allowed`
	}

	return null // No errors
}

export const getCharacterCounts = (formData) => ({
	name: formData.name.length,
	description: formData.description.length,
})

export const hasValidationErrors = (formData) => {
	const counts = getCharacterCounts(formData)
	return (
		counts.name > VALIDATION_RULES.NAME_MAX_LENGTH ||
		counts.description > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH
	)
}