import React, { useState, useEffect } from "react";
import '../../assets/styles/client homepage/chat.css';
import io from "socket.io-client";
import ClientNavbar from "../components/clientNavbar";
import Footer from '../components/Footer'
const socket = io("http://localhost:5000"); // Replace with real backend URL for production

function Chat({ userId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Listen for messages from backend
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // Send message to backend
  const sendMessage = () => {
    if (message.trim() !== "") {
      const msgData = {
        sender: userId,
        text: message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit("send_message", msgData);
      setMessages((prev) => [...prev, msgData]);
      setMessage("");
    }
  };

  return (
    <>
      <ClientNavbar />
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={msg.sender === userId ? "my-msg" : "their-msg"}>
              <p>{msg.text}</p>
              <span>{msg.time}</span>
            </div>
          ))}
        </div>

        <div className="input-box">
          <input
            type="text"
            value={message}
            placeholder="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Chat;