// ProductCard/components/BuyerActions.jsx
import React from "react"
import { Button } from "react-bootstrap"
import { MessageCircle, ShoppingBag } from "lucide-react"

const BuyerActions = ({ 
	product, 
	isLoggedIn,
	isAvailableForPurchase,
	onViewDetails, 
	onBuyNow, 
	onMessageSeller 
}) => {
	return (
		<div className="d-grid gap-2">
			{/* Primary buy button */}
			<Button
				variant="success"
				size="sm"
				onClick={onBuyNow}
				disabled={!isAvailableForPurchase}
				className="d-flex align-items-center justify-content-center">
				<ShoppingBag size={16} className="me-2" />
				{!product.isActive ? "Sold Out" : "Buy Now"}
			</Button>

			{/* Secondary actions */}
			<div className="d-flex gap-2">
				<Button
					variant="outline-primary"
					size="sm"
					className="flex-grow-1"
					onClick={onViewDetails}>
					View Details
				</Button>

				{isLoggedIn && (
					<Button
						variant="outline-info"
						size="sm"
						onClick={onMessageSeller}
						title="Message Seller">
						<MessageCircle size={16} />
					</Button>
				)}
			</div>
		</div>
	)
}

export default BuyerActions