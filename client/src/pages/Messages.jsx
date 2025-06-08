import React, { useState, useEffect, useRef } from "react"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"

import "../App.css"

import {
	Container,
	Row,
	Col,
	Card,
	ListGroup,
	Button,
	Badge,
	Form,
	Alert,
	Spinner,
} from "react-bootstrap"
import { MessageCircle, Send, X, User, Package } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { messagesAPI } from "../api/api"

// =============================================================================
// CONSTANTS AND CONFIGURATION
// =============================================================================

const UI_CONFIG = {
	MAX_CONVERSATIONS_HEIGHT: "70vh",
	MAX_MESSAGES_HEIGHT: "50vh",
	MESSAGE_MAX_WIDTH: "70%",
	REFRESH_INTERVAL: 30000, // 30 seconds
}

const MESSAGES = {
	loading: "Loading conversations...",
	noConversations: "No conversations yet",
	noConversationsSubtext: "Start messaging sellers to see conversations here",
	selectConversation: "Select a conversation",
	selectConversationSubtext:
		"Choose a conversation from the left to start messaging",
	messagePlaceholder: "Type your message...",
	sendButton: "Send",
	sendingButton: "Sending...",
	closeButton: "✕",
	conversationsTitle: "💬 Conversations",
	failedToSend: "Failed to send message. Please try again.",
	failedToLoad: "Failed to load messages. Please try again.",
	loginRequired: "Please log in to view messages.",
}

