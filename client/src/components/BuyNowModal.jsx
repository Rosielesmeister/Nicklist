import React, { useState } from "react"
import { Modal, Form, Button, Alert, Row, Col, Card, Spinner } from "react-bootstrap"
import { CreditCard, MapPin, Lock, CheckCircle } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { ordersAPI } from "../api/api"
import { useNavigate } from "react-router-dom"

const BuyNowModal = ({ show, onHide, product, onOrderComplete }) => {
	const { user } = useAuth()
	const navigate = useNavigate()

	// Form state
	const [formData, setFormData] = useState({
		// Contact Information
		fullName: user?.name || "",
		email: user?.email || "",
		phone: "",

		// Shipping Information
		address: "",
		city: "",
		state: "",
		zipCode: "",

		// Payment Information
		cardNumber: "",
		cardName: "",
		expiryDate: "",
		cvv: "",

		// Order notes
		orderNotes: "",
	})

	const [errors, setErrors] = useState({})
	const [processing, setProcessing] = useState(false)

	// Calculate totals
	const productPrice = product?.price || 0
	const tax = productPrice * 0.08 // 8% tax
	const shipping = productPrice > 50 ? 0 : 9.99 // Free shipping over $50
	const total = productPrice + tax + shipping

	// Handle form input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}))
		}
	}

	// Format card number input
	const handleCardNumberChange = (e) => {
		let value = e.target.value.replace(/\D/g, "") // Remove non-digits
		value = value.replace(/(\d{4})(?=\d)/g, "$1 ") // Add spaces every 4 digits
		if (value.length <= 19) {
			// Max length with spaces
			setFormData((prev) => ({
				...prev,
				cardNumber: value,
			}))
		}
	}

	// Format expiry date input
	const handleExpiryChange = (e) => {
		let value = e.target.value.replace(/\D/g, "")
		if (value.length >= 2) {
			value = value.substring(0, 2) + "/" + value.substring(2, 4)
		}
		setFormData((prev) => ({
			...prev,
			expiryDate: value,
		}))
	}

	// Validate form
	const validateForm = () => {
		const newErrors = {}

		// Required fields
		if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
		if (!formData.email.trim()) newErrors.email = "Email is required"
		if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
		if (!formData.address.trim()) newErrors.address = "Address is required"
		if (!formData.city.trim()) newErrors.city = "City is required"
		if (!formData.state.trim()) newErrors.state = "State is required"
		if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
		if (!formData.cardNumber.replace(/\s/g, ""))
			newErrors.cardNumber = "Card number is required"
		if (!formData.cardName.trim()) newErrors.cardName = "Cardholder name is required"
		if (!formData.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required"
		if (!formData.cvv.trim()) newErrors.cvv = "CVV is required"

		// Email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (formData.email && !emailRegex.test(formData.email)) {
			newErrors.email = "Please enter a valid email address"
		}

		// Card number validation (basic)
		const cardNumberDigits = formData.cardNumber.replace(/\s/g, "")
		if (cardNumberDigits && cardNumberDigits.length < 13) {
			newErrors.cardNumber = "Please enter a valid card number"
		}

		// CVV validation
		if (formData.cvv && (formData.cvv.length < 3 || formData.cvv.length > 4)) {
			newErrors.cvv = "CVV must be 3 or 4 digits"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		if (!product) {
			alert("Product information is missing")
			return
		}

		setProcessing(true)

		try {
			// Prepare order data for single product
			const orderData = {
				product: product,
				seller: product.user || product.user?._id,
				quantity: 1, // Always 1 for direct buy
				price: product.price,

				shippingAddress: {
					fullName: formData.fullName,
					address: formData.address,
					city: formData.city,
					state: formData.state,
					zipCode: formData.zipCode,
					country: "United States",
				},

				contactInfo: {
					email: formData.email,
					phone: formData.phone,
				},

				paymentInfo: {
					cardLast4: formData.cardNumber.slice(-4),
					cardType: "Credit Card",
				},

				pricing: {
					productPrice: productPrice,
					tax: tax,
					shipping: shipping,
					total: total,
				},

				orderNotes: formData.orderNotes,
			}

			console.log("Submitting order:", orderData)

			// Create the order
			const order = await ordersAPI.createOrder(orderData)
			console.log("Order created successfully:", order)
			//close modal and navigate to success page
			onHide()
			navigate("/order-success", {
				state: { order },
				replace: true,
			})

			// Simulate payment processing delay
			await new Promise((resolve) => setTimeout(resolve, 2000))

			if (onOrderComplete) {
				onOrderComplete(order)
			}
		} catch (error) {
			console.error("Error creating order:", error)
			alert(`Failed to process order: ${error.message}`)
		} finally {
			setProcessing(false)
		}
	}

	// Reset modal state when closing
	const handleClose = () => {
		setErrors({})
		setProcessing(false)
		onHide()
	}

	return (
		<Modal show={show} onHide={handleClose} centered size="lg">
			<Modal.Header closeButton>
				<Modal.Title>Buy Now - {product?.name}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				{/* Product Summary */}
				<Card className="mb-4">
					<Card.Body>
						<div className="d-flex align-items-center">
							<div className="me-3">
								{product?.images && product.images.length > 0 ? (
									<img
										src={product.images[0].url}
										alt={product.name}
										style={{ width: "80px", height: "80px", objectFit: "cover" }}
										className="rounded"
									/>
								) : (
									<div
										className="bg-light rounded d-flex align-items-center justify-content-center"
										style={{ width: "80px", height: "80px" }}>
										No Image
									</div>
								)}
							</div>
							<div className="flex-grow-1">
								<h5 className="mb-1">{product?.name}</h5>
								<p className="text-muted mb-1">{product?.description}</p>
								<div className="d-flex justify-content-between align-items-center">
									<span className="h4 text-primary mb-0">
										${product?.price?.toFixed(2)}
									</span>
								</div>
							</div>
						</div>
					</Card.Body>
				</Card>

				<Form onSubmit={handleSubmit}>
					<Row>
						<Col md={8}>
							{/* Contact Information */}
							<div className="mb-4">
								<h6 className="d-flex align-items-center mb-3">
									<MapPin className="me-2" size={18} />
									Contact & Shipping Information
								</h6>

								<Row>
									<Col md={6}>
										<Form.Group className="mb-3">
											<Form.Label>Full Name *</Form.Label>
											<Form.Control
												type="text"
												name="fullName"
												value={formData.fullName}
												onChange={handleInputChange}
												isInvalid={!!errors.fullName}
												size="sm"
											/>
											<Form.Control.Feedback type="invalid">
												{errors.fullName}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
									<Col md={6}>
										<Form.Group className="mb-3">
											<Form.Label>Email *</Form.Label>
											<Form.Control
												type="email"
												name="email"
												value={formData.email}
												onChange={handleInputChange}
												isInvalid={!!errors.email}
												size="sm"
											/>
											<Form.Control.Feedback type="invalid">
												{errors.email}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
								</Row>

								<Row>
									<Col md={6}>
										<Form.Group className="mb-3">
											<Form.Label>Phone *</Form.Label>
											<Form.Control
												type="tel"
												name="phone"
												value={formData.phone}
												onChange={handleInputChange}
												isInvalid={!!errors.phone}
												size="sm"
											/>
											<Form.Control.Feedback type="invalid">
												{errors.phone}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
									<Col md={6}>
										<Form.Group className="mb-3">
											<Form.Label>Address *</Form.Label>
											<Form.Control
												type="text"
												name="address"
												value={formData.address}
												onChange={handleInputChange}
												isInvalid={!!errors.address}
												size="sm"
											/>
											<Form.Control.Feedback type="invalid">
												{errors.address}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
								</Row>

								<Row>
									<Col md={4}>
										<Form.Group className="mb-3">
											<Form.Label>City *</Form.Label>
											<Form.Control
												type="text"
												name="city"
												value={formData.city}
												onChange={handleInputChange}
												isInvalid={!!errors.city}
												size="sm"
											/>
											<Form.Control.Feedback type="invalid">
												{errors.city}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
									<Col md={4}>
										<Form.Group className="mb-3">
											<Form.Label>State *</Form.Label>
											<Form.Control
												type="text"
												name="state"
												value={formData.state}
												onChange={handleInputChange}
												isInvalid={!!errors.state}
												size="sm"
											/>
											<Form.Control.Feedback type="invalid">
												{errors.state}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
									<Col md={4}>
										<Form.Group className="mb-3">
											<Form.Label>ZIP *</Form.Label>
											<Form.Control
												type="text"
												name="zipCode"
												value={formData.zipCode}
												onChange={handleInputChange}
												isInvalid={!!errors.zipCode}
												size="sm"
											/>
											<Form.Control.Feedback type="invalid">
												{errors.zipCode}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
								</Row>
							</div>

							{/* Payment Information */}
							<div className="mb-4">
								<h6 className="d-flex align-items-center mb-3">
									<CreditCard className="me-2" size={18} />
									Payment Information
								</h6>

								<Row>
									<Col md={6}>
										<Form.Group className="mb-3">
											<Form.Label>Card Number *</Form.Label>
											<Form.Control
												type="text"
												name="cardNumber"
												value={formData.cardNumber}
												onChange={handleCardNumberChange}
												isInvalid={!!errors.cardNumber}
												placeholder="1234 5678 9012 3456"
												maxLength="19"
												size="sm"
											/>
											<Form.Control.Feedback type="invalid">
												{errors.cardNumber}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
									<Col md={6}>
										<Form.Group className="mb-3">
											<Form.Label>Cardholder Name *</Form.Label>
											<Form.Control
												type="text"
												name="cardName"
												value={formData.cardName}
												onChange={handleInputChange}
												isInvalid={!!errors.cardName}
												size="sm"
											/>
											<Form.Control.Feedback type="invalid">
												{errors.cardName}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
								</Row>

								<Row>
									<Col md={6}>
										<Form.Group className="mb-3">
											<Form.Label>Expiry Date *</Form.Label>
											<Form.Control
												type="text"
												name="expiryDate"
												value={formData.expiryDate}
												onChange={handleExpiryChange}
												isInvalid={!!errors.expiryDate}
												placeholder="MM/YY"
												maxLength="5"
												size="sm"
											/>
											<Form.Control.Feedback type="invalid">
												{errors.expiryDate}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
									<Col md={6}>
										<Form.Group className="mb-3">
											<Form.Label>CVV *</Form.Label>
											<Form.Control
												type="text"
												name="cvv"
												value={formData.cvv}
												onChange={handleInputChange}
												isInvalid={!!errors.cvv}
												placeholder="123"
												maxLength="4"
												size="sm"
											/>
											<Form.Control.Feedback type="invalid">
												{errors.cvv}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
								</Row>
							</div>

							{/* Order Notes */}
							<Form.Group className="mb-3">
								<Form.Label>Order Notes (Optional)</Form.Label>
								<Form.Control
									as="textarea"
									rows={2}
									name="orderNotes"
									value={formData.orderNotes}
									onChange={handleInputChange}
									placeholder="Any special instructions..."
									size="sm"
								/>
							</Form.Group>
						</Col>

						<Col md={4}>
							{/* Order Summary */}
							<Card className="bg-light">
								<Card.Header>
									<h6 className="mb-0">Order Summary</h6>
								</Card.Header>
								<Card.Body>
									<div className="d-flex justify-content-between mb-2">
										<span>Item Price:</span>
										<span>${productPrice.toFixed(2)}</span>
									</div>
									<div className="d-flex justify-content-between mb-2">
										<span>Tax:</span>
										<span>${tax.toFixed(2)}</span>
									</div>
									<div className="d-flex justify-content-between mb-2">
										<span>Shipping:</span>
										<span>
											{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
										</span>
									</div>
									{shipping === 0 && (
										<small className="text-success d-block mb-2">
											🎉 Free shipping!
										</small>
									)}
									<hr />
									<div className="d-flex justify-content-between h6">
										<span>Total:</span>
										<span className="text-primary">${total.toFixed(2)}</span>
									</div>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Form>
			</Modal.Body>

			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose} disabled={processing}>
					Cancel
				</Button>
				<Button
					variant="success"
					onClick={handleSubmit}
					disabled={processing}
					className="d-flex align-items-center">
					{processing ? (
						<>
							<Spinner size="sm" className="me-2" />
							Processing...
						</>
					) : (
						<>
							<Lock className="me-2" size={16} />
							Buy Now - ${total.toFixed(2)}
						</>
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default BuyNowModal
