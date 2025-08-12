
import '../../assets/styles/homepage/home.css';
import logoImage from '../../assets/icons/logo.jpg';

function Header () {
    return (
        <header>
            
           
                 <a href="/">
                 <div className='logo-container'>    
            <div className='logo-image'>
                
                <img className='logo' src={logoImage} alt="logo image" />
            </div>
            <div className='logo-title'>
                        <h2>Legal Tech</h2>
                <p>a Better Legal System</p>
                    </div>
                    </div>
            </a>
            
              
           
        </header>
    );
}
export default Header