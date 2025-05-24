import React, { useEffect, useState } from "react";
import { messagesAPI } from "../api/api";

export default function MessageList({ productId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    messagesAPI
      .getMessagesForProduct(productId)
      .then((res) => setMessages(res.data));
  }, [productId]);

  return (
    <div>
      <h4>Messages</h4>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul>
          {messages.map((msg) => (
            <li key={msg._id}>
              <strong>{msg.sender.firstName}:</strong> {msg.content}{" "}
              <em>({new Date(msg.sentAt).toLocaleString()})</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
