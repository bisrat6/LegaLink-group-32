import React, { useState, useRef, useEffect } from "react";
import "../../assets/styles/lawyer homepage/myAcount.css";
import LawyerNavbar from "../components/lawyerNavbar";
import Header from '../components/Navbar'
import Footer from '../components/Footer'
function MyAccount({ initial = {}, onSave }) {
  const [photo, setPhoto] = useState(initial.photo || null);
  const [location, setLocation] = useState(initial.location || "");
  const [studyType, setStudyType] = useState(initial.studyType || "LLB");
  const [bio, setBio] = useState(initial.bio || "");
  const [years, setYears] = useState(initial.years || 0);
  const [educationLevel, setEducationLevel] = useState(initial.educationLevel || "Undergraduate");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("lawyerProfile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setPhoto(parsed.photo || null);
      setLocation(parsed.location || "");
      setStudyType(parsed.studyType || "LLB");
      setBio(parsed.bio || "");
      setYears(parsed.years || 0);
      setEducationLevel(parsed.educationLevel || "Undergraduate");
    }
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setPhoto({ file, preview: URL.createObjectURL(file) });
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      photo: photo && photo.file ? photo.file : photo && photo.preview ? photo.preview : null,
      location,
      studyType,
      bio,
      years: Number(years),
      educationLevel,
    };

    localStorage.setItem("lawyerProfile", JSON.stringify(payload));
    console.log("Saving profile:", payload);
    if (onSave) onSave(payload);
    alert("Profile saved (check console and localStorage).");
  };

  return (
    <>
    <LawyerNavbar/>
    
     <div className="mp-container">
      
      <form className="mp-card" onSubmit={handleSubmit}>
         
        <h2 className="mp-title">My Profile</h2>
        <div className="mp-avatar-col">
          <div className="mp-avatar">
            {photo && photo.preview ? (
              <img src={photo.preview} alt="Profile preview" />
            ) : (
              <div className="mp-avatar-placeholder">No photo</div>
            )}
          </div>
          <div className="mp-avatar-actions">
            <input
              ref={fileInputRef}
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="mp-file-input"
            />
            <label htmlFor="photo" className="mp-btn mp-btn-primary">
              Upload Photo
            </label>
            {photo && (
              <button type="button" className="mp-btn mp-btn-ghost" onClick={handleRemovePhoto}>
                Remove
              </button>
            )}
          </div>
        </div>

        <label className="mp-label">
          Location
          <input
            className="mp-input"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location"
          />
        </label>

        <label className="mp-label">
          Type of Study
          <select className="mp-input" value={studyType} onChange={(e) => setStudyType(e.target.value)}>
            <option value="LLB">LLB</option>
            <option value="JD">JD</option>
            <option value="LLM">LLM</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="mp-label">
          Level of Education
          <select className="mp-input" value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)}>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Graduate / Professional">Graduate / Professional</option>
            <option value="Postgraduate / Doctorate">Postgraduate / Doctorate</option>
            <option value="Certificate / Diploma">Certificate / Diploma</option>
          </select>
        </label>

        <label className="mp-label">
          Years of Experience
          <input
            className="mp-input"
            type="number"
            min={0}
            max={70}
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </label>

        <label className="mp-label mp-bio">
          Short Bio
          <textarea
            className="mp-textarea"
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Briefly describe your practice, specialties, and a line about yourself."
          />
        </label>

        <div className="mp-actions">
          <button type="submit" className="mp-btn mp-btn-primary">
            Save Profile
          </button>
          <button
            type="button"
            className="mp-btn mp-btn-ghost"
            onClick={() => {
              setLocation("");
              setStudyType("LLB");
              setBio("");
              setYears(0);
              setEducationLevel("Undergraduate");
              handleRemovePhoto();
              localStorage.removeItem("lawyerProfile");
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
    <Footer />
    </>
   
  );
}

export default MyAccount;