import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

const API_URL = "http://localhost:5000";

const MessagePage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const socketRef = useRef(null);

  // Initialize socket and fetch user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      navigate("/login");
      return;
    }

    // Get user info
    const getUserInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(response.data.user.role);
        setUserId(response.data.user.id);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setError("Failed to authenticate. Please log in again.");
        setLoading(false);
        navigate("/login");
      }
    };

    getUserInfo();

    // Connect to socket
    socketRef.current = io(API_URL, {
      query: { token },
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
    });

    socketRef.current.on("new_message", (message) => {
      if (message.sender === selectedUser?._id) {
        setChatHistory((prev) => [
          ...prev,
          {
            _id: message._id,
            sender: { _id: message.sender, username: message.senderName },
            message: message.message,
            file: message.file,
            filePath: message.filePath,
            createdAt: message.createdAt,
            read: false,
          },
        ]);
        // Mark as read if the chat is open
        if (selectedUser?._id === message.sender) {
          markChatAsRead(message._id);
        }
      } else {
        // Update unread count for other lawyers
        setLawyers((prev) =>
          prev.map((lawyer) =>
            lawyer._id === message.sender
              ? {
                  ...lawyer,
                  unreadCount: (lawyer.unreadCount || 0) + 1,
                  lastMessage: message.message || "Sent a file",
                  lastMessageTime: new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                }
              : lawyer
          )
        );
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [navigate, selectedUser]);

  // Fetch all lawyers
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/api/users/lawyers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const lawyersData = response.data.lawyers || response.data || [];
        const formattedLawyers = lawyersData.map((lawyer) => ({
          _id: lawyer._id,
          username: lawyer.username,
          specialization: lawyer.specialization,
          location: lawyer.location,
          unreadCount: 0, // Will be updated with chat history
          lastMessage: "",
          lastMessageTime: "",
        }));
        setLawyers(formattedLawyers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lawyers:", error);
        setError("Failed to load lawyers");
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  // Fetch chat history when a lawyer is selected
  useEffect(() => {
    if (!selectedUser) return;

    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/chats/history/${selectedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const chats = response.data.chats || [];
        setChatHistory(
          chats.map((chat) => ({
            _id: chat._id,
            sender: {
              _id: chat.sender._id,
              username: chat.sender.username,
            },
            message: chat.message,
            file: chat.file,
            filePath: chat.filePath,
            createdAt: chat.createdAt,
            read: chat.read,
          }))
        );

        // Mark messages as read if from the selected lawyer
        if (chats.some((chat) => !chat.read && chat.sender._id === selectedUser._id)) {
          markChatAsRead(selectedUser._id);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setError("Failed to load chat history");
      }
    };

    fetchChatHistory();
  }, [selectedUser]);

  // Mark chat as read
  const markChatAsRead = async (chatId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/api/chats/${chatId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat._id === chatId ? { ...chat, read: true } : chat
        )
      );
      setLawyers((prev) =>
        prev.map((lawyer) =>
          lawyer._id === selectedUser?._id
            ? { ...lawyer, unreadCount: 0 }
            : lawyer
        )
      );
    } catch (error) {
      console.error("Error marking chat as read:", error);
    }
  };

  // Handle sending messages
  const handleSendMessage = async (message, file) => {
    if (!message.trim() && !file) return;

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("receiver", selectedUser._id);
      if (message.trim()) {
        formData.append("message", message.trim());
      }
      if (file) {
        formData.append("file", file);
      }

      const response = await axios.post(`${API_URL}/api/chats/send`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const newChat = response.data.chat;
      setChatHistory((prev) => [
        ...prev,
        {
          _id: newChat._id,
          sender: { _id: userId, username: "You" },
          message: newChat.message,
          file: newChat.file,
          filePath: newChat.filePath,
          createdAt: newChat.createdAt,
          read: false,
        },
      ]);
      setLawyers((prev) =>
        prev.map((lawyer) =>
          lawyer._id === selectedUser._id
            ? {
                ...lawyer,
                lastMessage: newChat.message || "Sent a file",
                lastMessageTime: new Date(newChat.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : lawyer
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    }
  };

  // Handle lawyer selection
  const handleSelectLawyer = (lawyer) => {
    setSelectedUser(lawyer);
    setChatHistory([]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left column - Lawyers List */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Lawyers</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p>Loading lawyers...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500">
            <p>{error}</p>
          </div>
        ) : lawyers.length === 0 ? (
          <div className="p-4 text-gray-500">
            <p>No lawyers found.</p>
          </div>
        ) : (
          <ConversationList
            role={userRole}
            conversations={lawyers}
            unreadChats={chatHistory.filter((chat) => !chat.read && chat.sender._id !== userId)}
            onSelectUser={handleSelectLawyer}
          />
        )}
      </div>
      
      {/* Right column - Chat Window */}
      <div className="w-2/3 flex flex-col">
        {selectedUser ? (
          <ChatWindow
            selectedUser={selectedUser}
            chatHistory={chatHistory}
            onSendMessage={handleSendMessage}
            role={userRole}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a lawyer to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;