const DATE_FORMAT_OPTIONS = {
	month: "short",
	day: "numeric",
	hour: "numeric",
	minute: "2-digit",
	hour12: true,
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const formatMessageDate = (dateString) => {
	if (!dateString) return ""

	try {
		return new Date(dateString).toLocaleDateString("en-US", DATE_FORMAT_OPTIONS)
	} catch (error) {
		console.error("Error formatting date:", error)
		return "Invalid date"
	}
}

const groupMessagesByConversation = (messages, currentUserId) => {
	if (!messages || !Array.isArray(messages)) return []

	const conversations = {}

	messages.forEach((message) => {
		try {
			const otherUser =
				message.sender._id === currentUserId ? message.recipient : message.sender

			if (!otherUser) return

			const productId = message.product?._id || "general"
			const key = `${otherUser._id}-${productId}`

			if (!conversations[key]) {
				conversations[key] = {
					id: key,
					otherUser: otherUser,
					product: message.product,
					messages: [],
					lastMessage: null,
					unreadCount: 0,
				}
			}

			conversations[key].messages.push(message)

			if (
				!conversations[key].lastMessage ||
				new Date(message.sentAt) > new Date(conversations[key].lastMessage.sentAt)
			) {
				conversations[key].lastMessage = message
			}

			if (!message.read && message.recipient._id === currentUserId) {
				conversations[key].unreadCount++
			}
		} catch (error) {
			console.error("Error processing message:", error)
		}
	})

	return Object.values(conversations).sort(
		(a, b) => new Date(b.lastMessage.sentAt) - new Date(a.lastMessage.sentAt),
	)
}

const getUserDisplayName = (user) => {
	if (!user) return "Unknown User"
	if (user.firstName && user.lastName) {
		return `${user.firstName} ${user.lastName}`
	}
	return user.name || user.email || "User"
}

// =============================================================================
// EXTRACTED COMPONENTS (moved outside to prevent recreation)
// =============================================================================

const LoadingState = () => (
	<div className="text-center p-4">
		<Spinner animation="border" size="sm" className="mb-2" />
		<div>{MESSAGES.loading}</div>
	</div>
)

const ErrorAlert = ({ error, onRetry }) => {
	if (!error) return null

	return (
		<Alert variant="danger" className="m-3">
			<i className="bi bi-exclamation-triangle-fill me-2"></i>
			{error}
			<Button
				variant="outline-danger"
				size="sm"
				className="ms-3"
				onClick={onRetry}>
				Try Again
			</Button>
		</Alert>
	)
}

const ConversationItem = ({ conversation, isSelected, onClick }) => (
	<ListGroup.Item
		action
		active={isSelected}
		onClick={onClick}
		className={
			conversation.unreadCount > 0 ? "border-start border-primary border-3" : ""
		}>
		<div className="d-flex justify-content-between align-items-start">
			<div className="flex-grow-1">
				<div className="d-flex justify-content-between align-items-center mb-1">
					<strong className="text-truncate" style={{ maxWidth: "150px" }}>
						<User size={14} className="me-1" />
						{getUserDisplayName(conversation.otherUser)}
					</strong>
					<small className="text-muted">
						{formatMessageDate(conversation.lastMessage.sentAt)}
					</small>
				</div>

				{conversation.product && (
					<div className="mb-1">
						<Badge
							bg="secondary"
							className="small d-flex align-items-center"
							style={{ width: "fit-content" }}>
							<Package size={12} className="me-1" />
							Re: {conversation.product.name}
						</Badge>
					</div>
				)}

				<div className="text-muted small text-truncate">
					{conversation.lastMessage.content}
				</div>
			</div>

			{conversation.unreadCount > 0 && (
				<Badge bg="danger" className="ms-2">
					{conversation.unreadCount}
				</Badge>
			)}
		</div>
	</ListGroup.Item>
)

const ConversationsList = ({ 
	loading, 
	hasConversations, 
	conversations, 
	selectedConversation, 
	onConversationClick 
}) => (
	<Card className="border-0 shadow-sm h-100">
		<Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
			<h5 className="mb-0 d-flex align-items-center">
				<MessageCircle size={18} className="me-2" />
				{MESSAGES.conversationsTitle}
			</h5>
			<Badge bg="light" text="dark">
				{conversations.length}
			</Badge>
		</Card.Header>

		<Card.Body className="p-0">
			{loading ? (
				<LoadingState />
			) : !hasConversations ? (
				<div className="text-center p-4 text-muted">
					<MessageCircle size={48} className="mb-3 opacity-50" />
					<h6>{MESSAGES.noConversations}</h6>
					<p className="small">{MESSAGES.noConversationsSubtext}</p>
				</div>
			) : (
				<ListGroup
					variant="flush"
					style={{
						maxHeight: UI_CONFIG.MAX_CONVERSATIONS_HEIGHT,
						overflowY: "auto",
					}}>
					{conversations.map((conversation) => (
						<ConversationItem
							key={conversation.id}
							conversation={conversation}
							isSelected={selectedConversation?.id === conversation.id}
							onClick={() => onConversationClick(conversation)}
						/>
					))}
				</ListGroup>
			)}
		</Card.Body>
	</Card>
)

const EmptyMessageView = () => (
	<Card className="border-0 shadow-sm h-100">
		<Card.Body className="d-flex align-items-center justify-content-center">
			<div className="text-center text-muted">
				<MessageCircle size={64} className="mb-3 opacity-50" />
				<h5>{MESSAGES.selectConversation}</h5>
				<p>{MESSAGES.selectConversationSubtext}</p>
			</div>
		</Card.Body>
	</Card>
)

const MessageHeader = ({ selectedConversation, onClose }) => (
	<Card.Header className="bg-light">
		<div className="d-flex justify-content-between align-items-center">
			<div>
				<h6 className="mb-0 d-flex align-items-center">
					<User size={16} className="me-2" />
					{getUserDisplayName(selectedConversation.otherUser)}
				</h6>
				{selectedConversation.product && (
					<small className="text-muted d-flex align-items-center mt-1">
						<Package size={12} className="me-1" />
						Re: {selectedConversation.product.name}
					</small>
				)}
			</div>
			<Button
				variant="outline-secondary"
				size="sm"
				onClick={onClose}>
				<X size={16} />
			</Button>
		</div>
	</Card.Header>
)

const MessageBubble = ({ message, isOwn }) => (
	<div
		className={`mb-3 d-flex ${
			isOwn ? "justify-content-end" : "justify-content-start"
		}`}>
		<div
			className={`p-3 rounded-3 ${isOwn ? "bg-primary text-white" : "bg-light"}`}
			style={{ maxWidth: UI_CONFIG.MESSAGE_MAX_WIDTH }}>
			<div className="mb-1">{message.content}</div>
			<small className={isOwn ? "text-white-50" : "text-muted"}>
				{formatMessageDate(message.sentAt)}
			</small>
		</div>
	</div>
)

const MessageBody = ({ conversationMessages, user, messagesEndRef }) => (
	<Card.Body className="d-flex flex-column p-0">
		<div
			className="flex-grow-1 p-3"
			style={{ maxHeight: UI_CONFIG.MAX_MESSAGES_HEIGHT, overflowY: "auto" }}>
			{conversationMessages.map((message) => (
				<MessageBubble
					key={message._id}
					message={message}
					isOwn={message.sender._id === user._id}
				/>
			))}
			<div ref={messagesEndRef} />
		</div>
	</Card.Body>
)

const MessageInput = ({ 
	replyText, 
	onReplyTextChange, 
	onSendReply, 
	sendingReply 
}) => (
	<div className="border-top p-3">
		<Form onSubmit={onSendReply}>
			<div className="d-flex gap-2">
				<Form.Control
					type="text"
					placeholder={MESSAGES.messagePlaceholder}
					value={replyText}
					onChange={onReplyTextChange}
					disabled={sendingReply}
				/>
				<Button
					type="submit"
					variant="primary"
					disabled={sendingReply || !replyText.trim()}
					className="d-flex align-items-center">
					{sendingReply ? (
						<>
							<Spinner size="sm" className="me-1" />
							{MESSAGES.sendingButton}
						</>
					) : (
						<>
							<Send size={16} className="me-1" />
							{MESSAGES.sendButton}
						</>
					)}
				</Button>
			</div>
		</Form>
	</div>
)

const MessageView = ({ 
	selectedConversation, 
	conversationMessages, 
	user, 
	messagesEndRef,
	replyText,
	onReplyTextChange,
	onSendReply,
	sendingReply,
	onCloseConversation
}) => {
	if (!selectedConversation) {
		return <EmptyMessageView />
	}

	return (
		<Card className="border-0 shadow-sm h-100">
			<MessageHeader 
				selectedConversation={selectedConversation}
				onClose={onCloseConversation}
			/>
			<MessageBody 
				conversationMessages={conversationMessages}
				user={user}
				messagesEndRef={messagesEndRef}
			/>
			<MessageInput 
				replyText={replyText}
				onReplyTextChange={onReplyTextChange}
				onSendReply={onSendReply}
				sendingReply={sendingReply}
			/>
		</Card>
	)
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const Messages = () => {
	const { user } = useAuth()
	const navigate = useNavigate()
	const messagesEndRef = useRef(null)

	// State management
	const [conversations, setConversations] = useState([])
	const [selectedConversation, setSelectedConversation] = useState(null)
	const [conversationMessages, setConversationMessages] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [sendingReply, setSendingReply] = useState(false)
	const [replyText, setReplyText] = useState("")

	// Computed values
	const totalUnreadCount = conversations.reduce(
		(total, conv) => total + conv.unreadCount,
		0,
	)
	const hasConversations = conversations.length > 0

	// Effects
	useEffect(() => {
		if (!user) {
			navigate("/")
			return
		}
	}, [user, navigate])

	useEffect(() => {
		if (user) {
			fetchMessages()
		}
	}, [user])

	useEffect(() => {
		if (!user) return

		const interval = setInterval(() => {
			fetchMessages()
		}, UI_CONFIG.REFRESH_INTERVAL)

		return () => clearInterval(interval)
	}, [user])

	useEffect(() => {
		scrollToBottom()
	}, [conversationMessages])

	// Data fetching
	const fetchMessages = async () => {
		if (!user) return

		try {
			setLoading(true)
			setError("")

			const messages = await messagesAPI.getMessagesForUser()
			const grouped = groupMessagesByConversation(messages, user._id)
			setConversations(grouped)
		} catch (error) {
			console.error("Error fetching messages:", error)
			setError(MESSAGES.failedToLoad)
		} finally {
			setLoading(false)
		}
	}

	// Event handlers
	const handleConversationClick = async (conversation) => {
		setSelectedConversation(conversation)

		const sortedMessages = conversation.messages.sort(
			(a, b) => new Date(a.sentAt) - new Date(b.sentAt),
		)
		setConversationMessages(sortedMessages)

		await markMessagesAsRead(conversation)
	}

	const markMessagesAsRead = async (conversation) => {
		const unreadMessages = conversation.messages.filter(
			(msg) => !msg.read && msg.recipient._id === user._id,
		)

		for (const msg of unreadMessages) {
			try {
				await messagesAPI.markAsRead(msg._id)
			} catch (error) {
				console.error("Error marking message as read:", error)
			}
		}

		setConversations((prev) =>
			prev.map((conv) =>
				conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv,
			),
		)
	}

	const handleSendReply = async (e) => {
		e.preventDefault()

		if (!replyText.trim() || !selectedConversation) return

		setSendingReply(true)

		try {
			const messageData = {
				recipient: selectedConversation.otherUser._id,
				product: selectedConversation.product?._id,
				content: replyText.trim(),
			}

			const newMessage = await messagesAPI.sendMessage(messageData)

			setConversationMessages((prev) => [...prev, newMessage])
			setReplyText("")

			fetchMessages()
		} catch (error) {
			console.error("Error sending reply:", error)
			setError(MESSAGES.failedToSend)
		} finally {
			setSendingReply(false)
		}
	}

	const handleCloseConversation = () => {
		setSelectedConversation(null)
		setConversationMessages([])
	}

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}

	const handleRetry = () => {
		setError("")
		fetchMessages()
	}

	const handleReplyTextChange = (e) => {
		setReplyText(e.target.value)
	}

	// Main render
	if (!user) {
		return (
			<Container className="text-center mt-5">
				<User size={48} className="text-muted mb-3" />
				<div>{MESSAGES.loginRequired}</div>
			</Container>
		)
	}

	return (
		<Container fluid className="py-4">
			<ErrorAlert error={error} onRetry={handleRetry} />

			<Row>
				<Col lg={4} className="mb-4">
					<ConversationsList 
						loading={loading}
						hasConversations={hasConversations}
						conversations={conversations}
						selectedConversation={selectedConversation}
						onConversationClick={handleConversationClick}
					/>
				</Col>

				<Col lg={8}>
					<MessageView 
						selectedConversation={selectedConversation}
						conversationMessages={conversationMessages}
						user={user}
						messagesEndRef={messagesEndRef}
						replyText={replyText}
						onReplyTextChange={handleReplyTextChange}
						onSendReply={handleSendReply}
						sendingReply={sendingReply}
						onCloseConversation={handleCloseConversation}
					/>
				</Col>
			</Row>
		</Container>
	)
}

export default Messages