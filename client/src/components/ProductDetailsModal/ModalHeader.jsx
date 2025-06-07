import React from "react"
import { Modal, Badge } from "react-bootstrap"
import FavoriteButton from "../common/FavoriteButton"

const ModalHeader = ({ product }) => {
	return (
		<Modal.Header closeButton className="border-0 pb-0">
			<div className="d-flex justify-content-between align-items-center w-100 me-3">
				<Badge bg={product?.isActive ? "success" : "secondary"}>
					{product?.isActive ? "Available" : "Sold"}
				</Badge>
				<FavoriteButton productId={product?._id} size="sm" />
			</div>
		</Modal.Header>
	)
}

export default ModalHeader