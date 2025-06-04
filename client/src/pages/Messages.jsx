import React, { useState, useEffect, useRef } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../App.css";

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
} from "react-bootstrap";
import { MessageCircle, Send, X, User, Package } from "lucide-react";
import { useAuth } from "../hooks/UseAuth";
import { useNavigate } from "react-router-dom";
import { messagesAPI } from "../api/api"; // Adjust path based on your folder structure

// =============================================================================
// CONSTANTS AND CONFIGURATION
// =============================================================================

const UI_CONFIG = {
  MAX_CONVERSATIONS_HEIGHT: "70vh",
  MAX_MESSAGES_HEIGHT: "50vh",
  MESSAGE_MAX_WIDTH: "70%",
  REFRESH_INTERVAL: 30000, // 30 seconds
};

const MESSAGES = {
  loading: "Loading conversations...",
  noConversations: "No conversations yet",
  noConversationsSubtext: "Start messaging sellers to see conversations here",
  selectConversation: "Select a conversation",
  selectConversationSubtext: "Choose a conversation from the left to start messaging",
  messagePlaceholder: "Type your message...",
  sendButton: "Send",
  sendingButton: "Sending...",
  closeButton: "✕",
  conversationsTitle: "💬 Conversations",
  failedToSend: "Failed to send message. Please try again.",
  failedToLoad: "Failed to load messages. Please try again.",
  loginRequired: "Please log in to view messages.",
};

