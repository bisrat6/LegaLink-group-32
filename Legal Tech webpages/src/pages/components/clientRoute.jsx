import { Routes, Route, BrowserRouter } from 'react-router-dom';
// import DashboardNavbar from "./DashBoard Navbar.jsx";
import ClientDashboard from '../clients/dashboard.jsx';
import SearchLawyer from '../clients/search.jsx'
import Appointment from '../clients/appointment.jsx'
import MyProfile from '../clients/profile.jsx';
import Chat from '../clients/chat.jsx';
import CaseHistory from '../clients/caseHistory.jsx'
import Notification from '../clients/notification.jsx'
 function ClientRoutes() {
  return (
    
     <Routes>
      <Route path="/dashboard" element={<ClientDashboard />} />
      <Route path="/search" element={<SearchLawyer />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/profile" element={<MyProfile />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="/caseHistory" element={<CaseHistory />} />
    </Routes>
    
   
   
  );
}
export default ClientRoutes
