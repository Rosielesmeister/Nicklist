import React from "react"
import { Badge } from "react-bootstrap"
import FavoriteButton from "../common/FavoriteButton"
import { UI_CONFIG, PLACEHOLDER_IMAGE } from "../common/Constant"

const ProductImage = ({ product }) => {
	const imageUrl =
		product.images && product.images.length > 0
			? product.images[0].url
			: PLACEHOLDER_IMAGE

	return (
		<div
			style={{
				position: "relative",
				height: UI_CONFIG.IMAGE_HEIGHT,
				overflow: "hidden",
			}}>
			<img
				src={imageUrl}
				alt={product.name || "Product image"}
				style={{
					width: "100%",
					height: "100%",
					objectFit: "cover",
				}}
				onError={(e) => {
					e.target.src = PLACEHOLDER_IMAGE
				}}
				className="card-img-top"
			/>

			{/* Overlay elements */}
			<div style={{ position: "absolute", top: "10px", right: "10px" }}>
				<FavoriteButton productId={product._id} size="sm" />
			</div>

			<div style={{ position: "absolute", top: "10px", left: "10px" }}>
				<Badge bg={product.isActive ? "success" : "secondary"}>
					{product.isActive ? "Available" : "Sold"}
				</Badge>
			</div>
		</div>
	)
}

export default ProductImage