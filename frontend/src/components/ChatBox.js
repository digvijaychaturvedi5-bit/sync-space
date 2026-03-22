import React, { useEffect, useRef, useState } from "react";
import { createAuthenticatedSocket } from "../services/socket";

function ChatBox({ projectId, currentUser, messages, setMessages, loadMessages }) {
  const [message, setMessage] = useState("");
  const [socketError, setSocketError] = useState("");
  const endRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = createAuthenticatedSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      setSocketError("");
      socket.emit("join_project", projectId);
    };

    const handleReceive = (incomingMessage) => {
      // Prevent duplicate inserts when the same message arrives after a refresh or reconnect.
      setMessages((prev) => {
        const exists = prev.some((item) => item._id === incomingMessage._id);
        return exists ? prev : [...prev, incomingMessage];
      });
    };

    const handleMessageError = (incomingError) => {
      setSocketError(incomingError?.message || incomingError || "Realtime chat is unavailable right now.");
    };

    socket.on("connect", handleConnect);
    socket.on("receive_message", handleReceive);
    socket.on("message_error", handleMessageError);
    socket.on("connect_error", handleMessageError);
    socket.connect();
    loadMessages();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receive_message", handleReceive);
      socket.off("message_error", handleMessageError);
      socket.off("connect_error", handleMessageError);
      socket.disconnect();
    };
  }, [projectId, loadMessages, setMessages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }

    socketRef.current?.emit("send_message", {
      projectId,
      message: message.trim()
    });
    setMessage("");
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">Project Chat</h4>
          <span className="text-muted small">{messages.length} messages</span>
        </div>
        {socketError && <div className="alert alert-warning py-2">{socketError}</div>}
        <div className="chat-window mb-3">
          {messages.length === 0 && <p className="text-muted">Start the conversation with your team.</p>}
          {messages.map((item) => {
            const ownMessage = item.sender?._id === currentUser._id;
            return (
              <div
                key={item._id}
                className={`chat-bubble ${ownMessage ? "chat-bubble-own" : "chat-bubble-peer"}`}
              >
                <div className="small fw-semibold mb-1">{item.sender?.name || "Teammate"}</div>
                <div>{item.message}</div>
                <div className="small opacity-75 mt-1">
                  {new Date(item.timestamp || item.createdAt).toLocaleTimeString()}
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
        <form onSubmit={handleSubmit} className="mt-auto">
          <div className="input-group">
            <input
              className="form-control"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Type your update..."
            />
            <button className="btn btn-dark" type="submit">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatBox;
