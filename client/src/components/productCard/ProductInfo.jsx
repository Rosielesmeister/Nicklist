import React from "react"
import { Card, Badge } from "react-bootstrap"
import { getTruncatedDescription } from "../../utils/productHelpers"

const ProductInfo = ({ product, onViewDetails }) => {
	return (
		<div
			onClick={onViewDetails}
			className="flex-grow-1"
			style={{ cursor: "pointer" }}>
			{/* Title and Price */}
			<div className="d-flex justify-content-between align-items-start mb-2">
				<Card.Title className="h6 mb-0 text-truncate" style={{ maxWidth: "70%" }}>
					{product.name}
				</Card.Title>
				<strong className="text-primary fs-5">
					${product.price?.toLocaleString()}
				</strong>
			</div>

			{/* Category and Region */}
			<div className="mb-2">
				<Badge bg="light" text="dark" className="me-2">
					{product.category}
				</Badge>
				<Badge bg="outline-secondary" className="text-muted">
					{product.region}
				</Badge>
			</div>

			{/* Description */}
			<Card.Text className="text-muted small mb-2">
				{getTruncatedDescription(product.description)}
			</Card.Text>

			{/* Location */}
			<div className="text-muted small mb-2">
				📍 {product.city}, {product.state}
			</div>
		</div>
	)
}

export default ProductInfo