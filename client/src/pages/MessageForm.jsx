import React, { useState } from "react";
import { messagesAPI } from "../api/api";

// MessageForm allows a user to send a message to a listing owner
export default function MessageForm({ recipientId, productId, onSent }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  // Handles sending the message via the API
  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await messagesAPI.sendMessage({
        recipient: recipientId,
        product: productId,
        content,
      });
      setContent("");
      setError("");
      if (onSent) onSent(); // Optional callback after sending
    } catch (err) {
      // Use the error if available, otherwise show a generic message
      setError(err?.response?.data?.message || "Failed to send message.");
    }
  };

  return (
    <form onSubmit={handleSend}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message..."
        required
      />
      <button type="submit">Send</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}
