import React, { useState } from 'react';
import '../../assets/styles/homepage/BrowseLawyers.css';
import Header from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ClientNavbar from "../components/clientNavbar";

function BrowseLawyers() {
  const [lawyers, setLawyers] = useState([
    { name: 'John Doe', location: 'Addis Ababa', type: 'Criminal' },
    { name: 'Sara Smith', location: 'Mekelle', type: 'Family' },
    { name: 'Abel Birhanu', location: 'Bahrdar', type: 'Social Harassment' },
    { name: 'Sara Tesfaye', location: 'Harari', type: 'Guardianship' }
  ]);

  return (
    <>
      <Header />
      <section className="browse-lawyers">
        <h2>Browse Lawyers</h2>
        <p>Find the right lawyer for your legal needs.</p>
        <div className="lawyers-list">
          {lawyers.map((lawyer, index) => (
            <div key={index} className="lawyer-card">
              <h3>{lawyer.name}</h3>
              <p>Location: {lawyer.location}</p>
              <p>Specialization: {lawyer.type}</p>
              <button onClick={() => alert(`Contact ${lawyer.name}`)}>Contact</button>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default BrowseLawyers;