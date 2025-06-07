import { useNavigate } from "react-router-dom"
import { clearStoredOrderData } from "../utils/orderSuccessHelpers"

export const useOrderSuccessNavigation = () => {
	const navigate = useNavigate()

	const handleContinueShopping = () => {
		// Clear the stored order data
		clearStoredOrderData()
		navigate("/")
	}

	const handleViewOrders = () => {
		// Navigate to orders page
		navigate("/orders")
	}

	return {
		handleContinueShopping,
		handleViewOrders
	}
}