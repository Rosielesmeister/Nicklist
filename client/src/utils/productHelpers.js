import { UI_CONFIG } from "../components/common/Constant"

// Check user relationship to product
export const getUserRelationship = (product, user) => {
	if (!user) return { isLoggedIn: false, isOwner: false }

	const isOwner = product.user === user._id || product.user?._id === user._id
	return { isLoggedIn: true, isOwner }
}

// Get truncated description
export const getTruncatedDescription = (description) => {
	if (!description) return ""

	return description.length > UI_CONFIG.DESCRIPTION_MAX_LENGTH
		? `${description.substring(0, UI_CONFIG.DESCRIPTION_MAX_LENGTH)}...`
		: description
}

// Check if product is available for purchase
export const isProductAvailableForPurchase = (product, isOwner) => {
	return product.isActive && !isOwner
}

// Get recipient ID from product data
export const getRecipientId = (product) => {
	if (typeof product.user === "object" && product.user._id) {
		return product.user._id
	} else if (typeof product.user === "string") {
		return product.user
	} else if (product.userId) {
		return product.userId
	} else {
		throw new Error("Cannot determine product owner")
	}
}

// Validate user action permissions
export const validateUserAction = (action, isLoggedIn, isOwner, product) => {
	switch (action) {
		case 'message':
			if (!isLoggedIn) return { allowed: false, message: "Please log in to message sellers" }
			if (isOwner) return { allowed: false, message: "You cannot message yourself" }
			return { allowed: true }
			
		case 'buy':
			if (!isLoggedIn) return { allowed: false, message: "Please log in to purchase items" }
			if (isOwner) return { allowed: false, message: "You cannot purchase your own product" }
			if (!product.isActive) return { allowed: false, message: "This item is no longer available" }
			return { allowed: true }
			
		default:
			return { allowed: true }
	}
}