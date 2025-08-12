import React, { useState } from "react";
import "../../assets/styles/client homepage/search.css";
import DashboardNavbar from '../components/DashBoard Navbar.jsx';

function SearchLawyer() {
  const [location, setLocation] = useState("");
  const [caseType, setCaseType] = useState("");
  const [results, setResults] = useState([]);

   const handleSearch = () => {
    // For now, just a placeholder
    setResults([
      { name: "John Doe", location: "Addis Ababa", type: "Criminal" },
      { name: "Sara Smith", location: "Mekelle", type: "Family" }
    ]);
  };

  return (
    <>
    <DashboardNavbar />
    <div className="search-lawyer">
      <h2>Find a Lawyer</h2>
      <div className="search-filters">
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select value={caseType} onChange={(e) => setCaseType(e.target.value)}>
          <option value="">Select Case Type</option>
          <option value="Criminal">Criminal</option>
          <option value="Family">Family</option>
          <option value="Business">Business</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="results">
        {results.map((lawyer, i) => (
          <div key={i} className="lawyer-card">
            <h4>{lawyer.name}</h4>
            <p >{lawyer.location}</p>
            <p >Type: {lawyer.type}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default SearchLawyer;
