import { useOrderSuccessData } from "./useOrderSuccessData"
import { useOrderSuccessNavigation } from "./useOrderSuccessNavigation"

export const useOrderSuccess = () => {
	// Get order data
	const { orderData, hasOrderData } = useOrderSuccessData()
	
	// Get navigation handlers
	const { handleContinueShopping, handleViewOrders } = useOrderSuccessNavigation()

	return {
		// Order data
		orderData,
		hasOrderData,
		
		// Navigation handlers
		handleContinueShopping,
		handleViewOrders
	}
}