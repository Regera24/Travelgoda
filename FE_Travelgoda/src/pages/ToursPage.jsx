import React, { useState, useEffect, use } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
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
import { useApi, useCart } from '../hooks';
import { Button, Card, Input } from '../components';
import './ToursPage.css';
import API_ENDPOINTS from '../config/api';

const ToursPage = () => {
  const navigate = useNavigate();
  const { addToWishlist, isInWishlist } = useCart();
  const api = useApi();

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    tourPriceFrom: 0,
    tourPriceTo: Number.MAX_SAFE_INTEGER,
    durationDays: '',
    averageRatingFrom: 0,
    averageRatingTo: 5,
    categoryId: '',
  });
  const [sortBy, setSortBy] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [tours, setTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    currentPage: 0,
    totalElements: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const guestSearchAndFilterRequest = {
          name: searchQuery,
          tourPriceFrom: filters.tourPriceFrom,
          tourPriceTo: filters.tourPriceTo,
          durationDays: filters.durationDays,
          averageRatingFrom: filters.averageRatingFrom,
          averageRatingTo: filters.averageRatingTo,
          categoryId: filters.categoryId,
        }

        const response = await api.post(API_ENDPOINTS.tours.get_tours_by_guest, guestSearchAndFilterRequest, {
          params: {
            page: pagination.currentPage,
            size: 5,
          }
        });
        
        console.log('Full response:', response);
        console.log('Response data:', response?.data);
        console.log('Page data:', response?.data?.data);
        console.log('Tours:', response?.data?.data?.content);
        
        if (response?.data?.data) {
          // Access the paginated data correctly
          const pageData = response.data.data;
          setTours(pageData.content || []);
          setPagination({
            totalPages: pageData.totalPages || 0,
            currentPage: pageData.number || 0,
            totalElements: pageData.totalElements || 0
          });
        } else {
          setTours([]);
          setPagination({
            totalPages: 0,
            currentPage: 0,
            totalElements: 0
          });
        }
      } catch (error) {
        console.error('Error fetching tours:', error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.categories.list);
        console.log('Fetched categories:', response);
        if (response?.data) {
          setCategories(response.data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

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
      name: '',
      tourPriceFrom: 0,
      tourPriceTo: Number.MAX_SAFE_INTEGER,
      durationDays: '',
      averageRatingFrom: 0,
      averageRatingTo: 5,
      categoryId: '',
    });
    setSearchQuery('');
  };

  const handleWishlist = (e, tour) => {
    e.stopPropagation();
    addToWishlist(tour);
  };

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const guestSearchAndFilterRequest = {
          name: searchQuery || filters.name, // Use searchQuery or filters.name
          tourPriceFrom: filters.tourPriceFrom,
          tourPriceTo: filters.tourPriceTo,
          durationDays: filters.durationDays,
          averageRatingFrom: filters.averageRatingFrom,
          averageRatingTo: filters.averageRatingTo,
          categoryId: filters.categoryId,
        }

        const response = await api.post(API_ENDPOINTS.tours.get_tours_by_guest, guestSearchAndFilterRequest, {
          params: {
            page: pagination.currentPage,
            size: 5,
          }
        });
        
        if (response?.data?.data) {
          const pageData = response.data.data;
          setTours(pageData.content || []);
          setPagination({
            totalPages: pageData.totalPages || 0,
            currentPage: pageData.number || 0,
            totalElements: pageData.totalElements || 0
          });
        } else {
          setTours([]);
          setPagination({
            totalPages: 0,
            currentPage: 0,
            totalElements: 0
          });
        }
      } catch (error) {
        console.error('Error fetching tours:', error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [pagination.currentPage, searchQuery, filters]); // Added required dependencies

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
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Danh mục</label>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.categoryId === ''}
                    onChange={(e) => { e.preventDefault(); handleFilterChange('categoryId', ''); }}
                  />
                  <span>Tất cả danh mục</span>
                </label>
                {categories ? categories.map(cat => (
                  <label key={cat.id} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={filters.categoryId === cat.id}
                      onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                    />
                    <span>{cat.name}</span>
                  </label>
                )) : (
                  <p>Không có danh mục nào</p>
                )}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Mức giá</label>
              <select
                className="filter-select"
                value={filters.priceRange}
                onChange={(e) => {
                  const value = e.target.value;
                  let tourPriceFrom = 0;
                  let tourPriceTo = Number.MAX_SAFE_INTEGER;
                  
                  // Parse the price range and set from/to values
                  if (value) {
                    const [from, to] = value.split('-');
                    tourPriceFrom = parseInt(from) || 0;
                    tourPriceTo = parseInt(to) || Number.MAX_SAFE_INTEGER;
                  }
                  
                  setFilters(prev => ({
                    ...prev,
                    priceRange: value,
                    tourPriceFrom,
                    tourPriceTo
                  }));
                }}
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
            <div className="tours-header">
              <p className="tours-count">
                Tìm thấy <strong>{pagination.totalElements}</strong> tour
              </p>
            </div>

            <div className="tours-grid">
              {loading ? (
                <div className="loading-state">
                  <p>Đang tải tours...</p>
                </div>
              ) : Array.isArray(tours) && tours.length > 0 ? (
                tours.map((tour) => (
                  <Card
                    key={tour.id}
                    className="tour-card"
                    hoverable
                    clickable
                    onClick={() => navigate(`/tours/${tour.id}`)}
                    padding="none"
                  >
                    <div className="tour-image">
                      <img 
                        src={`https://source.unsplash.com/random/400x300?${tour.destinations?.[0]?.name.toLowerCase() || 'travel'}`} 
                        alt={tour.name} 
                      />
                      {tour.status === 'PUBLISHED' && <div className="tour-badge">{tour.tourType}</div>}
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
                        <span>
                          {tour.destinations?.map(dest => dest.name).join(', ') || ''}
                        </span>
                      </div>
                      <h3 className="tour-name">{tour.name}</h3>
                      <div className="tour-info">
                        <div className="tour-rating">
                          <Star size={16} fill="#ffa500" color="#ffa500" />
                          <span>{tour.averageRating?.toFixed(1)}</span>
                          <span className="tour-provider">({tour.tourProvider?.companyName})</span>
                        </div>
                        <div className="tour-duration">
                          <Clock size={16} />
                          <span>{tour.durationDays} ngày</span>
                        </div>
                      </div>
                      <div className="tour-description">
                        {tour.description}
                      </div>
                      <div className="tour-footer">
                        <div className="tour-price">
                          <span className="price-label">Từ</span>
                          <span className="price-value">
                            {tour.tourPrice?.toLocaleString('vi-VN')}đ
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
                ))
              ) : (
                <div className="no-results">
                  <p>Không tìm thấy tour nào phù hợp với tiêu chí tìm kiếm</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {tours && tours.length > 0 && pagination.totalPages > 0 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 0}
                >
                  Trước
                </button>
                {Array.from({ length: pagination.totalPages || 0 }, (_, i) => (
                  <button
                    key={i}
                    className={`pagination-btn ${pagination.currentPage === i ? 'active' : ''}`}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: i }))}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages - 1}
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToursPage;
