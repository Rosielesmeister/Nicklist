import React from "react"
import { Row, Col, Card } from "react-bootstrap"
import { MapPin, CreditCard } from "lucide-react"

// Shipping Address Card
export const ShippingAddressCard = ({ shippingAddress }) => {
	if (!shippingAddress) return null

	return (
		<Col md={6}>
			<Card className="mb-4 shadow-sm">
				<Card.Header>
					<h6 className="mb-0">
						<MapPin className="me-1" size={16} />
						Shipping Address
					</h6>
				</Card.Header>
				<Card.Body>
					<address className="mb-0">
						<strong>{shippingAddress.fullName}</strong>
						<br />
						{shippingAddress.address}
						<br />
						{shippingAddress.city}, {shippingAddress.state}{" "}
						{shippingAddress.zipCode}
						<br />
						{shippingAddress.country || "United States"}
					</address>
				</Card.Body>
			</Card>
		</Col>
	)
}

// Payment Info Card
export const PaymentInfoCard = ({ paymentInfo }) => {
	if (!paymentInfo) return null

	return (
		<Col md={6}>
			<Card className="mb-4 shadow-sm">
				<Card.Header>
					<h6 className="mb-0">
						<CreditCard className="me-1" size={16} />
						Payment Method
					</h6>
				</Card.Header>
				<Card.Body>
					<p className="mb-1">
						<strong>{paymentInfo.cardType || "Credit Card"}</strong>
					</p>
					<p className="mb-0 text-muted">
						Ending in {paymentInfo.cardLast4}
					</p>
				</Card.Body>
			</Card>
		</Col>
	)
}

// Combined Shipping and Payment Cards
const ShippingPaymentCards = ({ orderData }) => {
	// Don't render if neither shipping nor payment info exists
	if (!orderData.shippingAddress && !orderData.paymentInfo) return null

	return (
		<Row>
			<ShippingAddressCard shippingAddress={orderData.shippingAddress} />
			<PaymentInfoCard paymentInfo={orderData.paymentInfo} />
		</Row>
	)
}

export default ShippingPaymentCards