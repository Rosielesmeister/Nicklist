import React from "react"
import { Modal, Row, Col } from "react-bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"

// Hooks
import { useProductDetails } from "../../hooks/useProductDetails"

// Components
import ModalHeader from "./ModalHeader"
import ImageGallery from "./ImageGallery"
import ProductBasicInfo from "./ProductBasicInfo"
import ProductBadges from "./ProductBadges"
import { 
	LocationInfo, 
	ProductDescription, 
	PostedDate, 
	ContactInfo 
} from "./ProductInfoSections"
import BuyNowButton from "./BuyNowButton"
import ModalFooter from "./ModalFooter"
import BuyNowModal from "../products/BuyNowModal/BuyNowModal"

// Constants
import { UI_CONFIG_PRODUCTS } from "../common/Constant"

const ProductDetailsModal = ({ show, onHide, product }) => {
	// Main hook that orchestrates all product details functionality
	const {
		// User state
		isLoggedIn,
		isOwner,
		isAvailableForPurchase,

		// Event handlers
		handleContactSeller,
		handleBuyNow,
		handleClose,

		// Image functionality
		activeImageIndex,
		handleThumbnailClick,

		// Purchase functionality
		showBuyModal,
		handleOrderComplete,
		closeBuyModal
	} = useProductDetails(product)

	// Don't render if no product provided
	if (!product) return null

	return (
		<>
			<Modal
				show={show}
				onHide={() => handleClose(onHide)}
				size={UI_CONFIG_PRODUCTS.MODAL_SIZE}
				centered
				className="product-details-modal">
				
				<ModalHeader product={product} />

				<Modal.Body className="pt-0">
					<Row>
						{/* Image Section */}
						<Col md={6} className="mb-4">
							<ImageGallery
								product={product}
								activeImageIndex={activeImageIndex}
								onThumbnailClick={handleThumbnailClick}
							/>
						</Col>

						{/* Product Info Section */}
						<Col md={6}>
							<ProductBasicInfo product={product} />
							<ProductBadges product={product} />
							<LocationInfo product={product} />
							<ProductDescription product={product} />
							<PostedDate product={product} />
							<BuyNowButton
								product={product}
								isAvailableForPurchase={isAvailableForPurchase}
								onBuyNow={handleBuyNow}
							/>
							<ContactInfo product={product} />
						</Col>
					</Row>
				</Modal.Body>

				<ModalFooter
					product={product}
					onClose={() => handleClose(onHide)}
					onContactSeller={handleContactSeller}
				/>
			</Modal>

			{/* Buy Now Modal */}
			<BuyNowModal
				show={showBuyModal}
				onHide={closeBuyModal}
				product={product}
				onOrderComplete={handleOrderComplete}
			/>
		</>
	)
}

export default ProductDetailsModal