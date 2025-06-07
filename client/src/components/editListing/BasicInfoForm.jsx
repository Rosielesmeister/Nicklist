// EditListing/components/BasicInfoForm.jsx
import React from "react"
import { Form, Row, Col } from "react-bootstrap"
import { CATEGORIES } from "../common/Constant"
import { VALIDATION_RULES } from "../common/Constant"
import { getCharacterCounts } from "../../utils/editListingValidation"
import CharacterCounter from "./CharacterCounter"

const BasicInfoForm = ({ formData, onChange, isLoading }) => {
	const characterCounts = getCharacterCounts(formData)

	return (
		<>
			{/* Product Name */}
			<Row>
				<Col md={12}>
					<Form.Group className="mb-3">
						<Form.Label>
							Product Name *
							<CharacterCounter
								current={characterCounts.name}
								max={VALIDATION_RULES.NAME_MAX_LENGTH}
							/>
						</Form.Label>
						<Form.Control
							type="text"
							name="name"
							value={formData.name}
							onChange={onChange}
							placeholder="What are you selling?"
							required
							disabled={isLoading}
							maxLength={VALIDATION_RULES.NAME_MAX_LENGTH + 10} // Allow typing a bit over for better UX
							className={
								characterCounts.name > VALIDATION_RULES.NAME_MAX_LENGTH
									? "is-invalid"
									: ""
							}
						/>
					</Form.Group>
				</Col>
			</Row>

			{/* Price and Category */}
			<Row>
				<Col md={6}>
					<Form.Group className="mb-3">
						<Form.Label>Price * ($)</Form.Label>
						<Form.Control
							type="number"
							name="price"
							value={formData.price}
							onChange={onChange}
							placeholder="0.00"
							min={VALIDATION_RULES.MIN_PRICE}
							step="0.01"
							required
							disabled={isLoading}
						/>
					</Form.Group>
				</Col>
				<Col md={6}>
					<Form.Group className="mb-3">
						<Form.Label>Category *</Form.Label>
						<Form.Select
							name="category"
							value={formData.category}
							onChange={onChange}
							required
							disabled={isLoading}>
							<option value="">Select a category</option>
							{CATEGORIES.map((cat) => (
								<option key={cat} value={cat}>
									{cat}
								</option>
							))}
						</Form.Select>
					</Form.Group>
				</Col>
			</Row>
		</>
	)
}

export default BasicInfoForm