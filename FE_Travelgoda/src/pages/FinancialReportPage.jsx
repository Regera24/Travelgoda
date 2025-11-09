import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FileText, Calendar, TrendingUp, TrendingDown, Users, DollarSign, AlertCircle, Download } from 'lucide-react';
import reportService from '../services/reportService';
import './FinancialReportPages.css';

const FinancialReportPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState(null);
  const [reportHistory, setReportHistory] = useState([]);

  const [formData, setFormData] = useState({
    reportType: 'MONTHLY',
    startDate: '',
    endDate: '',
    title: '',
    notes: '',
  });

  useEffect(() => {
    loadReportHistory();
  }, [loadReportHistory]);

  const loadReportHistory = useCallback(async () => {
    if (!user?.id) return;

    try {
      const userId = user.id || 1; // Default to 1 for demo
      const result = await reportService.getReportsByUser(userId);

      if (result.success) {
        setReportHistory(result.data);
      }
    } catch (error) {
      console.error('Failed to load report history:', error);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate dates
      if (!formData.startDate || !formData.endDate) {
        setError('Vui lòng chọn ngày bắt đầu và kết thúc');
        setLoading(false);
        return;
      }

      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        setError('Ngày bắt đầu phải trước ngày kết thúc');
        setLoading(false);
        return;
      }

      const reportRequest = {
        reportType: formData.reportType,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        title: formData.title || `${formData.reportType} Report`,
        notes: formData.notes,
      };

      const result = await reportService.generateReport(reportRequest);

      if (result.success) {
        setReportData(result.data);
        loadReportHistory(); // Refresh history
        setError('');
      } else {
        setError(result.message || 'Không thể tạo báo cáo');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tạo báo cáo');
      console.error('Generate report error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistoryReport = async (reportId) => {
    setLoading(true);
    setError('');

    try {
      const result = await reportService.getReportById(reportId);

      if (result.success) {
        setReportData(result.data);
        setError('');
      } else {
        setError(result.message || 'Không thể tải báo cáo');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tải báo cáo');
      console.error('Load report error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="financial-report-page">
      <div className="report-container">
        {/* Page Header */}
        <div className="report-page-header">
          <h1><FileText size={32} style={{ display: 'inline', marginRight: '0.5rem' }} />Báo Cáo Tài Chính</h1>
          <p>Tạo và quản lý các báo cáo tài chính cho hệ thống</p>
        </div>

        {/* Generate Report Form */}
        <div className="report-form-section">
          <h2 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>Tạo Báo Cáo Mới</h2>

          {error && (
            <div className="error-alert">
              <AlertCircle size={20} />
              <span className="error-message">{error}</span>
            </div>
          )}

          <form onSubmit={handleGenerateReport}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="reportType">Loại báo cáo</label>
                <select
                  id="reportType"
                  name="reportType"
                  value={formData.reportType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="DAILY">Theo ngày</option>
                  <option value="WEEKLY">Theo tuần</option>
                  <option value="MONTHLY">Theo tháng</option>
                  <option value="QUARTERLY">Theo quý</option>
                  <option value="YEARLY">Theo năm</option>
                  <option value="CUSTOM">Tùy chỉnh</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Ngày bắt đầu</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">Ngày kết thúc</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="title">Tiêu đề báo cáo</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Báo cáo tháng 12/2024"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="notes">Ghi chú</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Thêm ghi chú cho báo cáo..."
              />
            </div>

            <button
              type="submit"
              className="generate-button"
              disabled={loading}
            >
              <FileText size={20} />
              {loading ? 'Đang tạo báo cáo...' : 'Tạo Báo Cáo'}
            </button>
          </form>
        </div>

        {/* Display Report */}
        {reportData && (
          <div className="report-display-section">
            <div className="report-header">
              <h2 className="report-title">{reportData.title}</h2>
              <div className="report-meta">
                <span><Calendar size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  {formatDate(reportData.startDate)} - {formatDate(reportData.endDate)}
                </span>
                <span>Loại: {reportData.reportType}</span>
                <span>Tạo bởi: {reportData.generatedByUsername}</span>
                <span>Ngày tạo: {formatDateTime(reportData.createdAt)}</span>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">
              <div className="summary-card revenue">
                <div className="card-label">Tổng Doanh Thu</div>
                <div className="card-value">{formatCurrency(reportData.totalRevenue)}</div>
                <div className="card-subvalue">
                  <TrendingUp size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Từ {reportData.totalBookings} booking
                </div>
              </div>

              <div className="summary-card expense">
                <div className="card-label">Tổng Chi Phí</div>
                <div className="card-value">{formatCurrency(reportData.totalExpense)}</div>
              </div>

              <div className="summary-card profit">
                <div className="card-label">Lợi Nhuận Ròng</div>
                <div className="card-value">{formatCurrency(reportData.netProfit)}</div>
                <div className="card-subvalue">
                  {reportData.netProfit >= 0 ? (
                    <TrendingUp size={16} style={{ display: 'inline', marginRight: '0.25rem', color: '#10b981' }} />
                  ) : (
                    <TrendingDown size={16} style={{ display: 'inline', marginRight: '0.25rem', color: '#ef4444' }} />
                  )}
                  {reportData.netProfit >= 0 ? 'Lãi' : 'Lỗ'}
                </div>
              </div>

              <div className="summary-card bookings">
                <div className="card-label">Khách Hàng</div>
                <div className="card-value">{reportData.totalCustomers}</div>
                <div className="card-subvalue">
                  <Users size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  {reportData.totalBookings} đơn đặt
                </div>
              </div>
            </div>

            {/* Statistics */}
            {reportData.summary && (
              <div className="statistics-section">
                <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Thống Kê Chi Tiết</h3>
                <div className="statistics-grid">
                  <div className="stat-item">
                    <div className="stat-label">Giá trị TB/Booking</div>
                    <div className="stat-value">{formatCurrency(reportData.summary.averageBookingValue)}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Hoàn thành</div>
                    <div className="stat-value">{reportData.summary.completedBookings}</div>
                    <span className="stat-badge success">{reportData.summary.completionRate?.toFixed(1)}%</span>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Hủy bỏ</div>
                    <div className="stat-value">{reportData.summary.cancelledBookings}</div>
                    <span className="stat-badge danger">{reportData.summary.cancellationRate?.toFixed(1)}%</span>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Chờ xử lý</div>
                    <div className="stat-value">{reportData.summary.pendingBookings}</div>
                    <span className="stat-badge warning">Pending</span>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Table */}
            {reportData.transactions && reportData.transactions.length > 0 && (
              <div className="transactions-section">
                <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Chi Tiết Giao Dịch</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>Mã Booking</th>
                        <th>Ngày</th>
                        <th>Khách Hàng</th>
                        <th>Tour</th>
                        <th>Số Người</th>
                        <th>Số Tiền</th>
                        <th>Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.transactions.map((transaction) => (
                        <tr key={transaction.bookingId}>
                          <td>{transaction.bookingReference}</td>
                          <td>{formatDate(transaction.bookingDate)}</td>
                          <td>{transaction.customerName}</td>
                          <td>{transaction.tourName}</td>
                          <td>{transaction.numberOfPeople}</td>
                          <td>{formatCurrency(transaction.amount)}</td>
                          <td>
                            <span className={`status-badge ${transaction.bookingStatus?.toLowerCase()}`}>
                              {transaction.bookingStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {reportData.notes && (
              <div style={{ marginTop: '2rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>Ghi Chú</h4>
                <p style={{ color: '#6b7280' }}>{reportData.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Report History */}
        {reportHistory.length > 0 && (
          <div className="history-section">
            <h2 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>Lịch Sử Báo Cáo</h2>
            <div className="history-list">
              {reportHistory.map((report) => (
                <div
                  key={report.id}
                  className="history-item"
                  onClick={() => handleViewHistoryReport(report.id)}
                >
                  <div className="history-item-header">
                    <div className="history-item-title">{report.title}</div>
                    <div className="history-item-date">{formatDateTime(report.createdAt)}</div>
                  </div>
                  <div className="history-item-details">
                    <div className="history-detail">
                      <span className="history-detail-label">Loại</span>
                      <span className="history-detail-value">{report.reportType}</span>
                    </div>
                    <div className="history-detail">
                      <span className="history-detail-label">Doanh Thu</span>
                      <span className="history-detail-value">{formatCurrency(report.totalRevenue)}</span>
                    </div>
                    <div className="history-detail">
                      <span className="history-detail-label">Lợi Nhuận</span>
                      <span className="history-detail-value">{formatCurrency(report.netProfit)}</span>
                    </div>
                    <div className="history-detail">
                      <span className="history-detail-label">Booking</span>
                      <span className="history-detail-value">{report.totalBookings}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!reportData && !loading && reportHistory.length === 0 && (
          <div className="empty-state">
            <FileText size={64} />
            <h3>Chưa có báo cáo</h3>
            <p>Tạo báo cáo đầu tiên của bạn bằng form bên trên</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialReportPage;
