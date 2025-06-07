// OrderSuccess/components/ProductInfoCard.jsx
import React from "react"
import { Card } from "react-bootstrap"
import { Package } from "lucide-react"
import { formatPrice, getProductPrice } from "../../utils/orderSuccessHelpers"
import { UI_CONFIG_ORDER_SUCCES } from "../common/Constant"

const ProductInfoCard = ({ orderData }) => {
	if (!orderData.product) return null

	return (
		<Card className="mb-4 shadow-sm">
			<Card.Header>
				<h6 className="mb-0">Product Information</h6>
			</Card.Header>
			<Card.Body>
				<div className="d-flex align-items-center">
					{orderData.product.images?.[0]?.url ? (
						<img
							src={orderData.product.images[0].url}
							alt={orderData.product.name}
							style={{ 
								width: UI_CONFIG_ORDER_SUCCES.PRODUCT_IMAGE_SIZE, 
								height: UI_CONFIG_ORDER_SUCCES.PRODUCT_IMAGE_SIZE, 
								objectFit: "cover" 
							}}
							className="rounded me-3"
						/>
					) : (
						<div
							className="bg-light rounded d-flex align-items-center justify-content-center me-3"
							style={{ 
								width: UI_CONFIG_ORDER_SUCCES.PRODUCT_IMAGE_SIZE, 
								height: UI_CONFIG_ORDER_SUCCES.PRODUCT_IMAGE_SIZE 
							}}>
							<Package size={30} className="text-muted" />
						</div>
					)}
					<div>
						<h6 className="mb-1">{orderData.product.name || "Product"}</h6>
						<p className="text-muted mb-1">
							Quantity: {orderData.quantity || 1}
						</p>
						<p className="text-muted mb-0">
							Price: ${formatPrice(getProductPrice(orderData))}
						</p>
					</div>
				</div>
			</Card.Body>
		</Card>
	)
}

export default ProductInfoCard