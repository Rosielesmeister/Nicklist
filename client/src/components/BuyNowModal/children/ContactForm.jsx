import React from "react"
import { Form, Row, Col } from "react-bootstrap"
import { MapPin } from "lucide-react"

const ContactForm = ({ formData, errors, onChange }) => {
	return (
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
							onChange={onChange}
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
							onChange={onChange}
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
							onChange={onChange}
							isInvalid={!!errors.phone}
							placeholder="(555) 123-4567"
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
							onChange={onChange}
							isInvalid={!!errors.address}
							placeholder="123 Main Street"
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
							onChange={onChange}
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
							onChange={onChange}
							isInvalid={!!errors.state}
							placeholder="CA"
							size="sm"
						/>
						<Form.Control.Feedback type="invalid">
							{errors.state}
						</Form.Control.Feedback>
					</Form.Group>
				</Col>
				<Col md={4}>
					<Form.Group className="mb-3">
						<Form.Label>ZIP Code *</Form.Label>
						<Form.Control
							type="text"
							name="zipCode"
							value={formData.zipCode}
							onChange={onChange}
							isInvalid={!!errors.zipCode}
							placeholder="12345"
							size="sm"
						/>
						<Form.Control.Feedback type="invalid">
							{errors.zipCode}
						</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
		</div>
	)
}

export default ContactForm