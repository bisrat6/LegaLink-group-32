import React, { useState } from 'react';
import '../../assets/styles/authentication/forget.css';
import Header from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

function Forget() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Reset link sent to ${email}!`);
    setEmail('');
  };

  return (
    <>
      <Header />
      <div className="forget-div">
        <form onSubmit={handleSubmit}>
          <h2>Forget Password</h2>
          <p>Enter your email address to reset your password.</p>
          <div className="forget-input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="data-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-link">Send Reset Link</button>
          <a href="/login" className="back-login">Back to Login</a>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Forget;