import React from 'react';
import '../../assets/styles/homepage/about.css';
import Header from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import bgImg from '../../assets/images/background6.avif';

function About() {
  return (
    <>
      <section className="sec-page1">
        <Header />
        <h1>About Us</h1>
      </section>
      <div className="section-grid">
        <section>
          <h2>Our History</h2>
          <h5>Established in 2020</h5>
          <p>Legal Tech was founded to bridge the gap between clients and legal professionals in Ethiopia. Our mission is to make legal services accessible, transparent, and efficient through technology.</p>
          <p>Over the years, we've connected thousands of clients with verified lawyers, streamlining the process of finding legal representation and managing cases.</p>
        </section>
        <section>
          <div className="why-choose">
            <h2>Why Choose Us</h2>
            <h5>Expertise and Trust</h5>
            <p>Our platform verifies all lawyers to ensure you work with qualified professionals. We prioritize trust and reliability in every interaction.</p>
            <h5>Affordable Solutions</h5>
            <p>We offer competitive pricing and free initial consultations with many lawyers, making legal services accessible to all.</p>
          </div>
        </section>
      </div>
      <div className="div-img">
        <img src={bgImg} alt="Legal Tech Background" />
      </div>
      <Footer />
    </>
  );
}

export default About;