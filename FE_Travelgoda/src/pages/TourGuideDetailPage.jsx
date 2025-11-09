import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  Calendar,
  Star,
  AlertCircle,
  User,
  Package,
  FileText
} from 'lucide-react';
import { Loading, Card } from '../components';
import tourService from '../services/tourService';
import { useAuth } from '../hooks';
import './TourGuidePages.css';

const TourGuideDetailPage = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTourInfo = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // Get guide ID from URL params or user data
      const guideId = searchParams.get('guideId') || user?.id || 1;

      const result = await tourService.getTourInfoForGuide(tourId, guideId);

      if (result.success && result.data) {
        setTour(result.data);
      } else {
        setError(result.message || 'Không thể tải thông tin tour');
      }
    } catch (err) {
      console.error('Load tour info error:', err);
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [tourId, searchParams, user?.id]);

  useEffect(() => {
    loadTourInfo();
  }, [loadTourInfo]);

  const handleBack = () => {
    navigate('/tour-guide/tours');
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (error || !tour) {
    return (
      <div className="tour-guide-page">
        <div className="tour-guide-container">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={20} />
            Quay lại
          </button>

          <div className="error-container">
            <AlertCircle size={24} />
            <span className="error-message">
              {error || 'Không tìm thấy thông tin tour hoặc bạn không có quyền truy cập tour này.'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tour-guide-page">
      <div className="tour-guide-container">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={20} />
          Quay lại danh sách
        </button>

        <div className="page-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1>{tour.tourName}</h1>
              <p>Thông tin chi tiết về chuyến đi</p>
            </div>
            <span className={`tour-status ${getStatusClass(tour.status)}`}>
              {getStatusText(tour.status)}
            </span>
          </div>
        </div>

        {/* Basic Information */}
        <div className="tour-detail-section">
          <h2 className="section-title">Thông tin cơ bản</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Mã Tour</span>
              <span className="detail-value large">#{tour.tourId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Thời gian</span>
              <span className="detail-value">
                <Clock size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                {tour.durationDays} ngày
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Số người tối đa</span>
              <span className="detail-value">
                <Users size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                {tour.groupSize} người
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Đánh giá trung bình</span>
              <div className="rating-display">
                <Star size={18} fill="#ffa500" color="#ffa500" />
                <span className="rating-value">{tour.averageRating || 0}</span>
              </div>
            </div>
          </div>

          {tour.tourType && (
            <div className="detail-grid" style={{ marginTop: '1.5rem' }}>
              <div className="detail-item">
                <span className="detail-label">Loại tour</span>
                <span className="detail-value">{tour.tourType}</span>
              </div>
              {tour.categoryName && (
                <div className="detail-item">
                  <span className="detail-label">Danh mục</span>
                  <span className="detail-value">{tour.categoryName}</span>
                </div>
              )}
              {tour.providerName && (
                <div className="detail-item">
                  <span className="detail-label">Nhà cung cấp</span>
                  <span className="detail-value">{tour.providerName}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        {tour.description && (
          <div className="tour-detail-section">
            <h2 className="section-title">Mô tả</h2>
            <p style={{ color: '#374151', lineHeight: '1.8' }}>{tour.description}</p>
          </div>
        )}

        {/* Destinations */}
        {tour.destinations && tour.destinations.length > 0 && (
          <div className="tour-detail-section">
            <h2 className="section-title">Điểm đến</h2>
            <div className="destinations-list">
              {tour.destinations.map((destination, index) => (
                <div key={index} className="destination-tag">
                  <MapPin size={16} />
                  <span>{destination}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Itinerary */}
        {tour.itinerary && (
          <div className="tour-detail-section">
            <h2 className="section-title">
              <FileText size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Lịch trình chi tiết
            </h2>
            <div className="itinerary-content">{tour.itinerary}</div>
          </div>
        )}

        {/* Schedules */}
        {tour.schedules && tour.schedules.length > 0 && (
          <div className="tour-detail-section">
            <h2 className="section-title">
              <Calendar size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Lịch khởi hành ({tour.schedules.length})
            </h2>
            <div className="schedules-list">
              {tour.schedules.map((schedule) => (
                <div key={schedule.scheduleId} className="schedule-item">
                  <div className="schedule-header">
                    <div>
                      <div className="schedule-date">
                        Ngày bắt đầu: {formatDate(schedule.startDate)}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        Ngày kết thúc: {formatDate(schedule.endDate)}
                      </div>
                    </div>
                    {schedule.guideName && (
                      <div className="schedule-guide">
                        <User size={16} />
                        <span>Hướng dẫn viên: {schedule.guideName}</span>
                      </div>
                    )}
                  </div>

                  <div className="schedule-slots">
                    <div className="slot-info">
                      <span className="slot-label">Chỗ khả dụng</span>
                      <span className="slot-value available">{schedule.availableSlots}</span>
                    </div>
                    <div className="slot-info">
                      <span className="slot-label">Đã đặt</span>
                      <span className="slot-value booked">{schedule.bookedSlots || 0}</span>
                    </div>
                    <div className="slot-info">
                      <span className="slot-label">Còn lại</span>
                      <span className="slot-value">
                        {schedule.availableSlots - (schedule.bookedSlots || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="tour-detail-section">
          <h2 className="section-title">Thông tin khác</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Ngày tạo</span>
              <span className="detail-value">{formatDate(tour.createdAt)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Cập nhật lần cuối</span>
              <span className="detail-value">{formatDate(tour.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuideDetailPage;
