import React from "react"
import { UI_CONFIG_PRODUCTS, DEFAULT_STYLES, PLACEHOLDER_IMAGES } from "../common/Constant"

const ImageGallery = ({ product, activeImageIndex, onThumbnailClick }) => {
	// No images case
	if (!product?.images || product.images.length === 0) {
		return (
			<div
				style={{
					height: UI_CONFIG_PRODUCTS.MAIN_IMAGE_HEIGHT,
					...DEFAULT_STYLES.noImageContainer,
				}}
				className="d-flex align-items-center justify-content-center mb-3">
				<span className="text-muted fs-1">📷</span>
			</div>
		)
	}

	return (
		<>
			{/* Main Image Display */}
			<div
				style={{
					height: UI_CONFIG_PRODUCTS.MAIN_IMAGE_HEIGHT,
					...DEFAULT_STYLES.imageContainer,
				}}
				className="mb-3">
				<img
					src={product.images[activeImageIndex]?.url}
					alt={product.name || "Product image"}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
					}}
					onError={(e) => {
						e.target.src = PLACEHOLDER_IMAGES.NO_IMAGE
					}}
				/>
			</div>

			{/* Image Thumbnails */}
			{product.images.length > 1 && (
				<div className="d-flex gap-2 overflow-auto">
					{product.images.map((image, index) => (
						<img
							key={index}
							src={image.url}
							alt={`${product.name} ${index + 1}`}
							style={{
								width: UI_CONFIG_PRODUCTS.THUMBNAIL_SIZE,
								height: UI_CONFIG_PRODUCTS.THUMBNAIL_SIZE,
								objectFit: "cover",
								borderRadius: UI_CONFIG_PRODUCTS.THUMBNAIL_BORDER_RADIUS,
								cursor: "pointer",
								border:
									activeImageIndex === index
										? "2px solid #0d6efd"
										: "2px solid transparent",
							}}
							onClick={() => onThumbnailClick(index)}
							onError={(e) => {
								e.target.style.display = "none"
							}}
						/>
					))}
				</div>
			)}
		</>
	)
}

export default ImageGallery