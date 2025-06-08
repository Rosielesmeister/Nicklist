import { useState } from "react"
import { validatePurchaseAction } from "../utils/productDetailsHelpers"

export const useProductDetailsPurchase = () => {
	const [showBuyModal, setShowBuyModal] = useState(false)

	// Handle buy now button
	const handleBuyNow = (isLoggedIn, isOwner, product) => {
		const validation = validatePurchaseAction(isLoggedIn, isOwner, product)
		
		if (!validation.allowed) {
			alert(validation.message)
			return
		}

		setShowBuyModal(true)
	}

	// Handle successful order
	const handleOrderComplete = (order) => {
		console.log("Order completed:", order)
		setShowBuyModal(false)
		// Could refresh product list or show success message
		// Could also mark product as sold if it's a one-time item
	}

	// Close buy modal
	const closeBuyModal = () => {
		setShowBuyModal(false)
	}

	// Reset purchase state
	const resetPurchaseState = () => {
		setShowBuyModal(false)
	}

	return {
		showBuyModal,
		handleBuyNow,
		handleOrderComplete,
		closeBuyModal,
		resetPurchaseState
	}
}