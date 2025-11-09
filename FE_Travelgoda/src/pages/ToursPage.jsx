import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  DollarSign,
  ChevronDown,
  X,
  Heart
} from 'lucide-react';
import { Button, Card, Input } from '../components';
import { useCart } from '../hooks';
import './ToursPage.css';
import API_ENDPOINTS from '../config/api';

const ToursPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToWishlist, isInWishlist } = useCart();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    destination: searchParams.get('destination') || '',
    priceRange: '',
    duration: '',
    rating: '',
    category: '',
  });
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - sẽ được thay bằng API calls
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetch(API_ENDPOINTS.tours.list, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          // Hardcode ảnh cho mỗi tour
          const toursWithImages = data.data.content.map(tour => ({
            ...tour,
            image: tour.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
          }));
          setTours(toursWithImages);
        }
      })
      .catch((error) => console.error("Error fetching tours:", error))
  }, []);


  const categories = [
    { value: '', label: 'Tất cả' },
    { value: 'beach', label: 'Biển đảo' },
    { value: 'nature', label: 'Thiên nhiên' },
    { value: 'cultural', label: 'Văn hóa' },
    { value: 'city', label: 'Thành phố' },
    { value: 'adventure', label: 'Phiêu lưu' },
  ];

  const priceRanges = [
    { value: '', label: 'Tất cả mức giá' },
    { value: '0-3000000', label: 'Dưới 3 triệu' },
    { value: '3000000-5000000', label: '3 - 5 triệu' },
    { value: '5000000-10000000', label: '5 - 10 triệu' },
    { value: '10000000+', label: 'Trên 10 triệu' },
  ];

  const durations = [
    { value: '', label: 'Tất cả thời gian' },
    { value: '1-2', label: '1-2 ngày' },
    { value: '3-4', label: '3-4 ngày' },
    { value: '5-7', label: '5-7 ngày' },
    { value: '7+', label: 'Trên 7 ngày' },
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      destination: '',
      priceRange: '',
      duration: '',
      rating: '',
      category: '',
    });
    setSearchQuery('');
  };

  const handleWishlist = (e, tour) => {
    e.stopPropagation();
    addToWishlist(tour);
  };

  return (
    <div className="tours-page">
      <div className="tours-container">
        {/* Search & Filter Bar */}
        <div className="search-filter-bar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm tour..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Bộ Lọc
          </button>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popularity">Phổ biến nhất</option>
            <option value="price-low">Giá thấp đến cao</option>
            <option value="price-high">Giá cao đến thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>

        <div className="tours-layout">
          {/* Sidebar Filters */}
          <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Bộ Lọc</h3>
              <button onClick={() => setShowFilters(false)} className="close-filters">
                <X size={20} />
              </button>
            </div>

            <div className="filter-group">
              <label className="filter-label">Điểm đến</label>
              <Input
                icon={<MapPin size={18} />}
                placeholder="Nhập điểm đến..."
                value={filters.destination}
                onChange={(e) => handleFilterChange('destination', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Danh mục</label>
              <div className="filter-options">
                {categories.map(cat => (
                  <label key={cat.value} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={filters.category === cat.value}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Mức giá</label>
              <select
                className="filter-select"
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Thời gian</label>
              <select
                className="filter-select"
                value={filters.duration}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
              >
                {durations.map(dur => (
                  <option key={dur.value} value={dur.value}>
                    {dur.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Đánh giá</label>
              <div className="rating-filter">
                {[5, 4, 3].map(rating => (
                  <label key={rating} className="rating-option">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === String(rating)}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                    />
                    <div className="rating-stars">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} size={16} fill="#ffa500" color="#ffa500" />
                      ))}
                      <span>trở lên</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              fullWidth
              onClick={clearFilters}
            >
              Xóa Bộ Lọc
            </Button>
          </aside>

          {/* Tours List */}
          <div className="tours-list">
            <div className="tours-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p className="tours-count">
                Tìm thấy <strong>{tours
                  .filter(tour => tour.status === 'PUBLISHED')
                  .filter(tour => {
                    if (searchQuery) {
                      return tour.name.toLowerCase().includes(searchQuery.toLowerCase());
                    }
                    return true;
                  }).length}</strong> tour
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/admin/manage')}
                style={{ marginLeft: '10px' }}

              >
                Quản lý Tour
              </Button>
            </div>

            <div className="tours-grid">
              {tours
                .filter(tour => tour.status === 'PUBLISHED')
                .filter(tour => {
                  // Tìm kiếm theo tên tour (không phân biệt hoa thường)
                  if (searchQuery) {
                    return tour.name.toLowerCase().includes(searchQuery.toLowerCase());
                  }
                  return true;
                })
                .sort((a, b) => {
                  // Sắp xếp theo tiêu chí đã chọn
                  switch (sortBy) {
                    case 'price-low':
                      return a.tourPrice - b.tourPrice;
                    case 'price-high':
                      return b.tourPrice - a.tourPrice;
                    case 'rating':
                      return b.averageRating - a.averageRating;
                    case 'newest':
                      return new Date(b.createdAt) - new Date(a.createdAt);
                    case 'popularity':
                    default:
                      return b.reviews - a.reviews; // Sắp xếp theo số lượng đánh giá
                  }
                })
                .map((tour) => (
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
                      {tour.featured && <div className="tour-badge">Nổi Bật</div>}
                      <button
                        className={`wishlist-btn ${isInWishlist(tour.id) ? 'active' : ''}`}
                        onClick={(e) => handleWishlist(e, tour)}
                      >
                        <Heart size={20} fill={isInWishlist(tour.id) ? '#ef4444' : 'none'} />
                      </button>
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
                          <span>{tour.averageRating}</span>
                          <span className="reviews">({tour.reviews})</span>
                        </div>
                        <div className="tour-duration">
                          <Clock size={16} />
                          <span>{tour.durationDays} ngày</span>
                        </div>
                      </div>
                      <div className="tour-footer">
                        <div className="tour-price">
                          <span className="price-label">Từ</span>
                          <span className="price-value">
                            {tour.tourPrice.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                        <Button
                          variant="primary"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tours/${tour.id}`);
                          }}
                        >
                          Xem Chi Tiết
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button className="pagination-btn">Trước</button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">2</button>
              <button className="pagination-btn">3</button>
              <button className="pagination-btn">Sau</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToursPage;
