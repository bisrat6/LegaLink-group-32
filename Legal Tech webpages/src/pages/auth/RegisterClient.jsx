import React, { useState } from 'react';
import '../../assets/styles/authentication/signup.css';
import Header from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

function SignUp() {
  const [role, setRole] = useState('client');
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ name, userName, role, experience }));
    alert('🎉 You registered successfully! Redirecting to login...');
    window.location.href = '/login';
  };

  return (
    <>
      <Header />
      <div className="signup-div">
        <form onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <p>Create your account</p>

          <div className="div-input">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="data-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="div-input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="data-input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className="div-input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="data-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="div-input">
            <label>Account Type:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="client"
                  checked={role === 'client'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Client
              </label>
              <label>
                <input
                  type="radio"
                  value="lawyer"
                  checked={role === 'lawyer'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Lawyer
              </label>
            </div>
          </div>

          {role === 'lawyer' && (
            <>
              <div className="div-input">
                <label>Certificate</label>
                <input type="file" className="data-input" accept=".pdf,.docx" />
              </div>
              <div className="div-input">
                <label>National ID</label>
                <input type="file" className="data-input" accept=".pdf,.jpg,.png" />
              </div>
              <div className="div-input">
                <label>Years of Experience</label>
                <input
                  type="number"
                  placeholder="Enter years of experience"
                  className="data-input"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  min="0"
                />
              </div>
            </>
          )}

          <button className="signup-button" type="submit">Sign Up</button>
          <p>
            Already have an account?
            <a href="/login" className="login-link">Log in</a>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default SignUp;