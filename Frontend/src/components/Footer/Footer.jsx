import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="footer" id='footer'>
      <div className="footer-content">
        <div className="footer-section footer-logo">
          <img src={assets.logo} alt="Logo" />
        </div>
        <div className="footer-section footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#explore-menu">Menu</a></li>
            <li><a href="#app-download">App-Download</a></li>
            <li><a href="#footer">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-section footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://www.linkedin.com">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
            <a href="https://www.facebook.com">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a href="https://www.twitter.com">
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
          </div>
        </div>
        <div className="footer-section footer-contact">
          <h4>Contact Us</h4>
          <p>Email: roshanbhalaji5@gmail.com</p> emailto
          <p>Phone: 9655035643</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Roshan.</p>
      </div>
    </footer>
  );
};

export default Footer;
