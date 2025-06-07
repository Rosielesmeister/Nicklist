import { validateEditListingForm, getCharacterCounts, hasValidationErrors } from "./editListingValidation"

// Reuse the same validation logic from edit listing
export const validateNewListingForm = validateEditListingForm
export { getCharacterCounts, hasValidationErrors }

// Additional utility for new listings
export const validateImageUrl = (url) => {
	// Check if it's a valid Cloudinary URL
	if (
		url &&
		(url.includes("cloudinary.com") || url.includes("res.cloudinary.com"))
	) {
		return url
	}
	// If it's not a full URL, construct it
	if (url && !url.startsWith("http")) {
		return `https://res.cloudinary.com/doaoflgje/image/upload/${url}`
	}
	return url
}