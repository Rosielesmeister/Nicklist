// ProductDetailsModal/components/BuyNowButton.jsx
import React from "react"
import { Button } from "react-bootstrap"
import { ShoppingBag } from "lucide-react"

const BuyNowButton = ({ product, isAvailableForPurchase, onBuyNow }) => {
	return (
		<div className="mb-3">
			<Button
				variant="success"
				size="lg"
				onClick={onBuyNow}
				disabled={!isAvailableForPurchase}
				className="d-flex align-items-center justify-content-center w-100">
				<ShoppingBag size={16} className="me-2" />
				{!product?.isActive ? "Sold Out" : "Buy Now"}
			</Button>
		</div>
	)
}

export default BuyNowButton