const DATE_FORMAT_OPTIONS = {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Format date for display in messages
const formatMessageDate = (dateString) => {
  if (!dateString) return "";
  
  try {
    return new Date(dateString).toLocaleDateString("en-US", DATE_FORMAT_OPTIONS);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Group messages by conversation (product + participants)
const groupMessagesByConversation = (messages, currentUserId) => {
  if (!messages || !Array.isArray(messages)) return [];
  
  const conversations = {};

  messages.forEach((message) => {
    try {
      // Determine the other user in the conversation
      const otherUser = message.sender._id === currentUserId 
        ? message.recipient 
        : message.sender;
      
      if (!otherUser) return; // Skip if no other user found
      
      const productId = message.product?._id || "general";
      const key = `${otherUser._id}-${productId}`;

      if (!conversations[key]) {
        conversations[key] = {
          id: key,
          otherUser: otherUser,
          product: message.product,
          messages: [],
          lastMessage: null,
          unreadCount: 0,
        };
      }

      conversations[key].messages.push(message);

      // Update last message if this one is more recent
      if (
        !conversations[key].lastMessage ||
        new Date(message.sentAt) > new Date(conversations[key].lastMessage.sentAt)
      ) {
        conversations[key].lastMessage = message;
      }

      // Count unread messages for current user
      if (!message.read && message.recipient._id === currentUserId) {
        conversations[key].unreadCount++;
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  // Sort by last message date (most recent first)
  return Object.values(conversations).sort(
    (a, b) => new Date(b.lastMessage.sentAt) - new Date(a.lastMessage.sentAt)
  );
};

// Get user display name safely
const getUserDisplayName = (user) => {
  if (!user) return "Unknown User";
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.name || user.email || "User";
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  
  // Data state
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  
  // Form state
  const [replyText, setReplyText] = useState("");

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  // Get total unread count across all conversations
  const totalUnreadCount = conversations.reduce(
    (total, conv) => total + conv.unreadCount, 
    0
  );

  // Check if current user has any conversations
  const hasConversations = conversations.length > 0;

  // =============================================================================
  // EFFECTS
  // =============================================================================

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  // Fetch messages on component mount
  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  // Set up periodic refresh for new messages
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchMessages();
    }, UI_CONFIG.REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  // =============================================================================
  // DATA FETCHING
  // =============================================================================

  // Fetch all messages for current user
  const fetchMessages = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError("");
      
      const messages = await messagesAPI.getMessagesForUser();
      const grouped = groupMessagesByConversation(messages, user._id);
      setConversations(grouped);
      
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError(MESSAGES.failedToLoad);
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  // Handle conversation selection
  const handleConversationClick = async (conversation) => {
    setSelectedConversation(conversation);
    
    // Sort messages chronologically
    const sortedMessages = conversation.messages.sort(
      (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
    );
    setConversationMessages(sortedMessages);

    // Mark unread messages as read
    await markMessagesAsRead(conversation);
  };

  // Mark messages as read
  const markMessagesAsRead = async (conversation) => {
    const unreadMessages = conversation.messages.filter(
      (msg) => !msg.read && msg.recipient._id === user._id
    );

    // Mark each unread message as read
    for (const msg of unreadMessages) {
      try {
        await messagesAPI.markAsRead(msg._id);
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }

    // Update local state to reflect read status
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  // Handle sending a reply
  const handleSendReply = async (e) => {
    e.preventDefault();

    if (!replyText.trim() || !selectedConversation) return;

    setSendingReply(true);
    
    try {
      const messageData = {
        recipient: selectedConversation.otherUser._id,
        product: selectedConversation.product?._id,
        content: replyText.trim(),
      };

      const newMessage = await messagesAPI.sendMessage(messageData);

      // Add to current conversation messages
      setConversationMessages(prev => [...prev, newMessage]);
      setReplyText("");

      // Refresh conversations to update last message
      fetchMessages();
      
    } catch (error) {
      console.error("Error sending reply:", error);
      setError(MESSAGES.failedToSend);
    } finally {
      setSendingReply(false);
    }
  };

  // Handle closing selected conversation
  const handleCloseConversation = () => {
    setSelectedConversation(null);
    setConversationMessages([]);
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle retry after error
  const handleRetry = () => {
    setError("");
    fetchMessages();
  };

  // =============================================================================
  // UI COMPONENTS
  // =============================================================================

  // Loading state component
  const LoadingState = () => (
    <div className="text-center p-4">
      <Spinner animation="border" size="sm" className="mb-2" />
      <div>{MESSAGES.loading}</div>
    </div>
  );

  // Error alert component
  const ErrorAlert = () => {
    if (!error) return null;
    
    return (
      <Alert variant="danger" className="m-3">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
        <Button 
          variant="outline-danger" 
          size="sm" 
          className="ms-3"
          onClick={handleRetry}
        >
          Try Again
        </Button>
      </Alert>
    );
  };

  // Conversations list component
  const ConversationsList = () => (
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
            style={{ maxHeight: UI_CONFIG.MAX_CONVERSATIONS_HEIGHT, overflowY: "auto" }}
          >
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversation?.id === conversation.id}
                onClick={() => handleConversationClick(conversation)}
              />
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );

  // Individual conversation item component
  const ConversationItem = ({ conversation, isSelected, onClick }) => (
    <ListGroup.Item
      action
      active={isSelected}
      onClick={onClick}
      className={
        conversation.unreadCount > 0
          ? "border-start border-primary border-3"
          : ""
      }
    >
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
              <Badge bg="secondary" className="small d-flex align-items-center" style={{ width: "fit-content" }}>
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
  );

  // Message view component
  const MessageView = () => {
    if (!selectedConversation) {
      return <EmptyMessageView />;
    }

    return (
      <Card className="border-0 shadow-sm h-100">
        <MessageHeader />
        <MessageBody />
        <MessageInput />
      </Card>
    );
  };

  // Empty message view component
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
  );

  // Message header component
  const MessageHeader = () => (
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
          onClick={handleCloseConversation}
        >
          <X size={16} />
        </Button>
      </div>
    </Card.Header>
  );

  // Message body component
  const MessageBody = () => (
    <Card.Body className="d-flex flex-column p-0">
      <div
        className="flex-grow-1 p-3"
        style={{ maxHeight: UI_CONFIG.MAX_MESSAGES_HEIGHT, overflowY: "auto" }}
      >
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
  );

  // Individual message bubble component
  const MessageBubble = ({ message, isOwn }) => (
    <div className={`mb-3 d-flex ${isOwn ? "justify-content-end" : "justify-content-start"}`}>
      <div
        className={`p-3 rounded-3 ${
          isOwn ? "bg-primary text-white" : "bg-light"
        }`}
        style={{ maxWidth: UI_CONFIG.MESSAGE_MAX_WIDTH }}
      >
        <div className="mb-1">{message.content}</div>
        <small className={isOwn ? "text-white-50" : "text-muted"}>
          {formatMessageDate(message.sentAt)}
        </small>
      </div>
    </div>
  );

  // Message input component
  const MessageInput = () => (
    <div className="border-top p-3">
      <Form onSubmit={handleSendReply}>
        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder={MESSAGES.messagePlaceholder}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            disabled={sendingReply}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={sendingReply || !replyText.trim()}
            className="d-flex align-items-center"
          >
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
  );

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  // Redirect if not logged in
  if (!user) {
    return (
      <Container className="text-center mt-5">
        <User size={48} className="text-muted mb-3" />
        <div>{MESSAGES.loginRequired}</div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <ErrorAlert />
      
      <Row>
        {/* Conversations List */}
        <Col lg={4} className="mb-4">
          <ConversationsList />
        </Col>

        {/* Message View */}
        <Col lg={8}>
          <MessageView />
        </Col>
      </Row>
    </Container>
  );
};

export default Messages;