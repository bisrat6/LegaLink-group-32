import '../../assets/styles/homepage/about.css';
import '../../assets/styles/component/Navbar.css';
import '../../assets/styles/component/footer.css';

import Header from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import bgImg from '../../assets/images/background6.avif';
function About(){
return (
  <>
  <div>
 <section className='sec-page1'>
    <Header />
  <h1>About Us</h1>
  </section>
  <div className='section-grid'>
<section>
<h2>Our History</h2>
<h5>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat minima corrupti error sit quasi optio quidem natus consequatur consectetur.</h5>
<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis in assumenda sapiente tenetur molestiae quisquam consequuntur, nostrum quidem ab incidunt. Distinctio ad illum dicta voluptatum quo. Delectus accusamus veritatis earum.</p>
<p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error ipsum reiciendis doloremque molestias velit soluta eos vitae ullam consequuntur temporibus, ad ratione sapiente libero rerum nisi odio magnam dolorum suscipit?</p>
</section>
<section>
<div className='why-choose'>
<h2>Why Choose Us</h2>
<h5>Many Years Exprience</h5>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, odio incidunt cumque quis amet numquam ipsam laudantium eum.</p>
<h5>Fair Cost</h5>
<p>tempora voluptas sint doloremque tenetur velit ipsa cum assumenda unde neque molestias, expedita libero. Dolore quas aliquid dolorum repellendus corrupti.</p>
</div>
</section>
  </div>
  

<div className='div-img'>
<img src={bgImg}  />
</div>




  
  <Footer />
  </div>
</>
);
}
export default About