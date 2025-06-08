// utils/adminDashboardHelpers.js
import { MESSAGES_ADMIN } from "../components/common/Constant"

// Format date for display
export const formatDate = (dateString) => {
	if (!dateString) return "N/A"
	
	try {
		return new Date(dateString).toLocaleDateString()
	} catch (error) {
		console.error("Error formatting date:", error)
		return "Invalid date"
	}
}

// Format price for display
export const formatPrice = (price) => {
	if (!price && price !== 0) return "N/A"
	return `$${price}`
}

// Get user initials for avatar
export const getUserInitials = (user) => {
	const firstInitial = user.firstName?.charAt(0) || ""
	const lastInitial = user.lastName?.charAt(0) || ""
	return (firstInitial + lastInitial).toUpperCase()
}

// Get full user name
export const getUserFullName = (user) => {
	if (!user) return "Unknown User"
	return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User"
}

// Confirm user deletion
export const confirmUserDeletion = () => {
	return window.confirm(MESSAGES_ADMIN.DELETE_USER_CONFIRM)
}

// Confirm product deletion
export const confirmProductDeletion = () => {
	return window.confirm(MESSAGES_ADMIN.DELETE_PRODUCT_CONFIRM)
}

// Get user role badge info
export const getUserRoleBadge = (isAdmin) => ({
	className: isAdmin ? "bg-warning" : "bg-secondary",
	text: isAdmin ? "Admin" : "User",
})

// Get product status badge info
export const getProductStatusBadge = (isActive) => ({
	className: isActive ? "bg-success" : "bg-danger",
	text: isActive ? "Active" : "Inactive",
})

// Get toggle button info for users
export const getUserToggleButton = (isAdmin) => ({
	title: isAdmin ? "Remove Admin" : "Make Admin",
	icon: "bi bi-shield",
})

// Get toggle button info for products
export const getProductToggleButton = (isActive) => ({
	title: isActive ? "Deactivate" : "Activate",
	icon: isActive ? "bi bi-toggle-on" : "bi bi-toggle-off",
})

// Handle API errors with user-friendly MESSAGES_ADMIN
export const formatApiError = (error, operation) => {
	return `Failed to ${operation}: ${error.message}`
}

// Safely get nested object properties
export const safeGet = (obj, path, defaultValue = null) => {
	try {
		return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue
	} catch {
		return defaultValue
	}
}