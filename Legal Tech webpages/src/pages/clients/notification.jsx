import React, { useState, useEffect } from "react";
import "../../assets/styles/client homepage/notification.css";
import ClientNavbar from "../components/clientNavbar";
import Footer from '../components/Footer'

function Notification({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Example data; replace with backend fetch
    const exampleData = [
      {
        message: "Your appointment with Lawyer Abel Birhanu is confirmed.",
        createdAt: new Date().toISOString(),
        read: false
      },
      {
        message: "Your profile has been updated successfully.",
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
        read: true
      }
    ];
    setNotifications(exampleData);

    // TODO: Uncomment for backend
    /*
    fetch(`http://localhost:5000/notifications/${userId}`)
      .then(res => res.json())
      .then(data => setNotifications(data));
    */
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <ClientNavbar />
      <div className="notification-container">
        <div className="bell" onClick={() => setIsOpen(!isOpen)}>
          🔔
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </div>

        {isOpen && (
          <div className="dropdown">
            {notifications.length === 0 ? (
              <p className="no-notifications">No notifications</p>
            ) : (
              notifications.map((n, i) => (
                <div
                  key={i}
                  className={`notification-item ${n.read ? "" : "unread"}`}
                >
                  <p>{n.message}</p>
                  <small>{new Date(n.createdAt).toLocaleString()}</small>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Notification;