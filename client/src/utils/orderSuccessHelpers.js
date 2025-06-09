import { DATE_FORMAT_OPTIONS, STORAGE_KEYS } from "../components/common/Constant"

// Format date with specific options
export const formatDate = (dateString, formatType = 'ORDER_DATE') => {
	if (!dateString) return "Date not available"

	try {
		const options = DATE_FORMAT_OPTIONS[formatType] || DATE_FORMAT_OPTIONS.ORDER_DATE
		return new Date(dateString).toLocaleDateString("en-US", options)
	} catch (error) {
		console.error("Error formatting date:", error)
		return "Invalid date"
	}
}

// Format price with proper fallback
export const formatPrice = (price) => {
	if (!price && price !== 0) return "0.00"
	return price.toFixed(2)
}

// Get order total from various possible locations in the order data
export const getOrderTotal = (orderData) => {
	return orderData.pricing?.total || orderData.total || 0
}

// Get product price from order data
export const getProductPrice = (orderData) => {
	return orderData.price || orderData.product?.price || 0
}

// Get order number/ID from order data
export const getOrderNumber = (orderData) => {
	return orderData.orderNumber || orderData._id || "N/A"
}

// Get order status with fallback
export const getOrderStatus = (orderData) => {
	return orderData.status || "Confirmed"
}

// Try to retrieve order data from multiple sources
export const retrieveOrderData = (locationState) => {
	let order = null

	// 1. From navigation state (if passed from modal)
	if (locationState?.order) {
		order = locationState.order
	}
	// 2. From localStorage (backup)
	else {
		const lastOrder = localStorage.getItem(STORAGE_KEYS.LAST_ORDER)
		if (lastOrder) {
			try {
				order = JSON.parse(lastOrder)
			} catch (e) {
				console.error("Error parsing order data:", e)
			}
		}
	}

	return order
}

// Clear stored order data
export const clearStoredOrderData = () => {
	localStorage.removeItem(STORAGE_KEYS.LAST_ORDER)
}