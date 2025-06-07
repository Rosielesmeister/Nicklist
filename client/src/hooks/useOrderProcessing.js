import { useState } from "react"
// You'll need to import your orders API - adjust path as needed
// import { ordersAPI } from "../api/orders" or wherever your API functions are located

export const useOrderProcessing = () => {
	const [processing, setProcessing] = useState(false)
	const [orderSuccess, setOrderSuccess] = useState(false)
	const [completedOrder, setCompletedOrder] = useState(null)

	const submitOrder = async ({ formData, product, pricing }) => {
		// Check if product exists
		if (!product) {
			throw new Error("Product information is missing")
		}

		setProcessing(true)

		try {
			// Prepare order data
			const orderData = {
				product: product._id,
				seller: product.user?._id || product.user,
				quantity: 1,
				price: product.price,

				shippingAddress: {
					fullName: formData.fullName.trim(),
					address: formData.address.trim(),
					city: formData.city.trim(),
					state: formData.state.trim(),
					zipCode: formData.zipCode.trim(),
					country: "United States",
				},

				contactInfo: {
					email: formData.email.trim(),
					phone: formData.phone.trim(),
				},

				paymentInfo: {
					cardLast4: formData.cardNumber.replace(/\s/g, "").slice(-4),
					cardType: "Card",
					cardName: formData.cardName.trim(),
				},

				pricing: pricing,

				orderNotes: formData.orderNotes.trim(),
			}

			console.log("Submitting order:", orderData)

			// Create the order using our centralized API
			const order = await ordersAPI.createOrder(orderData)

			console.log("Order created successfully:", order)

			// Simulate payment processing delay (remove in production)
			await new Promise((resolve) => setTimeout(resolve, 1500))

			// Set success state
			setCompletedOrder(order)
			setOrderSuccess(true)

			return order
		} catch (error) {
			console.error("Error creating order:", error)
			
			// Re-throw with user-friendly message
			throw new Error(`Failed to process order: ${error.message || "Please try again."}`)
		} finally {
			setProcessing(false)
		}
	}

	// Reset order state
	const resetOrderState = () => {
		setProcessing(false)
		setOrderSuccess(false)
		setCompletedOrder(null)
	}

	return {
		processing,
		orderSuccess,
		completedOrder,
		submitOrder,
		resetOrderState
	}
}