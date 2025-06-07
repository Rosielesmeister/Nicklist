// hooks/useProductPurchase.js
import { useState } from "react"

export const useProductPurchase = () => {
	const [showBuyModal, setShowBuyModal] = useState(false)

	// Open buy modal
	const openBuyModal = () => {
		setShowBuyModal(true)
	}

	// Close buy modal
	const closeBuyModal = () => {
		setShowBuyModal(false)
	}

	// Handle successful order
	const handleOrderComplete = (order) => {
		console.log("Order completed:", order)
		closeBuyModal()
		// Could refresh product list or show success message here
		// Could also mark product as sold if it's a one-time item
	}

	return {
		showBuyModal,
		openBuyModal,
		closeBuyModal,
		handleOrderComplete
	}
}