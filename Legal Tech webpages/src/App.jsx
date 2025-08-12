
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import{useState} from 'react'
import ClientRoutes from './pages/components/clientRoute.jsx'
import DashboardNavbar from './pages/components/DashBoard Navbar.jsx'
import Home from './pages/public/home.jsx';
import About from './pages/public/about.jsx';
import Contact from './pages/public/contact.jsx';
import Login from './pages/auth/login.jsx';
import './App.css'
import SignUp from './pages/auth/RegisterClient.jsx'
import Forget from './pages/auth/forget.jsx'
import FAQ from './pages/public/FAQ.jsx'
function App() {
 
 const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    
   <BrowserRouter>
      
     
   <nav>
   
        <Link className='nav-link' to="/">Home</Link> 
         <Link className='nav-link' to="/about">About</Link>
          <Link className='nav-link' to="/FAQ">FAQ</Link>
           <Link className='nav-link' to="/contact">Contact</Link>
            <Link className='nav-link-login' to="/login"><button className='login-button'>Login</button></Link>
            
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/RegisterClient" element={<SignUp />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/FAQ" element={<FAQ />} />
      </Routes>
     
    <ClientRoutes/>
   </BrowserRouter>
  
   
  )
}

export default App
