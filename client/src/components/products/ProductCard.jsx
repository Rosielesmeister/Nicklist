import React, { useState } from "react"
import { Card, Button, Badge, Modal, Form, Alert, Spinner } from "react-bootstrap"
import { MessageCircle, ShoppingBag } from "lucide-react"
import FavoriteButton from "../common/FavoriteButton"
import BuyNowModal from "./BuyNowModal/BuyNowModal"
import { useAuth } from "../../hooks/useAuth"
import { messagesAPI } from "../../api/api"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"

// =============================================================================
// CONSTANTS
// =============================================================================

const UI_CONFIG = {
	DESCRIPTION_MAX_LENGTH: 80,
	IMAGE_HEIGHT: "200px",
	DEFAULT_MESSAGE_TEMPLATE: (productName) =>
		`Hi! I'm interested in your listing "${productName}". Is it still available?`,
}

// Placeholder image as base64 (moved to constant for reusability)
const PLACEHOLDER_IMAGE =
	"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMGYwZjAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlMGUwZTAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNhKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4="

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const ProductCard = ({
	product,
	onViewDetails,
	showActions = false,
	onEdit,
	onDelete,
}) => {
	const { user } = useAuth()

	// =============================================================================
	// STATE MANAGEMENT
	// =============================================================================

	const [showMessageModal, setShowMessageModal] = useState(false)
	const [showBuyModal, setShowBuyModal] = useState(false)
	const [messageText, setMessageText] = useState("")
	const [sendingMessage, setSendingMessage] = useState(false)
	const [messageError, setMessageError] = useState("")

	// =============================================================================
	// COMPUTED VALUES
	// =============================================================================

	// Check user relationship to product
	const getUserRelationship = () => {
		if (!user) return { isLoggedIn: false, isOwner: false }

		const isOwner = product.user === user._id || product.user?._id === user._id
		return { isLoggedIn: true, isOwner }
	}

	const { isLoggedIn, isOwner } = getUserRelationship()
	const isAvailableForPurchase = product.isActive && !isOwner

	// Get truncated description
	const getTruncatedDescription = () => {
		if (!product.description) return ""

		return product.description.length > UI_CONFIG.DESCRIPTION_MAX_LENGTH
			? `${product.description.substring(0, UI_CONFIG.DESCRIPTION_MAX_LENGTH)}...`
			: product.description
	}

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================

	// Handle view details
	const handleViewDetails = (e) => {
		if (e) e.stopPropagation()
		if (onViewDetails) {
			onViewDetails(product)
		}
	}

	// Handle edit product
	const handleEdit = (e) => {
		if (e) e.stopPropagation()
		if (onEdit) {
			onEdit(product)
		}
	}

	// Handle delete product
	const handleDelete = (e) => {
		if (e) e.stopPropagation()
		if (onDelete) {
			onDelete(product._id)
		}
	}

	// Handle message seller
	const handleMessageSeller = (e) => {
		e.stopPropagation()

		if (!isLoggedIn) {
			alert("Please log in to message sellers")
			return
		}

		if (isOwner) {
			alert("You cannot message yourself")
			return
		}

		setShowMessageModal(true)
		setMessageText(UI_CONFIG.DEFAULT_MESSAGE_TEMPLATE(product.name))
		setMessageError("") // Clear any previous errors
	}

	// Handle buy now
	const handleBuyNow = (e) => {
		e.stopPropagation()

		if (!isLoggedIn) {
			alert("Please log in to purchase items")
			return
		}

		if (isOwner) {
			alert("You cannot purchase your own product")
			return
		}

		if (!product.isActive) {
			alert("This item is no longer available")
			return
		}

		setShowBuyModal(true)
	}

	// Handle successful order
	const handleOrderComplete = (order) => {
		console.log("Order completed:", order)
		setShowBuyModal(false)
		// Could refresh product list or show success message here
		// Could also mark product as sold if it's a one-time item
	}

	// =============================================================================
	// MESSAGE HANDLING
	// =============================================================================

	// Get recipient ID from product data
	const getRecipientId = () => {
		if (typeof product.user === "object" && product.user._id) {
			return product.user._id
		} else if (typeof product.user === "string") {
			return product.user
		} else if (product.userId) {
			return product.userId
		} else {
			throw new Error("Cannot determine product owner")
		}
	}

	// Handle send message
	const handleSendMessage = async (e) => {
		e.preventDefault()

		if (!messageText.trim()) {
			setMessageError("Please enter a message")
			return
		}

		setSendingMessage(true)
		setMessageError("")

		try {
			const recipientId = getRecipientId()

			console.log("Sending message to recipient:", recipientId)

			// Use centralized API instead of duplicate code
			await messagesAPI.sendMessage({
				recipient: recipientId,
				product: product._id,
				content: messageText.trim(),
			})

			// Close modal and reset form
			setShowMessageModal(false)
			setMessageText("")

			// Show success message (could be improved with toast notifications)
			alert("Message sent successfully!")
		} catch (error) {
			console.error("Error sending message:", error)
			setMessageError("Failed to send message. Please try again.")
		} finally {
			setSendingMessage(false)
		}
	}

	// Handle message modal close
	const handleCloseMessageModal = () => {
		setShowMessageModal(false)
		setMessageText("")
		setMessageError("")
	}

	// =============================================================================
	// UI COMPONENTS
	// =============================================================================

	// Product image component
	const ProductImage = () => {
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

	// Product info section
	const ProductInfo = () => (
		<div
			onClick={handleViewDetails}
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
				{getTruncatedDescription()}
			</Card.Text>

			{/* Location */}
			<div className="text-muted small mb-2">
				📍 {product.city}, {product.state}
			</div>
		</div>
	)

	// Owner action buttons
	const OwnerActions = () => (
		<div className="d-flex gap-2">
			<Button
				variant="primary"
				size="sm"
				className="flex-grow-1"
				onClick={handleViewDetails}>
				View Details
			</Button>
			{showActions && (
				<>
					<Button variant="outline-secondary" size="sm" onClick={handleEdit}>
						Edit
					</Button>
					<Button variant="outline-danger" size="sm" onClick={handleDelete}>
						Delete
					</Button>
				</>
			)}
		</div>
	)

	// Buyer action buttons
	const BuyerActions = () => (
		<div className="d-grid gap-2">
			{/* Primary buy button */}
			<Button
				variant="success"
				size="sm"
				onClick={handleBuyNow}
				disabled={!isAvailableForPurchase}
				className="d-flex align-items-center justify-content-center">
				<ShoppingBag size={16} className="me-2" />
				{!product.isActive ? "Sold Out" : "Buy Now"}
			</Button>

			{/* Secondary actions */}
			<div className="d-flex gap-2">
				<Button
					variant="outline-primary"
					size="sm"
					className="flex-grow-1"
					onClick={handleViewDetails}>
					View Details
				</Button>

				{isLoggedIn && (
					<Button
						variant="outline-info"
						size="sm"
						onClick={handleMessageSeller}
						title="Message Seller">
						<MessageCircle size={16} />
					</Button>
				)}
			</div>
		</div>
	)

	// Action buttons section
	const ActionButtons = () => (
		<div className="mt-auto pt-2">
			{isOwner ? <OwnerActions /> : <BuyerActions />}

			{/* Status message for unavailable items */}
			{!product.isActive && (
				<div className="text-center mt-2">
					<small className="text-muted">This item is no longer available</small>
				</div>
			)}
		</div>
	)

	// Message modal component
	const MessageModal = () => (
		<Modal show={showMessageModal} onHide={handleCloseMessageModal} centered>
			<Modal.Header closeButton>
				<Modal.Title>Message Seller</Modal.Title>
			</Modal.Header>

			<Form onSubmit={handleSendMessage}>
				<Modal.Body>
					{messageError && (
						<Alert variant="danger" className="mb-3">
							<i className="bi bi-exclamation-triangle-fill me-2"></i>
							{messageError}
						</Alert>
					)}

					<div className="mb-3">
						<strong>Item:</strong> {product.name}
					</div>

					<Form.Group>
						<Form.Label>Your Message</Form.Label>
						<Form.Control
							as="textarea"
							rows={4}
							value={messageText}
							onChange={(e) => setMessageText(e.target.value)}
							placeholder="Type your message to the seller..."
							required
							disabled={sendingMessage}
						/>
					</Form.Group>
				</Modal.Body>

				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={handleCloseMessageModal}
						disabled={sendingMessage}>
						Cancel
					</Button>
					<Button
						variant="primary"
						type="submit"
						disabled={sendingMessage || !messageText.trim()}>
						{sendingMessage ? (
							<>
								<Spinner size="sm" className="me-2" />
								Sending...
							</>
						) : (
							"Send Message"
						)}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	)

	// =============================================================================
	// MAIN RENDER
	// =============================================================================

	return (
		<>
			<Card className="h-100 border-0 shadow-sm product-card">
				<ProductImage />

				<Card.Body className="d-flex flex-column">
					<ProductInfo />
					<ActionButtons />
				</Card.Body>
			</Card>

			<MessageModal />

			<BuyNowModal
				show={showBuyModal}
				onHide={() => setShowBuyModal(false)}
				product={product}
				onOrderComplete={handleOrderComplete}
			/>
		</>
	)
}

export default ProductCard
