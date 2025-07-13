import React from 'react';
import './FooterSection.css';

const FooterSection = () => {
  return (
    <div>
      {/* Our Numbers Section */}
      <section className="stats-section">
        <h2 className="section-title">Our Numbers</h2>
        <div className="stats-container">
          <div className="stat-item">
            <h3>100+</h3>
            <p>Courses</p>
          </div>
          <div className="stat-item">
            <h3>200+</h3>
            <p>Books</p>
          </div>
          <div className="stat-item">
            <h3>35+</h3>
            <p>Quizzes</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Workshops</p>
          </div>
          <div className="stat-item">
            <h3>25+</h3>
            <p>Mentors</p>
          </div>
        </div>
      </section>

      
    <footer className="site-footer">
      <div className="footer-content">
        {/* LEFT SIDE */}
        <div className="footer-left">
          <div className="footer-logo">
            {/* Replace with your SVG logo if needed */}
            <h3 className="footer-brand">Edu Platform</h3>
            <p className="footer-tagline">Built with ❤️ in India for the world</p>
          </div>

          <div className="footer-contact">
            <h4>Stay Connected</h4>

            <div className="contact-block">
              <h5>Sales Inquiries</h5>
              <p>Email: <a href="mailto:tejatanush47@gmail.com">sales@eduplatform.com</a></p>
              <p>Call: <a href="tel:+919999999999">+91-9192939495</a></p>
              <p className="note">(Mon to Fri, 9 AM to 6 PM)</p>
            </div>

            <div className="contact-block">
              <h5>Support Inquiries</h5>
              <p>Email: <a href="mailto:support@yourbrand.com">support@eduplatform.com</a></p>
            </div>

            <div className="social-icons">
              <a href="#"><span>Instagram</span></a>
              <a href="#"><span>LinkedIn</span></a>
              <a href="#"><span>Facebook</span></a>
              <a href="#"><span>Telegram</span></a>
              <a href="#"><span>Discord</span></a>
              <a href="#"><span>Twitter</span></a>
              <a href="#"><span>YouTube</span></a>
            </div>

            <div className="newsletter">
              <h5>Stay Updated</h5>
              <p>We'll send you updates on the latest opportunities to showcase your talent and get hired and rewarded regularly.</p>
              <form className="email-form">
                <input type="email" placeholder="Enter your email" required />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="footer-right">
          <div className="footer-links-grid">
            <div className="footer-column">
              <h4>Explore</h4>
              <a href="#">Home</a>
              <a href="#">Courses</a>
              <a href="#">Books</a>
              <a href="#">Quizzes</a>
              <a href="#">Chatbot</a>
            </div>
            <div className="footer-column">
              <h4>Account</h4>
              <a href="#">Login</a>
              <a href="#">Signup</a>
              <a href="#">Dashboard</a>
              <a href="#">Your Courses</a>
              <a href="#">Your Books</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact Us</a>
              <a href="#">FAQs</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#">Terms & Conditions</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Sitemap</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 YourCompanyName. All rights reserved.</p>
      </div>
    </footer>
  

    </div>
  );
};

export default FooterSection;
