import React from "react"
import { Modal, Button, Card } from "react-bootstrap"
import { CheckCircle } from "lucide-react"

const SuccessScreen = ({ show, onClose, order, product, pricing }) => {
	return (
		<Modal show={show} onHide={onClose} centered size="md">
			<Modal.Body className="text-center py-5">
				<CheckCircle size={64} className="text-success mb-3" />
				<h3 className="text-success mb-3">Order Placed Successfully!</h3>
				<p className="mb-4">
					Thank you for your purchase! Your order has been confirmed and the seller
					has been notified.
				</p>

				<Card className="mb-4">
					<Card.Body>
						<h6>Order Details</h6>
						<div className="text-start">
							<div className="d-flex justify-content-between">
								<span>Order ID:</span>
								<span>#{order._id || order.id}</span>
							</div>
							<div className="d-flex justify-content-between">
								<span>Item:</span>
								<span>{product.name}</span>
							</div>
							<div className="d-flex justify-content-between">
								<span>Total Paid:</span>
								<span className="fw-bold">${pricing.total.toFixed(2)}</span>
							</div>
						</div>
					</Card.Body>
				</Card>

				<p className="text-muted small mb-4">
					You will receive an email confirmation shortly. The seller will contact you
					soon to arrange delivery or pickup.
				</p>

				<Button variant="primary" onClick={onClose}>
					Continue Shopping
				</Button>
			</Modal.Body>
		</Modal>
	)
}

export default SuccessScreen