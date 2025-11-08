import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { SOCIAL_LINKS, CONTACT_INFO } from '../config/constants';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Top */}
        <div className="footer-top">
          {/* Company Info */}
          <div className="footer-column">
            <div className="footer-logo">
              <div className="logo-icon">TG</div>
              <span className="logo-text">TravelGoda</span>
            </div>
            <p className="footer-description">
              Nền tảng đặt tour du lịch trực tuyến hàng đầu Việt Nam. 
              Khám phá thế giới cùng chúng tôi với những trải nghiệm tuyệt vời nhất.
            </p>
            <div className="footer-social">
              <a href={SOCIAL_LINKS.FACEBOOK} target="_blank" rel="noopener noreferrer" className="social-link">
                <Facebook size={20} />
              </a>
              <a href={SOCIAL_LINKS.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="social-link">
                <Instagram size={20} />
              </a>
              <a href={SOCIAL_LINKS.TWITTER} target="_blank" rel="noopener noreferrer" className="social-link">
                <Twitter size={20} />
              </a>
              <a href={SOCIAL_LINKS.YOUTUBE} target="_blank" rel="noopener noreferrer" className="social-link">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3 className="footer-heading">Khám Phá</h3>
            <ul className="footer-links">
              <li><Link to="/tours">Tour Du Lịch</Link></li>
              <li><Link to="/destinations">Điểm Đến</Link></li>
              <li><Link to="/deals">Ưu Đãi</Link></li>
              <li><Link to="/blog">Blog Du Lịch</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h3 className="footer-heading">Công Ty</h3>
            <ul className="footer-links">
              <li><Link to="/about">Về Chúng Tôi</Link></li>
              <li><Link to="/careers">Tuyển Dụng</Link></li>
              <li><Link to="/partners">Đối Tác</Link></li>
              <li><Link to="/contact">Liên Hệ</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h3 className="footer-heading">Hỗ Trợ</h3>
            <ul className="footer-links">
              <li><Link to="/help">Trung Tâm Trợ Giúp</Link></li>
              <li><Link to="/faq">Câu Hỏi Thường Gặp</Link></li>
              <li><Link to="/booking-guide">Hướng Dẫn Đặt Tour</Link></li>
              <li><Link to="/payment-methods">Phương Thức Thanh Toán</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h3 className="footer-heading">Liên Hệ</h3>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} />
                <span>{CONTACT_INFO.ADDRESS}</span>
              </li>
              <li>
                <Phone size={18} />
                <span>{CONTACT_INFO.HOTLINE}</span>
              </li>
              <li>
                <Mail size={18} />
                <span>{CONTACT_INFO.EMAIL}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} TravelGoda. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/terms">Điều Khoản Sử Dụng</Link>
              <span className="separator">•</span>
              <Link to="/privacy">Chính Sách Bảo Mật</Link>
              <span className="separator">•</span>
              <Link to="/cookies">Chính Sách Cookie</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
