import { useAuth } from "./useAuth"
import { useProductMessages } from "./useProductMessages"
import { useProductPurchase } from "./useProductPurchases"
import { 
	getUserRelationship, 
	isProductAvailableForPurchase, 
	validateUserAction 
} from "../utils/productHelpers"

export const useProductCard = (product) => {
	const { user } = useAuth()
	
	// Get user relationship to product
	const { isLoggedIn, isOwner } = getUserRelationship(product, user)
	const isAvailableForPurchase = isProductAvailableForPurchase(product, isOwner)

	// Use sub-hooks for specific functionality
	const messageHook = useProductMessages()
	const purchaseHook = useProductPurchase()

	// Handle view details
	const handleViewDetails = (onViewDetails) => (e) => {
		if (e) e.stopPropagation()
		if (onViewDetails) {
			onViewDetails(product)
		}
	}

	// Handle edit product
	const handleEdit = (onEdit) => (e) => {
		if (e) e.stopPropagation()
		if (onEdit) {
			onEdit(product)
		}
	}

	// Handle delete product
	const handleDelete = (onDelete) => (e) => {
		if (e) e.stopPropagation()
		if (onDelete) {
			onDelete(product._id)
		}
	}

	// Handle message seller
	const handleMessageSeller = (e) => {
		e.stopPropagation()

		const validation = validateUserAction('message', isLoggedIn, isOwner, product)
		if (!validation.allowed) {
			alert(validation.message)
			return
		}

		messageHook.openMessageModal(product)
	}

	// Handle buy now
	const handleBuyNow = (e) => {
		e.stopPropagation()

		const validation = validateUserAction('buy', isLoggedIn, isOwner, product)
		if (!validation.allowed) {
			alert(validation.message)
			return
		}

		purchaseHook.openBuyModal()
	}

	// Handle send message wrapper
	const handleSendMessage = async (e) => {
		e.preventDefault()
		return await messageHook.sendMessage(product)
	}

	return {
		// User state
		isLoggedIn,
		isOwner,
		isAvailableForPurchase,
		
		// Action handlers
		handleViewDetails,
		handleEdit,
		handleDelete,
		handleMessageSeller,
		handleBuyNow,
		handleSendMessage,
		
		// Message functionality
		...messageHook,
		
		// Purchase functionality  
		...purchaseHook
	}
}