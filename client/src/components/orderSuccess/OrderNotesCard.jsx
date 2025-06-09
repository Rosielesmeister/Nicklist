import React from "react"
import { Card } from "react-bootstrap"

const OrderNotesCard = ({ orderNotes }) => {
	if (!orderNotes) return null

	return (
		<Card className="mb-4 shadow-sm">
			<Card.Header>
				<h6 className="mb-0">Order Notes</h6>
			</Card.Header>
			<Card.Body>
				<p className="mb-0">{orderNotes}</p>
			</Card.Body>
		</Card>
	)
}

export default OrderNotesCard