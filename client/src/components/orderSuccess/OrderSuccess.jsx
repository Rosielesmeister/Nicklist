import React from "react"
import { Container, Row, Col } from "react-bootstrap"

// Hooks
import { useOrderSuccess } from "../../hooks/useOrderSuccess"

// Components
import NoOrderFallback from "./NoOrderFallback"
import SuccessHeader from "./SuccessHeader"
import OrderDetailsCard from "./OrderDetailsCard"
import ProductInfoCard from "./ProductInfoCard"
import ShippingPaymentCards from "./ShippingPaymentCards"
import OrderNotesCard from "./OrderNotesCard"
import NextSteps from "./NextSteps"
import ActionButtons from "./ActionButtons"

const OrderSuccess = () => {
	// Main hook that orchestrates all order success functionality
	const {
		// Order data
		orderData,
		hasOrderData,
		
		// Navigation handlers
		handleContinueShopping,
		handleViewOrders
	} = useOrderSuccess()

	// Show fallback if no order data
	if (!hasOrderData) {
		return <NoOrderFallback />
	}

	return (
		<Container className="py-5">
			<Row className="justify-content-center">
				<Col lg={8}>
					{/* Success Header */}
					<SuccessHeader />

					{/* Order Details Card */}
					<OrderDetailsCard orderData={orderData} />

					{/* Product Info */}
					<ProductInfoCard orderData={orderData} />

					{/* Shipping & Payment Info */}
					<ShippingPaymentCards orderData={orderData} />

					{/* Order Notes */}
					<OrderNotesCard orderNotes={orderData.orderNotes} />

					{/* Next Steps */}
					<NextSteps />

					{/* Action Buttons */}
					<ActionButtons
						onContinueShopping={handleContinueShopping}
						onViewOrders={handleViewOrders}
					/>
				</Col>
			</Row>
		</Container>
	)
}

export default OrderSuccess