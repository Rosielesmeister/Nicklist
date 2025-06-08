import React from "react"
import { Form } from "react-bootstrap"

const OrderNotes = ({ value, onChange }) => {
	return (
		<Form.Group className="mb-3">
			<Form.Label>Order Notes (Optional)</Form.Label>
			<Form.Control
				as="textarea"
				rows={2}
				name="orderNotes"
				value={value}
				onChange={onChange}
				placeholder="Any special instructions for the seller..."
				size="sm"
			/>
		</Form.Group>
	)
}

export default OrderNotes