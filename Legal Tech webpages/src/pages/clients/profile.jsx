import React, { useState } from "react";
import "../../assets/styles/client homepage/profile.css";
import DashboardNavbar from '../components/DashBoard Navbar.jsx';

function MyProfile() {
  const [name, setName] = useState("Client Name");
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState("Addis Ababa, Ethiopia");
  const [education, setEducation] = useState("Bachelor's Degree");

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = () => {
    alert("Profile updated successfully!");
    // In real case, send data to backend here
  };

  return (
    <>
    <DashboardNavbar />
    <div className="profile-page">
      <h2>My Profile</h2>
      <div className="profile-info">
        {/* Profile Photo */}
        <img src={photo || "/default-avatar.png"} alt="Profile" />
        <input type="file" onChange={handlePhotoChange} />

        {/* Name */}
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Location */}
        <label>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Education Level */}
        <label>Education Level</label>
        <select
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        >
          <option value="High School">High School</option>
          <option value="Diploma">Diploma</option>
          <option value="Bachelor's Degree">Bachelor's Degree</option>
          <option value="Master's Degree">Master's Degree</option>
          <option value="PhD">PhD</option>
        </select>

        {/* Save Button */}
        <button onClick={handleSave}>Save Changes</button>
      </div>
    </div>
    </>
  );
}

export default MyProfile;
