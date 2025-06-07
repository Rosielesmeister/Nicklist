// ProductCard/components/MessageModal.jsx
import React from "react"
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"

const MessageModal = ({
	show,
	onHide,
	product,
	messageText,
	messageError,
	sendingMessage,
	onMessageTextChange,
	onSendMessage
}) => {
	return (
		<Modal show={show} onHide={onHide} centered>
			<Modal.Header closeButton>
				<Modal.Title>Message Seller</Modal.Title>
			</Modal.Header>

			<Form onSubmit={onSendMessage}>
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
							onChange={(e) => onMessageTextChange(e.target.value)}
							placeholder="Type your message to the seller..."
							required
							disabled={sendingMessage}
						/>
					</Form.Group>
				</Modal.Body>

				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={onHide}
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
}

export default MessageModal