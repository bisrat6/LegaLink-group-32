import React, { useState, useEffect, useRef } from "react";
import "../../assets/styles/lawyer homepage/message.css";
import LawyerNavbar from "../components/lawyerNavbar";
import Footer from '../components/Footer'
const initialMessages = [
  {
    id: 1,
    sender: "client",
    text: "Hello, I want to discuss my contract.",
    timestamp: "2025-08-10T10:00:00Z",
    read: true,
  },
  {
    id: 2,
    sender: "lawyer",
    text: "Sure! When would you like to schedule a call?",
    timestamp: "2025-08-10T10:05:00Z",
    sent: true,
    read: true,
  },
  {
    id: 3,
    sender: "client",
    text: "Tomorrow afternoon works for me.",
    timestamp: "2025-08-10T10:07:00Z",
    read: false,
  },
];

function Message() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: "lawyer",
      text: input.trim(),
      timestamp: new Date().toISOString(),
      sent: true,
      read: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const renderTicks = (msg) => {
    if (msg.sender !== "lawyer") return null;

    if (msg.read) {
      return (
        <span title="Read" style={{ color: "#4fc3f7", marginLeft: 6 }}>
          ✓✓
        </span>
      );
    }
    if (msg.sent) {
      return (
        <span title="Sent" style={{ color: "gray", marginLeft: 6 }}>
          ✓
        </span>
      );
    }
    return null;
  };

  return (
    <>
    <LawyerNavbar />
    
     <div className="container">
      <h3>Chat with Client</h3>
      <div className="chatWindow">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="messageBubble"
            style={{
              alignSelf: msg.sender === "lawyer" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "lawyer" ? "#dcf8c6" : "#e9ecef",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>{msg.text}</span>
              {renderTicks(msg)}
            </div>
            <small className="timestamp">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="inputArea">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="input"
        />
        <button onClick={sendMessage} className="sendButton" type="button">
          Send
        </button>
      </div>
    </div>
    <Footer />
    </>
   
  );
}

export default Message;