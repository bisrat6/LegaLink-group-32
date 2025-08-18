import React, { useState, useEffect } from "react";
import "../../assets/styles/lawyer homepage/alert.css";
import LawyerNavbar from "../components/lawyerNavbar";
import Footer from '../components/Footer'
export default function Notification({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const alertData = [
      {
        id: 1,
        type: "case",
        message: "Your divorce case has been updated with new evidence.",
        date: "2025-08-12",
        read: false,
      },
      {
        id: 2,
        type: "appointment",
        message: "You have an appointment with Attorney John Doe tomorrow at 3:00 PM.",
        date: "2025-08-11",
        read: false,
      },
      {
        id: 3,
        type: "payment",
        message: "Your invoice #1023 for $250 is due in 3 days.",
        date: "2025-08-10",
        read: true,
      },
      {
        id: 4,
        type: "case",
        message: "New case assigned: Business contract review for XYZ Corp.",
        date: "2025-08-09",
        read: false,
      },
      {
        id: 5,
        type: "appointment",
        message: "Court hearing rescheduled to 2025-09-01 at 10:00 AM.",
        date: "2025-08-08",
        read: true,
      },
    ];
    setNotifications(alertData);
  }, [userId]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case "case":
        return "📄";
      case "appointment":
        return "📅";
      case "payment":
        return "💰";
      default:
        return "🔔";
    }
  };

  return (
  <>
  <LawyerNavbar />
  
   <div className="notification-page">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`notification-item ${notif.read ? "read" : "unread"}`}
              onClick={() => markAsRead(notif.id)}
            >
              <span className="icon">{getIcon(notif.type)}</span>
              <div className="content">
                <p>{notif.message}</p>
                <small>{new Date(notif.date).toLocaleDateString()}</small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    <Footer />
  </>
   
  );
}