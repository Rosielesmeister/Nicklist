// components/OrderSuccess.jsx
import React, { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap"
import {
	CheckCircle,
	Package,
	Calendar,
	CreditCard,
	MapPin,
	ArrowLeft,
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

const OrderSuccess = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const [orderData, setOrderData] = useState(null)

	useEffect(() => {
		// Try to get order data from multiple sources
		let order = null

		// 1. From navigation state (if passed from modal)
		if (location.state?.order) {
			order = location.state.order
		}
		// 2. From localStorage (backup)
		else {
			const lastOrder = localStorage.getItem("lastOrder")
			if (lastOrder) {
				try {
					order = JSON.parse(lastOrder)
				} catch (e) {
					console.error("Error parsing order data:", e)
				}
			}
		}

		if (order) {
			setOrderData(order)
		} else {
			// If no order data, redirect to home after a delay
			setTimeout(() => {
				navigate("/")
			}, 3000)
		}
	}, [location.state, navigate])

	const handleContinueShopping = () => {
		// Clear the stored order data
		localStorage.removeItem("lastOrder")
		navigate("/")
	}

	const handleViewOrders = () => {
		// Navigate to orders page (you can create this later)
		navigate("/orders")
	}

	if (!orderData) {
		return (
			<Container className="py-5">
				<Row className="justify-content-center">
					<Col md={6} className="text-center">
						<Alert variant="warning">
							<h5>No order information found</h5>
							<p>Redirecting you to the homepage...</p>
						</Alert>
					</Col>
				</Row>
			</Container>
		)
	}

	return (
		<Container className="py-5">
			<Row className="justify-content-center">
				<Col lg={8}>
					{/* Success Header */}
					<div className="text-center mb-5">
						<CheckCircle size={80} className="text-success mb-3" />
						<h1 className="text-success mb-2">Order Placed Successfully!</h1>
						<p className="lead text-muted">
							Thank you for your purchase! Your order has been confirmed.
						</p>
					</div>

					{/* Order Details Card */}
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
										<code className="fs-6">
											{orderData.orderNumber || orderData._id}
										</code>
									</div>
									<div className="mb-3">
										<strong>Order Date:</strong>
										<br />
										{new Date(orderData.createdAt).toLocaleDateString("en-US", {
											weekday: "long",
											year: "numeric",
											month: "long",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</div>
									{orderData.estimatedDelivery && (
										<div className="mb-3">
											<strong>
												<Calendar className="me-1" size={16} />
												Estimated Delivery:
											</strong>
											<br />
											{new Date(orderData.estimatedDelivery).toLocaleDateString(
												"en-US",
												{
													weekday: "long",
													month: "long",
													day: "numeric",
												},
											)}
										</div>
									)}
								</Col>
								<Col md={6}>
									<div className="mb-3">
										<strong>Status:</strong>
										<br />
										<span className="badge bg-success fs-6">
											{orderData.status || "Confirmed"}
										</span>
									</div>
									<div className="mb-3">
										<strong>Total Paid:</strong>
										<br />
										<span className="h4 text-success">
											$
											{orderData.pricing?.total?.toFixed(2) ||
												orderData.total?.toFixed(2) ||
												"0.00"}
										</span>
									</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>

					{/* Product Info */}
					{orderData.product && (
						<Card className="mb-4 shadow-sm">
							<Card.Header>
								<h6 className="mb-0">Product Information</h6>
							</Card.Header>
							<Card.Body>
								<div className="d-flex align-items-center">
									{orderData.product.images?.[0]?.url ? (
										<img
											src={orderData.product.images[0].url}
											alt={orderData.product.name}
											style={{ width: "80px", height: "80px", objectFit: "cover" }}
											className="rounded me-3"
										/>
									) : (
										<div
											className="bg-light rounded d-flex align-items-center justify-content-center me-3"
											style={{ width: "80px", height: "80px" }}>
											<Package size={30} className="text-muted" />
										</div>
									)}
									<div>
										<h6 className="mb-1">{orderData.product.name || "Product"}</h6>
										<p className="text-muted mb-1">
											Quantity: {orderData.quantity || 1}
										</p>
										<p className="text-muted mb-0">
											Price: $
											{orderData.price?.toFixed(2) ||
												orderData.product.price?.toFixed(2)}
										</p>
									</div>
								</div>
							</Card.Body>
						</Card>
					)}

					{/* Shipping & Payment Info */}
					<Row>
						{orderData.shippingAddress && (
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
											<strong>{orderData.shippingAddress.fullName}</strong>
											<br />
											{orderData.shippingAddress.address}
											<br />
											{orderData.shippingAddress.city},{" "}
											{orderData.shippingAddress.state}{" "}
											{orderData.shippingAddress.zipCode}
											<br />
											{orderData.shippingAddress.country || "United States"}
										</address>
									</Card.Body>
								</Card>
							</Col>
						)}

						{orderData.paymentInfo && (
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
											<strong>
												{orderData.paymentInfo.cardType || "Credit Card"}
											</strong>
										</p>
										<p className="mb-0 text-muted">
											Ending in {orderData.paymentInfo.cardLast4}
										</p>
									</Card.Body>
								</Card>
							</Col>
						)}
					</Row>

					{/* Order Notes */}
					{orderData.orderNotes && (
						<Card className="mb-4 shadow-sm">
							<Card.Header>
								<h6 className="mb-0">Order Notes</h6>
							</Card.Header>
							<Card.Body>
								<p className="mb-0">{orderData.orderNotes}</p>
							</Card.Body>
						</Card>
					)}

					{/* Next Steps */}
					<Alert variant="info">
						<h6>What happens next?</h6>
						<ul className="mb-0">
							<li>You'll receive an email confirmation shortly</li>
							<li>The seller will be notified of your order</li>
							<li>You'll be contacted about delivery arrangements</li>
							<li>Track your order status in your account</li>
						</ul>
					</Alert>

					{/* Action Buttons */}
					<div className="text-center">
						<Button
							variant="outline-primary"
							className="me-3"
							onClick={handleContinueShopping}>
							<ArrowLeft className="me-2" size={16} />
							Continue Shopping
						</Button>
						<Button variant="primary" onClick={handleViewOrders}>
							View My Orders
						</Button>
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default OrderSuccess
