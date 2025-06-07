// utils/productDetailsHelpers.js
import { CONTACT_TEMPLATE } from "../components/common/Constant"

// Format date in readable format
export const formatDate = (dateString) => {
	if (!dateString) return "Date not available"

	try {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		})
	} catch (error) {
		console.error("Error formatting date:", error)
		return "Invalid date"
	}
}

// Format price with proper fallback
export const formatPrice = (price) => {
	if (!price && price !== 0) return "Price not available"
	return price.toLocaleString()
}

// Check user relationship to product
export const getUserRelationship = (product, user) => {
	if (!user) return { isLoggedIn: false, isOwner: false }

	const isOwner = product?.user === user._id || product?.user?._id === user._id
	return { isLoggedIn: true, isOwner }
}

// Check if product is available for purchase
export const isProductAvailableForPurchase = (product, isOwner) => {
	return product?.isActive && !isOwner
}

// Handle contact seller via email
export const createContactEmailLink = (product) => {
	if (!product?.contactEmail) {
		throw new Error("Seller contact information is not available")
	}

	try {
		const subject = encodeURIComponent(CONTACT_TEMPLATE.subject(product.name))
		const body = encodeURIComponent(
			CONTACT_TEMPLATE.body(product.name, product.price),
		)

		return `mailto:${product.contactEmail}?subject=${subject}&body=${body}`
	} catch (error) {
		console.error("Error creating mailto link:", error)
		throw new Error(
			"Unable to open email client. Please contact the seller directly at: " +
				product.contactEmail,
		)
	}
}

// Validate user purchase action
export const validatePurchaseAction = (isLoggedIn, isOwner, product) => {
	if (!isLoggedIn) {
		return { allowed: false, message: "Please log in to purchase items" }
	}

	if (isOwner) {
		return { allowed: false, message: "You cannot purchase your own product" }
	}

	if (!product?.isActive) {
		return { allowed: false, message: "This item is no longer available" }
	}

	return { allowed: true }
}