import React from "react"
import { Card } from "react-bootstrap"

const ProductSummary = ({ product }) => {
	return (
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
								<span className="text-muted">No Image</span>
							</div>
						)}
					</div>
					<div className="flex-grow-1">
						<h5 className="mb-1">{product?.name}</h5>
						<p className="text-muted mb-1">{product?.description}</p>
						<span className="h4 text-primary mb-0">
							${product?.price?.toFixed(2)}
						</span>
					</div>
				</div>
			</Card.Body>
		</Card>
	)
}

export default ProductSummary