// OrderSuccess/components/OrderDetailsCard.jsx
import React from "react"
import { Card, Row, Col } from "react-bootstrap"
import { Package, Calendar } from "lucide-react"
import { 
	formatDate, 
	formatPrice, 
	getOrderTotal, 
	getOrderNumber, 
	getOrderStatus 
} from "../../utils/orderSuccessHelpers"

const OrderDetailsCard = ({ orderData }) => {
	return (
		<Card className="mb-4 shadow-sm">
			<Card.Header className="bg-success text-white">
				<h5 className="mb-0">
					<Package className="me-2" size={20} />
					Order Details
				</h5>
			</Card.Header>
			<Card.Body>
				<Row>
					<Col md={6}>
						<div className="mb-3">
							<strong>Order Number:</strong>
							<br />
							<code className="fs-6">{getOrderNumber(orderData)}</code>
						</div>
						<div className="mb-3">
							<strong>Order Date:</strong>
							<br />
							{formatDate(orderData.createdAt)}
						</div>
						{orderData.estimatedDelivery && (
							<div className="mb-3">
								<strong>
									<Calendar className="me-1" size={16} />
									Estimated Delivery:
								</strong>
								<br />
								{formatDate(orderData.estimatedDelivery, 'DELIVERY_DATE')}
							</div>
						)}
					</Col>
					<Col md={6}>
						<div className="mb-3">
							<strong>Status:</strong>
							<br />
							<span className="badge bg-success fs-6">
								{getOrderStatus(orderData)}
							</span>
						</div>
						<div className="mb-3">
							<strong>Total Paid:</strong>
							<br />
							<span className="h4 text-success">
								${formatPrice(getOrderTotal(orderData))}
							</span>
						</div>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	)
}

export default OrderDetailsCard