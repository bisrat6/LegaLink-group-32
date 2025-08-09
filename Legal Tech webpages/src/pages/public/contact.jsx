import '../../assets/styles/Navbar.css';
import '../../assets/styles/footer.css';
import '../../assets/styles/contact.css';
import Header from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
function Contact(){
return (
    <>
      <section className='sec-page1'>
        <Header />
<h1>Contact</h1>
  </section>
  <div className='flex-section'>
<section className='sec-page2' >
    
<h2>Get In Touch</h2>
<h5>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat minima corrupti error sit quasi optio quidem natus consequatur consectetur.</h5>
 <div className="contact-section">
                <h3>Contact Us</h3>
                <p>email:  <a href="">support@example.com</a></p>
                <p>Phone: <a href="+251-914-792-331">+251-914-792-331</a></p>
                <p>Address: Addis Ababa, Ethiopia</p>
            </div>
            <div className="contact-section-social">
                <h3>Follow Us</h3>
                <div className="social-icons">
                    <ul>
                        <li><a href="https://facebook.com/example">Facebook</a></li>
                        <li><a href="https://teitter.com/example">Twitter</a></li>
                        <li><a href="https://linkedin.com/example">Linkedin</a></li>
                    </ul>
                </div>
                </div>
  </section>
    <section className='sec-page2'>
    
  
<h2>Message Us</h2>
<div>

<p>Name:<small class="necessary-note">*</small> </p>
<input type="text" className='inline-input' />
</div>
<div>
  
  <p>Email:<small class="necessary-note">*</small> </p>
<input type="text" className='inline-input' /> 
</div>
<div>
    
<p>Phone Number:<small class="necessary-note">*</small> </p>
<input type="text" className='inline-input' />
</div>
<div>
    
<p>Message:<small class="necessary-note">*</small> </p>
<input type="text" className='inline-input' />
</div>
<button className='submit-button'>Submit</button>


  </section>
  </div>
  

    <Footer />
    </>
);
}
export default Contact