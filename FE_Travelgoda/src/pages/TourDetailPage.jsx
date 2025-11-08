import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Users, 
  Star,
  Calendar,
  Check,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button, Card, Input, Modal } from '../components';
import { useCart, useAuth } from '../hooks';
import './TourDetailPage.css';

const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, addToWishlist, isInWishlist } = useCart();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    adults: 1,
    children: 0,
  });

  // Mock data - sẽ được thay bằng API call
  const tour = {
    id: 1,
    name: 'Du Lịch Phú Quốc 3N2Đ - Khám Phá Đảo Ngọc',
    location: 'Phú Quốc, Kiên Giang',
    price: 3500000,
    duration: '3 ngày 2 đêm',
    rating: 4.8,
    reviews: 127,
    maxGuests: 20,
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200',
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200',
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200',
    ],
    description: 'Khám phá vẻ đẹp thiên nhiên tuyệt vời của đảo ngọc Phú Quốc với những bãi biển trong xanh, ẩm thực phong phú và những trải nghiệm không thể quên.',
    highlights: [
      'Tham quan Vinpearl Safari',
      'Khám phá Hòn Thơm',
      'Lặn ngắm san hô tại Nam Đảo',
      'Thưởng thức hải sản tươi sống',
      'Check-in cáp treo Hòn Thơm',
      'Sunset Sanato Beach Club',
    ],
    included: [
      'Vé máy bay khứ hồi',
      'Khách sạn 4 sao',
      '2 bữa sáng buffet',
      'Vé tham quan các điểm',
      'Hướng dẫn viên',
      'Bảo hiểm du lịch',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1: TP.HCM - Phú Quốc',
        activities: [
          'Khởi hành từ sân bay Tân Sơn Nhất',
          'Đến Phú Quốc, nhận phòng khách sạn',
          'Tự do khám phá phố đêm',
        ],
      },
      {
        day: 2,
        title: 'Ngày 2: Khám phá Nam Đảo',
        activities: [
          'Tham quan Hòn Thơm',
          'Lặn ngắm san hô',
          'Thưởng thức hải sản',
          'Check-in Sunset Sanato',
        ],
      },
      {
        day: 3,
        title: 'Ngày 3: Vinpearl Safari - Về TP.HCM',
        activities: [
          'Tham quan Vinpearl Safari',
          'Mua sắm đặc sản',
          'Bay về TP.HCM',
        ],
      },
    ],
  };

  const reviews = [
    {
      id: 1,
      userName: 'Nguyễn Văn A',
      rating: 5,
      date: '2024-01-15',
      comment: 'Tour rất tuyệt vời! Hướng dẫn viên nhiệt tình, lịch trình hợp lý.',
      avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A',
    },
    {
      id: 2,
      userName: 'Trần Thị B',
      rating: 4,
      date: '2024-01-10',
      comment: 'Chuyến đi đáng nhớ. Phú Quốc thật đẹp!',
      avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B',
    },
  ];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % tour.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + tour.images.length) % tour.images.length);
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/tours/${id}` } });
      return;
    }
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = () => {
    // Add to cart or direct booking
    addToCart(tour, bookingData);
    setBookingModalOpen(false);
    navigate('/checkout');
  };

  const calculateTotalPrice = () => {
    const adultsPrice = tour.price * bookingData.adults;
    const childrenPrice = (tour.price * 0.7) * bookingData.children;
    return adultsPrice + childrenPrice;
  };

  return (
    <div className="tour-detail-page">
      <div className="tour-detail-container">
        {/* Image Gallery */}
        <div className="tour-gallery">
          <div className="main-image">
            <img src={tour.images[currentImageIndex]} alt={tour.name} />
            <button className="gallery-btn prev" onClick={handlePrevImage}>
              <ChevronLeft size={24} />
            </button>
            <button className="gallery-btn next" onClick={handleNextImage}>
              <ChevronRight size={24} />
            </button>
            <div className="image-counter">
              {currentImageIndex + 1} / {tour.images.length}
            </div>
          </div>
          <div className="thumbnail-list">
            {tour.images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img src={image} alt={`${tour.name} ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="tour-detail-layout">
          {/* Main Content */}
          <div className="tour-main-content">
            {/* Tour Header */}
            <div className="tour-header">
              <h1 className="tour-title">{tour.name}</h1>
              <div className="tour-meta">
                <div className="tour-location">
                  <MapPin size={18} />
                  <span>{tour.location}</span>
                </div>
                <div className="tour-rating">
                  <Star size={18} fill="#ffa500" color="#ffa500" />
                  <span>{tour.rating}</span>
                  <span className="reviews-count">({tour.reviews} đánh giá)</span>
                </div>
              </div>
              <div className="tour-actions">
                <button 
                  className={`action-btn ${isInWishlist(tour.id) ? 'active' : ''}`}
                  onClick={() => addToWishlist(tour)}
                >
                  <Heart size={20} fill={isInWishlist(tour.id) ? '#ef4444' : 'none'} />
                  Yêu thích
                </button>
                <button className="action-btn">
                  <Share2 size={20} />
                  Chia sẻ
                </button>
              </div>
            </div>

            {/* Tour Info */}
            <Card className="tour-info-card">
              <div className="info-grid">
                <div className="info-item">
                  <Clock size={24} color="#0073e6" />
                  <div>
                    <span className="info-label">Thời gian</span>
                    <span className="info-value">{tour.duration}</span>
                  </div>
                </div>
                <div className="info-item">
                  <Users size={24} color="#0073e6" />
                  <div>
                    <span className="info-label">Số người tối đa</span>
                    <span className="info-value">{tour.maxGuests} người</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <section className="tour-section">
              <h2 className="section-title">Mô tả chuyến đi</h2>
              <p className="tour-description">{tour.description}</p>
            </section>

            {/* Highlights */}
            <section className="tour-section">
              <h2 className="section-title">Điểm nổi bật</h2>
              <div className="highlights-grid">
                {tour.highlights.map((highlight, index) => (
                  <div key={index} className="highlight-item">
                    <Check size={20} color="#10b981" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Included */}
            <section className="tour-section">
              <h2 className="section-title">Bao gồm</h2>
              <div className="included-grid">
                {tour.included.map((item, index) => (
                  <div key={index} className="included-item">
                    <Check size={18} color="#0073e6" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Itinerary */}
            <section className="tour-section">
              <h2 className="section-title">Lịch trình chi tiết</h2>
              <div className="itinerary-list">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="itinerary-day">
                    <div className="day-header">
                      <span className="day-number">Ngày {day.day}</span>
                      <h3 className="day-title">{day.title}</h3>
                    </div>
                    <ul className="activities-list">
                      {day.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="tour-section">
              <h2 className="section-title">Đánh giá ({reviews.length})</h2>
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <img src={review.avatar} alt={review.userName} className="review-avatar" />
                      <div className="review-info">
                        <h4 className="review-user">{review.userName}</h4>
                        <div className="review-rating">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} size={14} fill="#ffa500" color="#ffa500" />
                          ))}
                          <span className="review-date">{new Date(review.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          <aside className="booking-sidebar">
            <Card className="booking-card">
              <div className="price-section">
                <span className="price-label">Giá từ</span>
                <span className="price-value">{tour.price.toLocaleString('vi-VN')}đ</span>
                <span className="price-per">/ người</span>
              </div>

              <div className="booking-form">
                <div className="form-group">
                  <label>Ngày khởi hành</label>
                  <Input
                    type="date"
                    icon={<Calendar size={18} />}
                    value={bookingData.date}
                    onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Người lớn</label>
                    <select
                      value={bookingData.adults}
                      onChange={(e) => setBookingData(prev => ({ ...prev, adults: parseInt(e.target.value) }))}
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Trẻ em</label>
                    <select
                      value={bookingData.children}
                      onChange={(e) => setBookingData(prev => ({ ...prev, children: parseInt(e.target.value) }))}
                    >
                      {[0, 1, 2, 3, 4].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  size="large" 
                  fullWidth
                  onClick={handleBooking}
                >
                  Đặt Tour Ngay
                </Button>

                <p className="booking-note">
                  Bạn sẽ không bị tính phí ngay lập tức
                </p>
              </div>
            </Card>

            <div className="contact-card">
              <h3>Cần hỗ trợ?</h3>
              <p>Liên hệ với chúng tôi</p>
              <Button variant="outline" fullWidth>
                Gọi 1900-xxxx
              </Button>
            </div>
          </aside>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Xác nhận đặt tour"
        size="medium"
      >
        <div className="booking-summary">
          <h3>{tour.name}</h3>
          <div className="summary-details">
            <div className="summary-item">
              <span>Ngày khởi hành:</span>
              <strong>{bookingData.date}</strong>
            </div>
            <div className="summary-item">
              <span>Người lớn:</span>
              <strong>{bookingData.adults} x {tour.price.toLocaleString('vi-VN')}đ</strong>
            </div>
            {bookingData.children > 0 && (
              <div className="summary-item">
                <span>Trẻ em:</span>
                <strong>{bookingData.children} x {(tour.price * 0.7).toLocaleString('vi-VN')}đ</strong>
              </div>
            )}
            <div className="summary-total">
              <span>Tổng cộng:</span>
              <strong>{calculateTotalPrice().toLocaleString('vi-VN')}đ</strong>
            </div>
          </div>
        </div>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setBookingModalOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleConfirmBooking}>
            Xác Nhận Đặt Tour
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TourDetailPage;
