// ProductCard/components/OwnerActions.jsx
import React from "react"
import { Button } from "react-bootstrap"

const OwnerActions = ({ onViewDetails, onEdit, onDelete, showActions }) => {
	return (
		<div className="d-flex gap-2">
			<Button
				variant="primary"
				size="sm"
				className="flex-grow-1"
				onClick={onViewDetails}>
				View Details
			</Button>
			{showActions && (
				<>
					<Button variant="outline-secondary" size="sm" onClick={onEdit}>
						Edit
					</Button>
					<Button variant="outline-danger" size="sm" onClick={onDelete}>
						Delete
					</Button>
				</>
			)}
		</div>
	)
}

export default OwnerActions