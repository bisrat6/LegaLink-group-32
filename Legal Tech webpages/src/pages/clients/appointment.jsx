import React, { useState } from "react";
import "../../assets/styles/client homepage/appointment.css";
import ClientNavbar from "../components/clientNavbar";
import Footer from '../components/Footer'

function Appointment() {
  const [appointments] = useState([
    {
      lawyer: "John Doe",
      date: "2025-08-14",
      time: "10:00 AM",
      type: "Consultation",
      status: "Confirmed"
    },
    {
      lawyer: "Sara Smith",
      date: "2025-08-16",
      time: "2:00 PM",
      type: "Case Review",
      status: "Pending"
    },
    {
      lawyer: "Michael Brown",
      date: "2025-08-20",
      time: "11:30 AM",
      type: "Follow-up",
      status: "Cancelled"
    }
  ]);
  // TODO: Fetch appointments from backend

  return (
    <>
      <ClientNavbar />
      <div className="appointment-container">
        <h2>My Appointments</h2>

        {appointments.length === 0 ? (
          <p className="no-appointments">No appointments scheduled.</p>
        ) : (
          <div className="appointment-list">
            {appointments.map((appt, index) => (
              <div key={index} className="appointment-card">
                <h3>{appt.lawyer}</h3>
                <p><strong>Date:</strong> {appt.date}</p>
                <p><strong>Time:</strong> {appt.time}</p>
                <p><strong>Type:</strong> {appt.type}</p>
                <span className={`status ${appt.status.toLowerCase()}`}>
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Appointment;