
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/public/home.jsx';
import About from './pages/public/about.jsx';
import Contact from './pages/public/contact.jsx';
import './App.css'
function App() {
  
  return (
   <BrowserRouter>
   <nav>
   
        <Link className='nav-link' to="/">Home</Link> 
         <Link className='nav-link' to="/about">About</Link>
          <Link className='nav-link' to="/faq">FAQ</Link>
           <Link className='nav-link' to="/contact">Contact</Link>
            <Link className='nav-link-login' to="/login"><button className='login-button'>Login</button></Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
   </BrowserRouter>
  // <>
  // <Home />
  //  <About/>
  // </>
   
  )
}

export default App
