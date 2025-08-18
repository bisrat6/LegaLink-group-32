import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import '../../assets/styles/lawyer component/lawyerNavbar.css';

function LawyerNavbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
   

  return (
    <nav className="nav-container">
      <div className="nav-logo">
        <h3>Lawyer Portal</h3>
      </div>
      <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li className={location.pathname === "/lawyer-dashboard" || location.pathname === "/" ? "active" : ""}>
          <Link to="/lawyer-dashboard">Dashboard</Link>
        </li>
        <li className={location.pathname === "/schedule" ? "active" : ""}>
          <Link to="/schedule">Appointments</Link>
        </li>
        <li className={location.pathname === "/message" ? "active" : ""}>
          <Link to="/message">Chat</Link>
        </li>
        <li className={location.pathname === "/record" ? "active" : ""}>
          <Link to="/record">Cases</Link>
        </li>
        <li className={location.pathname === "/alert" ? "active" : ""}>
          <Link to="/alert">Notifications</Link>
        </li>
        <li className={location.pathname === "/myAccount" ? "active" : ""}>
          <Link to="/myAccount">My Profile</Link>
        </li>
        
      </ul>
    </nav>
  );
}

export default LawyerNavbar;