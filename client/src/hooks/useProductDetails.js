// hooks/useProductDetails.js
import { useAuth } from "./useAuth"
import { useProductDetailsImages } from "./useProductDetailsImages"
import { useProductDetailsPurchase } from "./useProductDetailsPurchase"
import { 
	getUserRelationship, 
	isProductAvailableForPurchase,
	createContactEmailLink 
} from "../utils/productDetailsHelpers"

export const useProductDetails = (product) => {
	const { user } = useAuth()

	// Sub-hooks for specific functionality
	const imageHook = useProductDetailsImages()
	const purchaseHook = useProductDetailsPurchase()

	// Get user relationship to product
	const { isLoggedIn, isOwner } = getUserRelationship(product, user)
	const isAvailableForPurchase = isProductAvailableForPurchase(product, isOwner)

	// Handle contact seller via email
	const handleContactSeller = () => {
		try {
			const emailLink = createContactEmailLink(product)
			window.location.href = emailLink
		} catch (error) {
			alert(error.message)
		}
	}

	// Handle buy now button (wrapper)
	const handleBuyNow = (e) => {
		e?.stopPropagation()
		purchaseHook.handleBuyNow(isLoggedIn, isOwner, product)
	}

	// Handle modal close with state reset
	const handleClose = (onHide) => {
		imageHook.resetImageIndex()
		purchaseHook.resetPurchaseState()
		onHide()
	}

	return {
		// User state
		isLoggedIn,
		isOwner,
		isAvailableForPurchase,

		// Event handlers
		handleContactSeller,
		handleBuyNow,
		handleClose,

		// Image functionality
		...imageHook,

		// Purchase functionality
		...purchaseHook
	}
}