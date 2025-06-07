// ProductCard/components/ActionButtons.jsx
import React from "react"
import OwnerActions from "./OwnerActions"
import BuyerActions from "./BuyerActions"

const ActionButtons = ({
	product,
	isOwner,
	isLoggedIn,
	isAvailableForPurchase,
	showActions,
	onViewDetails,
	onEdit,
	onDelete,
	onBuyNow,
	onMessageSeller
}) => {
	return (
		<div className="mt-auto pt-2">
			{isOwner ? (
				<OwnerActions
					onViewDetails={onViewDetails}
					onEdit={onEdit}
					onDelete={onDelete}
					showActions={showActions}
				/>
			) : (
				<BuyerActions
					product={product}
					isLoggedIn={isLoggedIn}
					isAvailableForPurchase={isAvailableForPurchase}
					onViewDetails={onViewDetails}
					onBuyNow={onBuyNow}
					onMessageSeller={onMessageSeller}
				/>
			)}

			{/* Status message for unavailable items */}
			{!product.isActive && (
				<div className="text-center mt-2">
					<small className="text-muted">This item is no longer available</small>
				</div>
			)}
		</div>
	)
}

export default ActionButtons