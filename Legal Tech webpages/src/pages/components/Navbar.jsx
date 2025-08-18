import '../../assets/styles/homepage/home.css';
import logoImage from '../../assets/icons/logo5.png';
import { Link } from 'react-router-dom'; // Added for integration

function Header() {
  return (
    <header>
      <Link to="/">
        <div className='logo-container'>    
          <div className='logo-image'>
            <img className='logo' src={logoImage} alt="Legal Tech Logo" />
          </div>
        </div>
      </Link>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/login">Login</Link> {/* Added for realism */}
      </nav>
    </header>
  );
}

export default Header;