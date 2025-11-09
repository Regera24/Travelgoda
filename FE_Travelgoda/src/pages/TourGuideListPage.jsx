import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, Calendar, AlertCircle, Package } from 'lucide-react';
import { Loading } from '../components';
import tourService from '../services/tourService';
import { useAuth } from '../hooks';
import './TourGuidePages.css';

const TourGuideListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTours = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // Get guide ID from user data
      // In a real app, this would come from the authenticated user's data
      const guideId = user?.id || 2; // Default to 1 for demo purposes

      const result = await tourService.getToursForGuide(guideId);

      if (result.success) {
        setTours(result.data || []);
      } else {
        setError(result.message || 'Không thể tải danh sách tour');
      }
    } catch (err) {
      console.error('Load tours error:', err);
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadTours();
  }, [loadTours]);

  const handleTourClick = (tourId) => {
    const guideId = user?.id || 1;
    navigate(`/tour-guide/tours/${tourId}?guideId=${guideId}`);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return 'published';
      case 'draft':
        return 'draft';
      case 'archived':
        return 'archived';
      default:
        return 'draft';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return 'Đã công bố';
      case 'draft':
        return 'Bản nháp';
      case 'archived':
        return 'Đã lưu trữ';
      default:
        return status || 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="tour-guide-page">
        <div className="tour-guide-container">
          <div className="loading-container">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tour-guide-page">
      <div className="tour-guide-container">
        <div className="page-header">
          <h1>Danh Sách Tour Của Tôi</h1>
          <p>Quản lý và xem thông tin các tour bạn được phân công</p>
        </div>

        {error && (
          <div className="error-container">
            <AlertCircle size={24} />
            <span className="error-message">{error}</span>
          </div>
        )}

        {tours.length === 0 && !error ? (
          <div className="empty-state">
            <Package size={64} />
            <h3>Chưa có tour nào</h3>
            <p>Bạn chưa được phân công vào tour nào. Vui lòng liên hệ quản lý để được gán tour.</p>
          </div>
        ) : (
          <div className="tours-grid">
            {tours.map((tour) => (
              <div
                key={tour.tourId}
                className="tour-card"
                onClick={() => handleTourClick(tour.tourId)}
              >
                <div className="tour-card-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 className="tour-card-title">{tour.tourName}</h3>
                    <span className={`tour-status ${getStatusClass(tour.status)}`}>
                      {getStatusText(tour.status)}
                    </span>
                  </div>

                  <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                    {tour.description?.substring(0, 120)}
                    {tour.description?.length > 120 ? '...' : ''}
                  </p>

                  <div className="tour-card-meta">
                    <div className="meta-item">
                      <Clock size={18} />
                      <span>{tour.durationDays} ngày</span>
                    </div>
                    <div className="meta-item">
                      <Users size={18} />
                      <span>Tối đa {tour.groupSize} người</span>
                    </div>
                    {tour.categoryName && (
                      <div className="meta-item">
                        <Package size={18} />
                        <span>{tour.categoryName}</span>
                      </div>
                    )}
                  </div>

                  {tour.schedules && tour.schedules.length > 0 && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                      <div className="meta-item">
                        <Calendar size={18} />
                        <span>{tour.schedules.length} lịch trình</span>
                      </div>
                    </div>
                  )}

                  {tour.destinations && tour.destinations.length > 0 && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <div className="meta-item">
                        <MapPin size={18} />
                        <span>{tour.destinations.join(', ')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TourGuideListPage;
