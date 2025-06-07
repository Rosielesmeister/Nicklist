import React from "react"
import { formatPrice } from "../../utils/productDetailsHelpers"

const ProductBasicInfo = ({ product }) => {
	return (
		<div className="mb-3">
			<h4 className="mb-2">{product?.name || "Product name not available"}</h4>
			<h3 className="text-primary mb-3">${formatPrice(product?.price)}</h3>
		</div>
	)
}

export default ProductBasicInfo