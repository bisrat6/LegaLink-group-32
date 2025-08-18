import React, { useState } from "react";
import "../../assets/styles/lawyer homepage/lawyer dashboard.css";
import Schedule from './schedule.jsx';
import LawyerNavbar from "../components/lawyerNavbar";
import Footer from '../components/Footer'
const exampleCases = [
  {
    id: 1,
    clientName: "Alice Johnson",
    title: "Contract Dispute",
    description: "Client is disputing a contract breach with their supplier. Needs legal advice on next steps.",
  },
  {
    id: 2,
    clientName: "Bob Smith",
    title: "Personal Injury Claim",
    description: "Client was injured in a car accident and wants to claim compensation.",
  },
];

const profileInfo = {
  name: "John Doe",
  heading: "Experienced Corporate Lawyer",
  description: "With over 15 years of experience, John specializes in contract law and corporate litigation. Dedicated to protecting your interests and delivering results.",
  image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
  phone: "+1 (555) 123-4567",
  email: "john.doe@example.com",
};

function LawyerDashboard() {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
    <LawyerNavbar />
    
     <div className="dashboardContainer">
      <header className="dashboardHeader">
        <img
          src={profileInfo.image}
          alt="Profile"
          className="profilePic"
          onClick={() => setShowProfile(true)}
          title="View Profile"
        />
        <h1 className="lawyerName">{profileInfo.name}</h1>
      </header>

      <main className="dashboardMain">
        {showProfile ? (
          <ProfilePage profile={profileInfo} onBack={() => setShowProfile(false)} />
        ) : (
          <CaseList cases={exampleCases} />
        )}
      </main>
      {/* <Schedule /> */}
      
    </div>
    <Footer />
    </>
   
  );
}

function ProfilePage({ profile, onBack }) {
  return (
    <div className="profilePage">
      <button className="backButton" onClick={onBack}>
        ← Back
      </button>
      <h2>{profile.name}</h2>
      <h3>{profile.heading}</h3>
      <img src={profile.image} alt="Profile Detail" className="profileDetailImage" />
      <p className="profileDescription">{profile.description}</p>
      <div className="contactInfo">
        <p><strong>Phone:</strong> {profile.phone}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>
    </div>
  );
}

function CaseList({ cases }) {
  return (
    <section className="caseListSection">
      <h2>Posted Client Cases</h2>
      {cases.length === 0 ? (
        <p>No cases posted yet.</p>
      ) : (
        cases.map((c) => (
          <article key={c.id} className="caseCard">
            <h3>{c.title}</h3>
            <p><strong>Client:</strong> {c.clientName}</p>
            <p>{c.description}</p>
          </article>
        ))
      )}
    </section>
  );
}

export default LawyerDashboard;