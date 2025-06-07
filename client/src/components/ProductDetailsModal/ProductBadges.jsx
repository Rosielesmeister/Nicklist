// ProductDetailsModal/components/ProductBadges.jsx
import React from "react"
import { Badge } from "react-bootstrap"

const ProductBadges = ({ product }) => {
	return (
		<div className="mb-3">
			<Badge bg="primary" className="me-2 mb-2">
				{product?.category || "Uncategorized"}
			</Badge>
			<Badge bg="secondary" className="me-2 mb-2">
				{product?.region || "No region"}
			</Badge>
		</div>
	)
}

export default ProductBadges