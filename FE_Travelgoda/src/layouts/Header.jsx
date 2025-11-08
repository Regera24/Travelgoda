import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  User, 
  Heart, 
  ShoppingCart, 
  Menu, 
  X,
  LogOut,
  Settings,
  BookmarkIcon
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import Button from '../components/Button';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount, wishlist } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tours?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <div className="logo-icon">TG</div>
          <span className="logo-text">TravelGoda</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          <Link to="/tours" className="nav-link">Tour Du Lịch</Link>
          <Link to="/destinations" className="nav-link">Điểm Đến</Link>
          <Link to="/about" className="nav-link">Về Chúng Tôi</Link>
          <Link to="/contact" className="nav-link">Liên Hệ</Link>
        </nav>

        {/* Search Bar */}
        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm tour du lịch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <Search size={20} />
          </button>
        </form>

        {/* Actions */}
        <div className="header-actions">
          {/* Wishlist */}
          <Link to="/wishlist" className="action-button">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="action-badge">{wishlist.length}</span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="action-button">
            <ShoppingCart size={20} />
            {getCartCount() > 0 && (
              <span className="action-badge">{getCartCount()}</span>
            )}
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="user-menu">
              <button
                className="action-button user-button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User size={20} />
              </button>
              
              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-name">{user?.fullName || user?.email}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <User size={16} />
                    Tài Khoản
                  </Link>
                  <Link to="/bookings" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <BookmarkIcon size={16} />
                    Đặt Chỗ Của Tôi
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <Settings size={16} />
                    Cài Đặt
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <LogOut size={16} />
                    Đăng Xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Button variant="ghost" size="small" onClick={() => navigate('/login')}>
                Đăng Nhập
              </Button>
              <Button variant="primary" size="small" onClick={() => navigate('/register')}>
                Đăng Ký
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <Link to="/tours" className="mobile-nav-link" onClick={toggleMobileMenu}>
              Tour Du Lịch
            </Link>
            <Link to="/destinations" className="mobile-nav-link" onClick={toggleMobileMenu}>
              Điểm Đến
            </Link>
            <Link to="/about" className="mobile-nav-link" onClick={toggleMobileMenu}>
              Về Chúng Tôi
            </Link>
            <Link to="/contact" className="mobile-nav-link" onClick={toggleMobileMenu}>
              Liên Hệ
            </Link>
          </nav>
          
          {!isAuthenticated && (
            <div className="mobile-auth-buttons">
              <Button variant="outline" fullWidth onClick={() => {
                navigate('/login');
                toggleMobileMenu();
              }}>
                Đăng Nhập
              </Button>
              <Button variant="primary" fullWidth onClick={() => {
                navigate('/register');
                toggleMobileMenu();
              }}>
                Đăng Ký
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
