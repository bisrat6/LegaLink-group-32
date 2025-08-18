import React from "react";
import { Routes, Route } from "react-router-dom";
import ClientDashboard from "../clients/dashboard.jsx";
import Chat from "../clients/chat";
import CaseHistory from "../clients/caseHistory";
import Appointment from "../clients/appointment";
import MyProfile from "../clients/profile";
import SearchLawyer from "../clients/search";
import Notification from "../clients/notification";
import ClientNavbar from '../components/clientNavbar.jsx';

function ClientRoutes() {
  return (
    <div className="main-content">
      
      <Routes>
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/chat" element={<Chat userId="exampleUser" />} />
        <Route path="/caseHistory" element={<CaseHistory />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/search" element={<SearchLawyer />} />
        <Route path="/notification" element={<Notification userId="exampleUser" />} />
        
      </Routes>
    </div>
  );
}

export default ClientRoutes;