
import '../../assets/styles/homepage/home.css';
import '../../assets/styles/component/Navbar.css';
import '../../assets/styles/component/footer.css';
import Header from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx';
function Home(){

return (
    <>
    
      <Header /> 
    
   <p className='wel-paragraph'>Welcome to Legal Tech</p>
   <p className='reason-paragraph'>Where <br />clients find justice & <br /> lawyers find purpose.</p>
   <p className='website-description'>Our platform connects clients with expert lawyers tailored to their specific legal needs. We simplify finding, scheduling, and communicating with trusted legal professionals. Experience seamless access to quality legal support all in one place.</p>
   <a href="">
    <button className='readmore-button'>Read More</button>
   </a>
   <Footer />
    </>
);

}
export default Home