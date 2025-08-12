import React from 'react';
import '../../assets/styles/client homepage/dashboard.css';
import ProfileImg from '../../assets/icons/profile.jpg'
import DashboardNavbar from '../components/DashBoard Navbar.jsx';
function ClientDashboard() {
  return (
    <>
    <DashboardNavbar />
    <div className="dashboard-container">
      {/* Greeting */}
      <div className="greeting-card">
        <div>
          <h1>Good Evening, Yoseph 👋</h1>
          <p>Here’s what’s happening today</p>
        </div>
        <img 
          src={ProfileImg} 
          alt="Profile" 
          className="profile-image"
        />
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        
        {/* Quick Search */}
        <div className="card quick-search">
          <h2>Find a Lawyer</h2>
          <div className="search-fields">
            <input type="text" placeholder="Search..." />
            <select>
              <option>Location</option>
              <option>Addis Ababa</option>
              <option>Mekelle</option>
            </select>
            <select>
              <option>Case Type</option>
              <option>Criminal</option>
              <option>Family</option>
            </select>
            <button>Search</button>
          </div>
        </div>

        {/* Unread Messages */}
        <div className="card unread-messages">
          <h2>Unread Messages</h2>
          <p className="big-number">5</p>
          <button><a className='go-chat-link' href="/chat">Go to Chat</a></button>
        </div>

        {/* Upcoming Appointments */}
        <div className="card">
          <h2>Upcoming Appointments</h2>
          <ul className="appointments-list">
            <li>
              <span>John Doe - Criminal</span>
              <span>Aug 12</span>
            </li>
            <li>
              <span>Jane Smith - Family</span>
              <span>Aug 15</span>
            </li>
          </ul>
        </div>

        {/* Case Summary */}
        <div className="card">
          <h2>Case Summary</h2>
          <div className="case-summary">
            <div>
              <p className="big-number">2</p>
              <p>Active</p>
            </div>
            <div>
              <p className="big-number">5</p>
              <p>Closed</p>
            </div>
            <div>
              <p className="big-number">1</p>
              <p>Pending</p>
            </div>
          </div>
        </div>

        {/* Top Lawyers */}
        <div className="card top-lawyers">
          <h2>Top Lawyers in Your Area</h2>
          <div className="lawyers-grid">
            <div className="lawyer-card">
              <img src="/lawyer1.jpg" alt="Lawyer" />
              <h3>Michael Johnson</h3>
              <p>Criminal Law</p>
              <button>View Profile</button>
            </div>
            <div className="lawyer-card">
              <img src="/lawyer2.jpg" alt="Lawyer" />
              <h3>Sarah Lee</h3>
              <p>Family Law</p>
              <button>View Profile</button>
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  );
}

export default ClientDashboard;
