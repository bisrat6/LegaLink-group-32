import React, { useState } from 'react';
import '../../assets/styles/authentication/login.css';
import Header from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && username === storedUser.userName && password === 'pass') {
      if (onLogin) onLogin(username);
      alert('Login successful! Redirecting to dashboard...');
      window.location.href = '/dashboard';
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <>
      <Header />
      <div className="login-page">
        <form onSubmit={handleSubmit}>
          <div className="login-form">
            <h2>Login</h2>
            <div className="data-input-div">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="data-input-div">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit"><a className='login-client' href="/dashboard">Login Client</a> <a href="/lawyerDashboard">login lawyer</a></button>
            <a className="forget" href="/forget">Forgot your password?</a>
            <p className="register-par">
              Don't have an account? <a className="register" href="/RegisterClient">Register</a>
            </p>
            {error && <p className="error">{error}</p>}
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Login;