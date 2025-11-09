import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Headphones, RefreshCw, User, Clock, Tag, CheckCircle, AlertCircle, Inbox } from 'lucide-react';
import ticketService from '../services/ticketService';
import './CustomerSupportPages.css';

const CustomerSupportPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [unassignedTickets, setUnassignedTickets] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [assigningTicketId, setAssigningTicketId] = useState(null);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // Load unassigned tickets
      const unassignedResult = await ticketService.getUnassignedTickets();
      if (unassignedResult.success) {
        setUnassignedTickets(unassignedResult.data);
      } else {
        setError(unassignedResult.message);
      }

      // Load my assigned tickets (if user is logged in)
      if (user?.id) {
        const myTicketsResult = await ticketService.getTicketsByAgent(user.id);
        if (myTicketsResult.success) {
          setMyTickets(myTicketsResult.data);
        }
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tải dữ liệu');
      console.error('Load tickets error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleAssignTicket = async (ticketId) => {
    if (!user?.id) {
      setError('Bạn cần đăng nhập để gán phiếu hỗ trợ');
      return;
    }

    setAssigningTicketId(ticketId);
    setError('');
    setSuccess('');

    try {
      const result = await ticketService.assignTicket({
        ticketId: ticketId,
        agentId: user.id,
      });

      if (result.success) {
        setSuccess('Phiếu hỗ trợ đã được gán thành công!');
        // Reload tickets to update the lists
        await loadTickets();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Không thể gán phiếu hỗ trợ');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi gán phiếu');
      console.error('Assign ticket error:', err);
    } finally {
      setAssigningTicketId(null);
    }
  };

  const getPriorityClass = (priority) => {
    return priority ? priority.toLowerCase() : 'medium';
  };

  const getStatusClass = (status) => {
    return status ? status.toLowerCase() : 'open';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="customer-support-page">
      <div className="support-container">
        {/* Page Header */}
        <div className="support-page-header">
          <h1>
            <Headphones size={32} />
            Hỗ Trợ Khách Hàng
          </h1>
          <p>Quản lý và xử lý các phiếu hỗ trợ từ khách hàng</p>
        </div>

        {/* Stats Summary */}
        <div className="stats-summary">
          <div className="stat-card">
            <div className="stat-label">Phiếu chưa gán</div>
            <div className="stat-value">{unassignedTickets.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Phiếu của tôi</div>
            <div className="stat-value">{myTickets.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Đang xử lý</div>
            <div className="stat-value">
              {myTickets.filter(t => t.status === 'IN_PROGRESS').length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Đã giải quyết</div>
            <div className="stat-value">
              {myTickets.filter(t => t.status === 'RESOLVED').length}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="success-alert">
            <CheckCircle size={20} />
            <span className="success-message">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-alert">
            <AlertCircle size={20} />
            <span className="error-message">{error}</span>
          </div>
        )}

        {/* Unassigned Tickets Queue */}
        <div className="ticket-queue-section">
          <div className="section-header">
            <h2>Hàng Đợi Phiếu Chưa Gán</h2>
            <button
              className="refresh-button"
              onClick={loadTickets}
              disabled={loading}
            >
              <RefreshCw size={16} />
              {loading ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>

          {loading && unassignedTickets.length === 0 ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : unassignedTickets.length === 0 ? (
            <div className="empty-state">
              <Inbox size={64} />
              <h3>Không có phiếu chưa gán</h3>
              <p>Tất cả phiếu hỗ trợ đã được xử lý</p>
            </div>
          ) : (
            <div className="tickets-grid">
              {unassignedTickets.map((ticket) => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-header">
                    <span className="ticket-id">#{ticket.id}</span>
                    <span className={`priority-badge ${getPriorityClass(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>

                  <h3 className="ticket-subject">{ticket.subject}</h3>

                  <div className="ticket-meta">
                    <div className="meta-item">
                      <User size={14} />
                      <span>{ticket.customerName || 'Khách hàng'}</span>
                    </div>
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                    <div className="meta-item">
                      <Tag size={14} />
                      <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>

                  <div className="ticket-actions">
                    <button
                      className="assign-button"
                      onClick={() => handleAssignTicket(ticket.id)}
                      disabled={assigningTicketId === ticket.id}
                    >
                      <CheckCircle size={16} />
                      {assigningTicketId === ticket.id ? 'Đang gán...' : 'Nhận phiếu này'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Assigned Tickets */}
        {myTickets.length > 0 && (
          <div className="my-tickets-section">
            <div className="section-header">
              <h2>Phiếu Của Tôi</h2>
            </div>

            <div className="my-tickets-list">
              {myTickets.map((ticket) => (
                <div key={ticket.id} className="my-ticket-item">
                  <div className="my-ticket-header">
                    <div>
                      <span className="ticket-id">#{ticket.id}</span>
                      <span style={{ margin: '0 0.5rem', color: '#d1d5db' }}>•</span>
                      <span className={`priority-badge ${getPriorityClass(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>

                  <h4 className="ticket-subject" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                    {ticket.subject}
                  </h4>

                  <div className="ticket-meta">
                    <div className="meta-item">
                      <User size={14} />
                      <span>{ticket.customerName || 'Khách hàng'}</span>
                    </div>
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>Cập nhật: {formatDate(ticket.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSupportPage;
