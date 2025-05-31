import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Badge,
  Form,
} from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { messagesAPI } from "../api/api";

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch messages on component mount
  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const messages = await messagesAPI.getMessagesForUser();

      // Group messages by product and participants
      const grouped = groupMessagesByConversation(messages);
      setConversations(grouped);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupMessagesByConversation = (messages) => {
    const conversations = {};

    messages.forEach((message) => {
      // Create a unique key for each conversation
      const otherUser =
        message.sender._id === user._id ? message.recipient : message.sender;
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

      // Track last message and unread count
      if (
        !conversations[key].lastMessage ||
        new Date(message.sentAt) >
          new Date(conversations[key].lastMessage.sentAt)
      ) {
        conversations[key].lastMessage = message;
      }

      if (!message.read && message.recipient._id === user._id) {
        conversations[key].unreadCount++;
      }
    });

    // Sort by last message date
    return Object.values(conversations).sort(
      (a, b) => new Date(b.lastMessage.sentAt) - new Date(a.lastMessage.sentAt)
    );
  };

  const handleConversationClick = async (conversation) => {
    setSelectedConversation(conversation);
    setConversationMessages(
      conversation.messages.sort(
        (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
      )
    );

    // Mark messages as read
    const unreadMessages = conversation.messages.filter(
      (msg) => !msg.read && msg.recipient._id === user._id
    );

    for (const msg of unreadMessages) {
      try {
        await messagesAPI.markAsRead(msg._id);
      } catch (error) {
        console.error("Error marking message as read:", error.message);
      }
    }

    // Update conversation unread count
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

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

      // Add to conversation messages
      setConversationMessages((prev) => [...prev, newMessage]);
      setReplyText("");

      // Update conversations list
      fetchMessages();
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send message");
    } finally {
      setSendingReply(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (!user) return null;

  return (
    <Container fluid className="py-4">
      <Row>
        {/* Conversations List */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">💬 Conversations</h5>
              <Badge bg="light" text="dark">
                {conversations.length}
              </Badge>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center p-4">Loading conversations...</div>
              ) : conversations.length === 0 ? (
                <div className="text-center p-4 text-muted">
                  <h6>No conversations yet</h6>
                  <p className="small">
                    Start messaging sellers to see conversations here
                  </p>
                </div>
              ) : (
                <ListGroup
                  variant="flush"
                  style={{ maxHeight: "70vh", overflowY: "auto" }}
                >
                  {conversations.map((conversation) => (
                    <ListGroup.Item
                      key={conversation.id}
                      action
                      active={selectedConversation?.id === conversation.id}
                      onClick={() => handleConversationClick(conversation)}
                      className={
                        conversation.unreadCount > 0
                          ? "border-start border-primary border-3"
                          : ""
                      }
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <strong
                              className="text-truncate"
                              style={{ maxWidth: "150px" }}
                            >
                              {conversation.otherUser.firstName}{" "}
                              {conversation.otherUser.lastName}
                            </strong>
                            <small className="text-muted">
                              {formatDate(conversation.lastMessage.sentAt)}
                            </small>
                          </div>
                          {conversation.product && (
                            <div className="mb-1">
                              <Badge bg="secondary" className="small">
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
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Message View */}
        <Col lg={8}>
          {selectedConversation ? (
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">
                      {selectedConversation.otherUser.firstName}{" "}
                      {selectedConversation.otherUser.lastName}
                    </h6>
                    {selectedConversation.product && (
                      <small className="text-muted">
                        Re: {selectedConversation.product.name}
                      </small>
                    )}
                  </div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setSelectedConversation(null)}
                  >
                    ✕
                  </Button>
                </div>
              </Card.Header>

              <Card.Body className="d-flex flex-column p-0">
                {/* Messages */}
                <div
                  className="flex-grow-1 p-3"
                  style={{ maxHeight: "50vh", overflowY: "auto" }}
                >
                  {conversationMessages.map((message, index) => (
                    <div
                      key={message._id}
                      className={`mb-3 d-flex ${
                        message.sender._id === user._id
                          ? "justify-content-end"
                          : "justify-content-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-3 ${
                          message.sender._id === user._id
                            ? "bg-primary text-white"
                            : "bg-light"
                        }`}
                        style={{ maxWidth: "70%" }}
                      >
                        <div className="mb-1">{message.content}</div>
                        <small
                          className={
                            message.sender._id === user._id
                              ? "text-white-50"
                              : "text-muted"
                          }
                        >
                          {formatDate(message.sentAt)}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <div className="border-top p-3">
                  <Form onSubmit={handleSendReply}>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        placeholder="Type your message..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        disabled={sendingReply}
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={sendingReply || !replyText.trim()}
                      >
                        {sendingReply ? "..." : "Send"}
                      </Button>
                    </div>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center justify-content-center">
                <div className="text-center text-muted">
                  <div style={{ fontSize: "4rem" }}>💬</div>
                  <h5>Select a conversation</h5>
                  <p>Choose a conversation from the left to start messaging</p>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Messages;
