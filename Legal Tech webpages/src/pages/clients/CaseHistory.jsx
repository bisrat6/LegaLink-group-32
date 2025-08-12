import React, { useState, useEffect } from "react";
import "../../assets/styles/client homepage/caseHistory.css";
import DashboardNavbar from '../components/DashBoard Navbar.jsx';

const CaseHistory = () => {
  const [cases, setCases] = useState([]);
  const [newCase, setNewCase] = useState("");

  // Load saved cases from localStorage
  useEffect(() => {
    const savedCases = JSON.parse(localStorage.getItem("clientCases")) || [];
    setCases(savedCases);
  }, []);

  // Save cases to localStorage whenever cases state changes
  useEffect(() => {
    localStorage.setItem("clientCases", JSON.stringify(cases));
  }, [cases]);

  // Add new case
  const handleAddCase = () => {
    if (newCase.trim() === "") return;
    const caseData = {
      id: Date.now(),
      text: newCase,
      date: new Date().toLocaleString(),
    };
    setCases([caseData, ...cases]);
    setNewCase("");
  };

  return (
    <>
    <DashboardNavbar />
     <div className="case-history-container">
      <h2>📜 Case History</h2>

      {/* Add New Case */}
      <div className="new-case-box">
        <textarea
          placeholder="Describe your case..."
          value={newCase}
          onChange={(e) => setNewCase(e.target.value)}
        ></textarea>
        <button onClick={handleAddCase}>Post Case</button>
      </div>

      {/* Case List */}
      <div className="case-list">
        {cases.length === 0 ? (
          <p>No cases posted yet.</p>
        ) : (
          cases.map((c) => (
            <div key={c.id} className="case-item">
              <p>{c.text}</p>
              <span className="case-date">{c.date}</span>
            </div>
          ))
        )}
      </div>
    </div>
    </>
   
  );
};

export default CaseHistory;
