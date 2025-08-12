import React, { useState } from "react";
import "../../assets/styles/homepage/FAQ.css";
import '../../assets/styles/component/Navbar.css';
import '../../assets/styles/component/footer.css';

import Header from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
const faqData = [
  {
    question: "How do I find the right lawyer for my case?",
    answer:
      "You can search based on specialization, location, and reviews. Our platform matches you with lawyers who best fit your legal needs."
  },
  {
    question: "Is it free to use the Lawyer Finder website?",
    answer:
      "Yes, searching and browsing lawyer profiles is completely free. Some lawyers may offer free consultations, while others may charge a fee."
  },
  {
    question: "Can I contact a lawyer directly through the platform?",
    answer:
      "Absolutely. Once you find a lawyer you like, you can send them a direct message or request a consultation through our secure messaging system."
  },
  {
    question: "Are the lawyers verified?",
    answer:
      "Yes, all lawyers on our platform go through a verification process to confirm their licensing and credentials."
  }
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
   <>
   <Header />
    <section className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-container">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
          >
            <div
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span className="faq-toggle">
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
    <Footer />
   </> 
   
  );
}

export default FAQ;
