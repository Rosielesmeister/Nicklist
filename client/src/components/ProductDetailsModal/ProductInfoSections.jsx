import React from "react"
import { MapPin, Calendar, Mail } from "lucide-react"
import { formatDate } from "../../utils/productDetailsHelpers"

// Location information
export const LocationInfo = ({ product }) => (
	<div className="mb-3">
		<div className="d-flex align-items-center">
			<MapPin size={16} className="me-2 text-muted" />
			<strong>Location:</strong>
		</div>
		<div className="text-muted ms-4">
			{product?.city && product?.state
				? `${product.city}, ${product.state}`
				: "Location not specified"}
		</div>
	</div>
)

// Product description
export const ProductDescription = ({ product }) => (
	<div className="mb-3">
		<strong>Description:</strong>
		<p className="mt-2 text-muted">
			{product?.description || "No description available"}
		</p>
	</div>
)

// Posted date information
export const PostedDate = ({ product }) => (
	<div className="mb-3">
		<div className="d-flex align-items-center">
			<Calendar size={16} className="me-2 text-muted" />
			<strong>Posted:</strong>
		</div>
		<div className="text-muted ms-4">{formatDate(product?.createdAt)}</div>
	</div>
)

// Contact information
export const ContactInfo = ({ product }) => (
	<div className="mb-3">
		<div className="d-flex align-items-center">
			<Mail size={16} className="me-2 text-muted" />
			<strong>Contact:</strong>
		</div>
		<div className="text-muted ms-4">
			{product?.contactEmail || "Contact not available"}
		</div>
	</div>
)