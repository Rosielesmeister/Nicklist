import React from "react"
import { Form, Row, Col } from "react-bootstrap"
import { CreditCard } from "lucide-react"

const PaymentForm = ({ 
	formData, 
	errors, 
	onChange, 
	onCardNumberChange, 
	onExpiryChange, 
	onCvvChange 
}) => {
	return (
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
							onChange={onCardNumberChange}
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
							onChange={onChange}
							isInvalid={!!errors.cardName}
							placeholder="John Doe"
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
							onChange={onExpiryChange}
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
							onChange={onCvvChange}
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
	)
}

export default PaymentForm