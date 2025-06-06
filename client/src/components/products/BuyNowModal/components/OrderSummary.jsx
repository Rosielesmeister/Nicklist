// BuyNowModal/components/OrderSummary.jsx
import React from "react"
import { Card } from "react-bootstrap"

const OrderSummary = ({ pricing }) => {
	return (
		<Card className="bg-light">
			<Card.Header>
				<h6 className="mb-0">Order Summary</h6>
			</Card.Header>
			<Card.Body>
				<div className="d-flex justify-content-between mb-2">
					<span>Item Price:</span>
					<span>${pricing.productPrice.toFixed(2)}</span>
				</div>
				<div className="d-flex justify-content-between mb-2">
					<span>Tax (8%):</span>
					<span>${pricing.tax.toFixed(2)}</span>
				</div>
				<div className="d-flex justify-content-between mb-2">
					<span>Shipping:</span>
					<span>
						{pricing.shipping === 0 ? "FREE" : `$${pricing.shipping.toFixed(2)}`}
					</span>
				</div>
				{pricing.shipping === 0 && (
					<small className="text-success d-block mb-2">
						🎉 Free shipping on orders over $50!
					</small>
				)}
				<hr />
				<div className="d-flex justify-content-between h6">
					<span>Total:</span>
					<span className="text-primary">${pricing.total.toFixed(2)}</span>
				</div>
			</Card.Body>
		</Card>
	)
}

export default OrderSummary