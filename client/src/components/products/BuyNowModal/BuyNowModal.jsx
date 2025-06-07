import React from "react"
import { Modal, Form, Button, Alert, Row, Col, Spinner } from "react-bootstrap"
import { Lock } from "lucide-react"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"

// Hooks
import { useBuyNowForm } from "../../../hooks/useBuyNowForm"
import { useOrderProcessing } from "../../../hooks/useOrderProcessing"

// Components
import ProductSummary from "../BuyNowModal/children/ProductSummary"
import ContactForm from "../BuyNowModal/children/ContactForm"
import PaymentForm from "./children/PaymentForm"
import OrderSummary from "./children/OrderSummary"
import OrderNotes from "./children/OrderNotes"
import SuccessScreen from "./children/SuccessScreen"

// Utils
import { calculatePricing } from "../../../utils/priceCalculations"

const BuyNowModal = ({ show, onHide, product, onOrderComplete }) => {
	// Custom hooks for state management
	const {
		formData,
		errors,
		handleInputChange,
		handleCardNumberChange,
		handleExpiryChange,
		handleCvvChange,
		validateForm,
		resetForm,
		setGeneralError,
		clearErrors,
	} = useBuyNowForm()

	const { processing, orderSuccess, completedOrder, submitOrder, resetOrderState } =
		useOrderProcessing()

	// Calculate pricing
	const pricing = calculatePricing(product?.price || 0)

	// Handle modal close
	const handleClose = () => {
		resetForm()
		resetOrderState()
		onHide()
	}

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault()

		// Validate form first
		if (!validateForm()) {
			return
		}

		// Clear any previous errors
		clearErrors()

		try {
			const order = await submitOrder({
				formData,
				product,
				pricing,
			})

			// Notify parent component
			if (onOrderComplete) {
				onOrderComplete(order)
			}
		} catch (error) {
			console.error("Error creating order:", error)

			// Show user-friendly error message
			setGeneralError(error.message)
		}
	}

	// Show success screen if order completed
	if (orderSuccess && completedOrder) {
		
		return (
			<SuccessScreen
				show={true}
				onClose={handleClose}
				order={completedOrder}
				product={product}
				pricing={pricing}
			/>
		)
	}

	// Main form modal
	return (
		<Modal show={show} onHide={handleClose} centered size="lg">
			<Modal.Header closeButton>
				<Modal.Title>Buy Now - {product?.name}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				{/* General Error Alert */}
				{errors.general && (
					<Alert variant="danger" className="mb-4">
						<i className="bi bi-exclamation-triangle-fill me-2"></i>
						{errors.general}
					</Alert>
				)}

				{/* Product Summary */}
				<ProductSummary product={product} />

				<Form onSubmit={handleSubmit}>
					<Row>
						<Col md={8}>
							{/* Contact & Shipping Information */}
							<ContactForm
								formData={formData}
								errors={errors}
								onChange={handleInputChange}
							/>

							{/* Payment Information */}
							<PaymentForm
								formData={formData}
								errors={errors}
								onChange={handleInputChange}
								onCardNumberChange={handleCardNumberChange}
								onExpiryChange={handleExpiryChange}
								onCvvChange={handleCvvChange}
							/>

							{/* Order Notes */}
							<OrderNotes value={formData.orderNotes} onChange={handleInputChange} />
						</Col>

						<Col md={4}>
							{/* Order Summary */}
							<OrderSummary pricing={pricing} />
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
							Processing Order...
						</>
					) : (
						<>
							<Lock className="me-2" size={16} />
							Complete Purchase - ${pricing.total.toFixed(2)}
						</>
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default BuyNowModal
