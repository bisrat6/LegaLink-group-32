import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import '../../assets/styles/client componet/clientNavbar.css';

function ClientNavbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
   
  return (
    <nav className="nav-container">
      <div className="nav-logo">
        <h3>Client Portal</h3>
      </div>
      <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li className={location.pathname === "/dashboard" || location.pathname === "/" ? "active" : ""}>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className={location.pathname === "/search" ? "active" : ""}>
        <Link to="/search">search</Link>
        </li>
        <li className={location.pathname === "/appointment" ? "active" : ""}>
          <Link to="/appointment">Appointments</Link>
        </li>
        <li className={location.pathname === "/chat" ? "active" : ""}>
          <Link to="/chat">Chat</Link>
        </li>
        <li className={location.pathname === "/caseHistory" ? "active" : ""}>
          <Link to="/caseHistory">Cases</Link>
        </li>
        <li className={location.pathname === "/notification" ? "active" : ""}>
          <Link to="/notification">Notifications</Link>
        </li>
        <li className={location.pathname === "/profile" ? "active" : ""}>
          <Link to="/profile">My Profile</Link>
        </li>
        
      </ul>
    </nav>
  );
}

export default ClientNavbar;