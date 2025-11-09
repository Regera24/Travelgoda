import React, { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  Shield
} from 'lucide-react';
import { Button, Card } from '../components';
import './HomePage.css';
import { useApi } from '../hooks';
import API_ENDPOINTS, { API_CONFIG } from '../config/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    destination: '',
    date: '',
    travelers: '',
    category: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    // Build path with query string (if any) and send the full filter object in navigation state
    const queryString = params.toString();
    const path = `/tours${queryString ? `?${queryString}` : ''}`;
    navigate(path, { state: searchParams });
  };

  // Mock data - sẽ được thay bằng API calls
  const featuredTours = [
    {
      id: 1,
      name: 'Du Lịch Phú Quốc 3N2Đ',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      location: 'Phú Quốc, Việt Nam',
      price: 3500000,
      duration: '3 ngày 2 đêm',
      rating: 4.8,
      reviews: 127,
    },
    {
      id: 2,
      name: 'Tour Hạ Long - Sapa 4N3Đ',
      image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
      location: 'Hạ Long - Sapa',
      price: 5200000,
      duration: '4 ngày 3 đêm',
      rating: 4.9,
      reviews: 203,
    },
    {
      id: 3,
      name: 'Đà Nẵng - Hội An 3N2Đ',
      image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
      location: 'Đà Nẵng - Hội An',
      price: 4200000,
      duration: '3 ngày 2 đêm',
      rating: 4.7,
      reviews: 156,
    },
    {
      id: 4,
      name: 'Bangkok - Pattaya 5N4Đ',
      image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
      location: 'Thái Lan',
      price: 8900000,
      duration: '5 ngày 4 đêm',
      rating: 4.6,
      reviews: 98,
    },
  ];

  const popularDestinations = [
    {
      id: 1,
      name: 'Phú Quốc',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
      tours: 45,
    },
    {
      id: 2,
      name: 'Đà Lạt',
      image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600',
      tours: 62,
    },
    {
      id: 3,
      name: 'Nha Trang',
      image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600',
      tours: 38,
    },
    {
      id: 4,
      name: 'Hạ Long',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600',
      tours: 54,
    },
  ];

  const features = [
    {
      icon: <Shield size={32} />,
      title: 'An Toàn & Bảo Mật',
      description: 'Đảm bảo thông tin và thanh toán an toàn tuyệt đối',
    },
    {
      icon: <Award size={32} />,
      title: 'Chất Lượng Đảm Bảo',
      description: 'Tour được kiểm duyệt kỹ lưỡng, đánh giá cao',
    },
    {
      icon: <Clock size={32} />,
      title: 'Hỗ Trợ 24/7',
      description: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng',
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Giá Tốt Nhất',
      description: 'Cam kết giá tốt nhất thị trường',
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Khám Phá Thế Giới<br />
            Cùng TravelGoda
          </h1>
          <p className="hero-subtitle">
            Trải nghiệm những chuyến đi tuyệt vời với hàng nghìn tour du lịch chất lượng cao
          </p>

          {/* Search Box */}
          <form className="hero-search-box" onSubmit={handleSearch}>
            <div className="search-field">
              <MapPin size={20} />
              <input
                type="text"
                placeholder="Bạn muốn đi đâu?"
                value={searchParams.destination}
                onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
              />
            </div>
            <div className="search-field">
              <Calendar size={20} />
              <input
                type="date"
                placeholder="Chọn ngày"
                value={searchParams.date}
                onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
              />
            </div>
            <div className="search-field">
              <Users size={20} />
              <select 
                value={searchParams.travelers} 
                onChange={(e) => setSearchParams({...searchParams, travelers: e.target.value})}
              >
                <option value="">Số người</option>
                <option value="1">1 người</option>
                <option value="2">2 người</option>
                <option value="3-5">3-5 người</option>
                <option value="6+">6+ người</option>
              </select>
            </div>
            <Button type="submit" size="large" icon={<Search size={20} />}>
              Tìm Kiếm
            </Button>
          </form>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Tour Nổi Bật</h2>
            <p className="section-subtitle">Những tour du lịch được yêu thích nhất</p>
          </div>

          <div className="tours-grid">
            {featuredTours.map((tour) => (
              <Card
                key={tour.id}
                className="tour-card"
                hoverable
                clickable
                onClick={() => navigate(`/tours/${tour.id}`)}
                padding="none"
              >
                <div className="tour-image">
                  <img src={tour.image} alt={tour.name} />
                  <div className="tour-badge">Nổi Bật</div>
                </div>
                <div className="tour-content">
                  <div className="tour-location">
                    <MapPin size={16} />
                    <span>{tour.location}</span>
                  </div>
                  <h3 className="tour-name">{tour.name}</h3>
                  <div className="tour-info">
                    <div className="tour-rating">
                      <Star size={16} fill="#ffa500" color="#ffa500" />
                      <span>{tour.rating}</span>
                      <span className="reviews">({tour.reviews} đánh giá)</span>
                    </div>
                    <div className="tour-duration">
                      <Clock size={16} />
                      <span>{tour.duration}</span>
                    </div>
                  </div>
                  <div className="tour-footer">
                    <div className="tour-price">
                      <span className="price-label">Từ</span>
                      <span className="price-value">
                        {tour.price.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <Button variant="primary" size="small">
                      Đặt Ngay
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="section-footer">
            <Button 
              variant="outline" 
              size="large"
              icon={<ArrowRight size={20} />}
              iconPosition="right"
              onClick={() => navigate('/tours')}
            >
              Xem Tất Cả Tour
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Điểm Đến Phổ Biến</h2>
            <p className="section-subtitle">Khám phá những địa điểm du lịch hấp dẫn</p>
          </div>

          <div className="destinations-grid">
            {popularDestinations.map((destination) => (
              <div
                key={destination.id}
                className="destination-card"
                onClick={() => navigate(`/tours?destination=${destination.name}`)}
              >
                <img src={destination.image} alt={destination.name} />
                <div className="destination-overlay">
                  <h3>{destination.name}</h3>
                  <p>{destination.tours} tour</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Sẵn Sàng Cho Chuyến Đi Tiếp Theo?</h2>
            <p>Đăng ký ngay để nhận ưu đãi độc quyền và cập nhật tour mới nhất</p>
            <div className="cta-buttons">
              <Button size="large" onClick={() => navigate('/register')}>
                Đăng Ký Ngay
              </Button>
              <Button variant="outline" size="large" onClick={() => navigate('/tours')}>
                Khám Phá Tour
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
