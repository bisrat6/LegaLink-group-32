import React, { useState } from 'react';
import '../../assets/styles/homepage/contact.css';
import Header from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <section className="sec-page3">
        <Header />
        <h1>Contact</h1>
      </section>
      <div className="flex-section">
        <section className="sec-page2">
          <h2>Get In Touch</h2>
          <h5>We're here to assist you with your legal needs.</h5>
          <div className="contact-section">
            <h3>Contact Us</h3>
            <p>Email: <a href="mailto:support@example.com">support@example.com</a></p>
            <p>Phone: <a href="tel:+251-914-792-331">+251-914-792-331</a></p>
            <p>Address: Addis Ababa, Ethiopia</p>
          </div>
          <div className="contact-section-social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <ul>
                <li><a href="https://facebook.com/example">Facebook</a></li>
                <li><a href="https://twitter.com/example">Twitter</a></li>
                <li><a href="https://linkedin.com/example">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </section>
        <section className="sec-page4">
          <h2>Message Us</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <p>Name:<small className="necessary-note">*</small></p>
              <input
                type="text"
                name="name"
                className="inline-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <p>Email:<small className="necessary-note">*</small></p>
              <input
                type="email"
                name="email"
                className="inline-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <p>Phone Number:<small className="necessary-note">*</small></p>
              <input
                type="tel"
                name="phone"
                className="inline-input"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <p>Message:<small className="necessary-note">*</small></p>
              <textarea
                name="message"
                className="inline-input"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-button">Submit</button>
          </form>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Contact;