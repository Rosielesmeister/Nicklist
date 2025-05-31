// components/ProductCard.jsx - Updated with messaging feature
import React, { useState } from "react"
import { Card, Button, Badge, Modal, Form, Alert } from "react-bootstrap"
import FavoriteButton from "./FavoriteButton"
import { useAuth } from "../hooks/useAuth"
import { messagesAPI } from "../api/api"

const ProductCard = ({ product, onViewDetails, showActions, onEdit, onDelete }) => {
	const { user } = useAuth()
	const [showMessageModal, setShowMessageModal] = useState(false)
	const [messageText, setMessageText] = useState("")
	const [sendingMessage, setSendingMessage] = useState(false)
	const [messageError, setMessageError] = useState("")

	const handleMessageSeller = (e) => {
		e.stopPropagation()
		if (!user) {
			alert("Please log in to message sellers")
			return
		}
		if (product.user === user._id) {
			alert("You cannot message yourself")
			return
		}
		setShowMessageModal(true)
		setMessageText(
			`Hi! I'm interested in your listing "${product.name}". Is it still available?`,
		)
	}

	const handleSendMessage = async (e) => {
		e.preventDefault()

		if (!messageText.trim()) {
			setMessageError("Please enter a message")
			return
		}

		// ADD DEBUG LOGGING
		console.log("Product data:", product)
		console.log("Product.user:", product.user)
		console.log("Type of product.user:", typeof product.user)

		setSendingMessage(true)
		setMessageError("")

		try {
			// IMPROVED RECIPIENT HANDLING
			let recipientId

			if (typeof product.user === "object" && product.user._id) {
				recipientId = product.user._id
			} else if (typeof product.user === "string") {
				recipientId = product.user
			} else if (product.userId) {
				recipientId = product.userId
			} else {
				throw new Error("Cannot determine product owner")
			}

			console.log("Sending message to recipient:", recipientId)

			await messagesAPI.sendMessage({
				recipient: recipientId, // Send just the ID string
				product: product._id,
				content: messageText.trim(),
			})

			setShowMessageModal(false)
			setMessageText("")
			alert("Message sent successfully!")
		} catch (error) {
			console.error("Error sending message:", error)
			setMessageError("Failed to send message. Please try again.")
		} finally {
			setSendingMessage(false)
		}
	}

	const handleViewDetails = () => {
		if (onViewDetails) {
			onViewDetails(product)
		}
	}

	const handleEdit = () => {
		if (onEdit) {
			onEdit(product)
		}
	}

	const handleDelete = () => {
		if (onDelete) {
			onDelete(product._id)
		}
	}

	const placeholderImage =
		"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMGYwZjAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlMGUwZTAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNhKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4="

	return (
		<>
			<Card
				className="h-100 border-0 shadow-sm product-card"
				style={{ cursor: "pointer" }}>
				{/* Image Section */}
				<div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
					{product.images && product.images.length > 0 ? (
						<img
							src={product.images[0].url}
							alt={product.name}
							style={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
							}}
							onError={(e) => {
								e.target.src = placeholderImage
							}}
							className="card-img-top"
						/>
					) : (
						<img
							src={placeholderImage}
							alt="No image available"
							style={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
							}}
							className="card-img-top"
						/>
					)}

					{/* Favorite Button Overlay */}
					<div style={{ position: "absolute", top: "10px", right: "10px" }}>
						<FavoriteButton productId={product._id} size="sm" />
					</div>

					{/* Status Badge */}
					<div style={{ position: "absolute", top: "10px", left: "10px" }}>
						<Badge bg={product.isActive ? "success" : "secondary"}>
							{product.isActive ? "Available" : "Sold"}
						</Badge>
					</div>
				</div>

				<Card.Body className="d-flex flex-column">
					<div onClick={handleViewDetails} className="flex-grow-1">
						{/* Title and Price */}
						<div className="d-flex justify-content-between align-items-start mb-2">
							<Card.Title
								className="h6 mb-0 text-truncate"
								style={{ maxWidth: "70%" }}>
								{product.name}
							</Card.Title>
							<strong className="text-primary fs-5">
								${product.price?.toLocaleString()}
							</strong>
						</div>

						{/* Category */}
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
							{product.description?.length > 80
								? `${product.description.substring(0, 80)}...`
								: product.description}
						</Card.Text>

						{/* Location */}
						<div className="text-muted small mb-2">
							📍 {product.city}, {product.state}
						</div>
					</div>

					{/* Action Buttons */}
					<div className="mt-auto pt-2">
						<div className="d-flex gap-2">
							<Button
								variant="primary"
								size="sm"
								className="flex-grow-1"
								onClick={handleViewDetails}>
								View Details
							</Button>

							{/* Message Seller Button */}
							{user && product.user !== user._id && (
								<Button
									variant="outline-success"
									size="sm"
									onClick={handleMessageSeller}
									title="Message Seller">
									💬
								</Button>
							)}

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
					</div>
				</Card.Body>
			</Card>

			{/* Message Modal */}
			<Modal
				show={showMessageModal}
				onHide={() => setShowMessageModal(false)}
				centered>
				<Modal.Header closeButton>
					<Modal.Title>Message Seller</Modal.Title>
				</Modal.Header>
				<Form onSubmit={handleSendMessage}>
					<Modal.Body>
						{messageError && <Alert variant="danger">{messageError}</Alert>}

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
							onClick={() => setShowMessageModal(false)}
							disabled={sendingMessage}>
							Cancel
						</Button>
						<Button
							variant="primary"
							type="submit"
							disabled={sendingMessage || !messageText.trim()}>
							{sendingMessage ? "Sending..." : "Send Message"}
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	)
}

export default ProductCard
