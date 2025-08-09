function Footer(){
return(
    <footer>
        <div className="footer-container">
            <div className="footer-section-about">
         <h2>About Us</h2>
        <p>© 2025 Legal Tech. All rights reserved.</p>
            </div>
            <div className="footer-section-links">
                <h2>Quick Links</h2>
                <ul>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/about">About</a>
                    </li>
                    <li>
                        <a href="/contact">Contact</a>
                    </li>
                </ul>
            </div>
            <div className="footer-section-contact">
                <h2>Contact Us</h2>
                <p>email:  <a href="">support@example.com</a></p>
                <p>Phone: <a href="+251-914-792-331">+251-914-792-331</a></p>
                <p>Address: Addis Ababa, Ethiopia</p>
            </div>
            <div className="footer-section-social">
                <h2>Follow Us</h2>
                <div className="social-icons">
                    <ul>
                        <li><a href="https://facebook.com/example">Facebook</a></li>
                        <li><a href="https://teitter.com/example">Twitter</a></li>
                        <li><a href="https://linkedin.com/example">Linkedin</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
);
}
export default Footer