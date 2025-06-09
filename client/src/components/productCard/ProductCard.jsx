import React from "react"
import { Card } from "react-bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"

// Hooks
import { useProductCard } from "../../hooks/useProductCard"

// Components
import ProductImage from "./ProductImage"
import ProductInfo from "./ProductInfo"
import ActionButtons from "./ActionButtons"
import MessageModal from "./MessageModal"
import BuyNowModal from "../BuyNowModal/BuyNowModal"

const ProductCard = ({
	product,
	onViewDetails,
	showActions = false,
	onEdit,
	onDelete,
}) => {
	const {
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
		showMessageModal,
		messageText,
		sendingMessage,
		messageError,
		closeMessageModal,
		handleMessageTextChange,
		
		// Purchase functionality
		showBuyModal,
		closeBuyModal,
		handleOrderComplete
	} = useProductCard(product)

	return (
		<>
			<Card className="h-100 border-0 shadow-sm product-card">
				<ProductImage product={product} />

				<Card.Body className="d-flex flex-column">
					<ProductInfo 
						product={product} 
						onViewDetails={handleViewDetails(onViewDetails)}
					/>
					
					<ActionButtons
						product={product}
						isOwner={isOwner}
						isLoggedIn={isLoggedIn}
						isAvailableForPurchase={isAvailableForPurchase}
						showActions={showActions}
						onViewDetails={handleViewDetails(onViewDetails)}
						onEdit={handleEdit(onEdit)}
						onDelete={handleDelete(onDelete)}
						onBuyNow={handleBuyNow}
						onMessageSeller={handleMessageSeller}
					/>
				</Card.Body>
			</Card>

			<MessageModal
				show={showMessageModal}
				onHide={closeMessageModal}
				product={product}
				messageText={messageText}
				messageError={messageError}
				sendingMessage={sendingMessage}
				onMessageTextChange={handleMessageTextChange}
				onSendMessage={handleSendMessage}
			/>

			<BuyNowModal
				show={showBuyModal}
				onHide={closeBuyModal}
				product={product}
				onOrderComplete={handleOrderComplete}
			/>
		</>
	)
}

export default ProductCard