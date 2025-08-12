import { useState } from 'react';
import '../../assets/styles/authentication/login.css'
import Header from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); //this will stop from reloading it as default when you submit so we give this to form

    // Simple fake check (replace with API call)
    if (username === 'user' && password === 'pass') {
      onLogin(username);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
   <>
    <Header />
    <div className='login-page'>
 <form onSubmit={handleSubmit}>
      <div className='login-form'>
<h2>Login</h2>
      <div className='data-input-div'>
        <label htmlFor="email">Email Address</label>
        <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      </div>
    <div className='data-input-div'>
      <label htmlFor="password">password</label>
       <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
    </div>
      <button type="submit" className='submit'><a href="/dashboard">Login</a></button>
      <a className='forget' href="/forget">Forget your password?</a>
      <p className='register-par'>Don't have an account? <a className='register' href="/RegisterClient">Register</a></p>
      {error && <p style={{color:'red'}}>{error}</p>}
      </div>
      
    </form>
    </div>
   <Footer/>
   </>
  );
}

export default Login
