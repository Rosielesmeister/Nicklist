// ProductDetailsModal/components/ModalFooter.jsx
import React from "react"
import { Modal, Button } from "react-bootstrap"
import { Mail } from "lucide-react"

const ModalFooter = ({ product, onClose, onContactSeller }) => {
	return (
		<Modal.Footer className="border-0 pt-0">
			<div className="d-flex gap-2 w-100">
				<Button variant="secondary" onClick={onClose} className="flex-shrink-0">
					Close
				</Button>
				<Button
					variant="primary"
					onClick={onContactSeller}
					className="flex-grow-1"
					disabled={!product?.isActive || !product?.contactEmail}>
					{product?.isActive ? (
						<>
							<Mail size={16} className="me-2" />
							Contact Seller
						</>
					) : (
						"Item Sold"
					)}
				</Button>
			</div>
		</Modal.Footer>
	)
}

export default ModalFooter