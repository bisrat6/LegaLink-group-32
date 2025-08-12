import React from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/client componet/dashboard navbar.css";

function DashboardNavbar() {
  return (
    <nav className="dashboard-navbar">
      <Link to="/dashboard">Home</Link>
      <Link to="/search">Search Lawyer</Link>
      <Link to="/appointment">Appointments</Link>
      <Link to="/chat">Chat</Link>
      <Link to="/caseHistory">Case History</Link>
      <Link to="/notification">Notifications</Link>
      <Link to="/profile">My Profile</Link>
    </nav>
  );
}

export default DashboardNavbar;
