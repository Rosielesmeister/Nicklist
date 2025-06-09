import { useState } from "react"
import { messagesAPI } from "../api/api"
import { UI_CONFIG } from "../components/common/Constant"
import { getRecipientId } from "../utils/productHelpers"

export const useProductMessages = () => {
	const [showMessageModal, setShowMessageModal] = useState(false)
	const [messageText, setMessageText] = useState("")
	const [sendingMessage, setSendingMessage] = useState(false)
	const [messageError, setMessageError] = useState("")

	// Open message modal
	const openMessageModal = (product) => {
		setShowMessageModal(true)
		setMessageText(UI_CONFIG.DEFAULT_MESSAGE_TEMPLATE(product.name))
		setMessageError("")
	}

	// Close message modal
	const closeMessageModal = () => {
		setShowMessageModal(false)
		setMessageText("")
		setMessageError("")
	}

	// Handle send message
	const sendMessage = async (product) => {
		if (!messageText.trim()) {
			setMessageError("Please enter a message")
			return false
		}

		setSendingMessage(true)
		setMessageError("")

		try {
			const recipientId = getRecipientId(product)

			console.log("Sending message to recipient:", recipientId)

			// Use centralized API instead of duplicate code
			await messagesAPI.sendMessage({
				recipient: recipientId,
				product: product._id,
				content: messageText.trim(),
			})

			// Close modal and reset form
			closeMessageModal()

			// Show success message 
			alert("Message sent successfully!")
			return true
		} catch (error) {
			console.error("Error sending message:", error)
			setMessageError("Failed to send message. Please try again.")
			return false
		} finally {
			setSendingMessage(false)
		}
	}

	// Handle message text change
	const handleMessageTextChange = (text) => {
		setMessageText(text)
	}

	return {
		showMessageModal,
		messageText,
		sendingMessage,
		messageError,
		openMessageModal,
		closeMessageModal,
		sendMessage,
		handleMessageTextChange
	}
}