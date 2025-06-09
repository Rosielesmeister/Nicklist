import React, { useState, useEffect } from "react"
import {
	Container,
	Row,
	Col,
	Card,
	Badge,
	Button,
	Alert,
	Spinner,
} from "react-bootstrap"
import { Package, Calendar, CreditCard, Eye, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { ordersAPI } from "../api/api"

const Orders = () => {
	const navigate = useNavigate()
	const { user } = useAuth()
	const [orders, setOrders] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!user) {
			navigate("/login")
			return
		}

		loadOrders()
	}, [user, navigate])

	const loadOrders = async () => {
		try {
			setLoading(true)
			const userOrders = await ordersAPI.getUserOrders()

			// Add the most recent order from localStorage if it exists
			const lastOrder = localStorage.getItem("lastOrder")
			if (lastOrder) {
				try {
					const recentOrder = JSON.parse(lastOrder)
					// Check if this order is already in the list
					const exists = userOrders.some(
						(order) => order._id === recentOrder._id || order.id === recentOrder.id,
					)
					if (!exists) {
						userOrders.unshift(recentOrder) // Add to beginning of array
					}
				} catch (e) {
					console.error("Error parsing recent order:", e)
				}
			}

			setOrders(userOrders)
		} catch (error) {
			console.error("Error loading orders:", error)
			setError("Failed to load orders. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	const getStatusVariant = (status) => {
		switch (status?.toLowerCase()) {
			case "confirmed":
			case "processing":
				return "primary"
			case "shipped":
				return "info"
			case "delivered":
				return "success"
			case "cancelled":
				return "danger"
			case "pending":
			default:
				return "warning"
		}
	}

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		})
	}

	const handleViewOrder = (orderId) => {
		// For now, just show an alert. Later you could create a detailed order view
		alert(
			`View order details for order ${orderId} - This feature will be implemented later!`,
		)
	}

	if (!user) {
		return null // Will redirect to login
	}

	if (loading) {
		return (
			<Container className="py-5">
				<Row className="justify-content-center">
					<Col md={6} className="text-center">
						<Spinner animation="border" className="mb-3" />
						<p>Loading your orders...</p>
					</Col>
				</Row>
			</Container>
		)
	}

	return (
		<Container className="py-5">
			<Row>
				<Col>
					{/* Header */}
					<div className="d-flex align-items-center mb-4">
						<Button
							variant="outline-secondary"
							onClick={() => navigate("/")}
							className="me-3">
							<ArrowLeft size={16} />
						</Button>
						<div>
							<h2 className="mb-1">My Orders</h2>
							<p className="text-muted mb-0">View and track your purchases</p>
						</div>
					</div>

					{/* Error Alert */}
					{error && (
						<Alert variant="danger" className="mb-4">
							{error}
							<Button variant="link" className="p-0 ms-2" onClick={loadOrders}>
								Try Again
							</Button>
						</Alert>
					)}

					{/* Orders List */}
					{orders.length === 0 ? (
						<Card className="text-center py-5">
							<Card.Body>
								<Package size={64} className="text-muted mb-3" />
								<h5 className="text-muted">No orders yet</h5>
								<p className="text-muted mb-4">
									When you make a purchase, your orders will appear here.
								</p>
								<Button variant="primary" onClick={() => navigate("/")}>
									Start Shopping
								</Button>
							</Card.Body>
						</Card>
					) : (
						<div className="space-y-4">
							{orders.map((order, index) => (
								<Card
									key={order._id || order.id || index}
									className="mb-4 shadow-sm">
									<Card.Body>
										<Row className="align-items-center">
											<Col md={8}>
												<div className="d-flex align-items-start">
													{/* Product Image */}
													<div className="me-3">
														{order.product?.images?.[0]?.url ? (
															<img
																src={order.product.images[0].url}
																alt={order.product.name}
																style={{
																	width: "60px",
																	height: "60px",
																	objectFit: "cover",
																}}
																className="rounded"
															/>
														) : (
															<div
																className="bg-light rounded d-flex align-items-center justify-content-center"
																style={{ width: "60px", height: "60px" }}>
																<Package size={24} className="text-muted" />
															</div>
														)}
													</div>

													{/* Order Details */}
													<div className="flex-grow-1">
														<div className="d-flex align-items-center mb-2">
															<h6 className="mb-0 me-3">
																{order.product?.name || "Product"}
															</h6>
															<Badge bg={getStatusVariant(order.status)}>
																{order.status || "Pending"}
															</Badge>
														</div>

														<p className="text-muted small mb-2">
															<strong>Order:</strong> #
															{order.orderNumber || order._id || order.id}
														</p>

														<p className="text-muted small mb-2">
															<Calendar size={14} className="me-1" />
															Ordered: {formatDate(order.createdAt)}
														</p>

														{order.estimatedDelivery && (
															<p className="text-muted small mb-0">
																<Package size={14} className="me-1" />
																Est. Delivery:{" "}
																{new Date(
																	order.estimatedDelivery,
																).toLocaleDateString()}
															</p>
														)}
													</div>
												</div>
											</Col>

											<Col md={4} className="text-md-end">
												<div className="mb-2">
													<span className="h5 text-success">
														${(order.pricing?.total || order.total || 0).toFixed(2)}
													</span>
												</div>

												{order.paymentInfo?.cardLast4 && (
													<p className="text-muted small mb-2">
														<CreditCard size={14} className="me-1" />
														•••• {order.paymentInfo.cardLast4}
													</p>
												)}

												<Button
													variant="outline-primary"
													size="sm"
													onClick={() => handleViewOrder(order._id || order.id)}>
													<Eye size={14} className="me-1" />
													View Details
												</Button>
											</Col>
										</Row>

										{/* Order Notes */}
										{order.orderNotes && (
											<Row className="mt-3">
												<Col>
													<Alert variant="light" className="mb-0">
														<small>
															<strong>Note:</strong> {order.orderNotes}
														</small>
													</Alert>
												</Col>
											</Row>
										)}
									</Card.Body>
								</Card>
							))}
						</div>
					)}

					{/* Help Section */}
					<Card className="mt-5 bg-light">
						<Card.Body>
							<h6>Need Help?</h6>
							<p className="text-muted mb-3">
								Have questions about your order? Contact the seller directly or reach
								out to our support team.
							</p>
							<Button variant="outline-primary" size="sm">
								Contact Support
							</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default Orders
