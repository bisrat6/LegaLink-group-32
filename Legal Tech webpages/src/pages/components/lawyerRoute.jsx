import React from "react";
import { Routes, Route } from "react-router-dom";
import MyAccount from "../lawyers/myAcount.jsx";
import CaseFeed from "../lawyers/record.jsx";
import Message from "../lawyers/message.jsx";
import Notification from "../lawyers/alert.jsx";
import LawyerDashboard from "../lawyers/lawyerDashboard.jsx";
import Schedule from "../lawyers/schedule.jsx";
import LawyerNavbar from './lawyerNavbar.jsx';

function LawyerRoutes() {
  return (
    <div className="main-content">
     
      <Routes>
        <Route path="/myAccount" element={<MyAccount />} />
        <Route path="/record" element={<CaseFeed />} />
        <Route path="/message" element={<Message />} />
        <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
        <Route path="/alert" element={<Notification />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/lawyerDashboard" element={<LawyerDashboard />} />
      </Routes>
    </div>
  );
}

export default LawyerRoutes;