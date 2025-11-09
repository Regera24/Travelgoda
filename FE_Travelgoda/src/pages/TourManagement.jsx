// src/pages/TourManagement.jsx
import React, { useEffect, useState } from 'react';
import { Button } from '../components';
import API_ENDPOINTS from '../config/api';
import './TourManagement.css';

const STATUS_OPTIONS = ['PUBLISHED', 'UNPUBLISHED'];

const TourManagement = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState('');
    const [error, setError] = useState('');
    const [savingId, setSavingId] = useState(null);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                const res = await fetch(API_ENDPOINTS.admin.tourList);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setTours(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
                setError('Không tải được danh sách tour.');
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    const filtered = tours.filter(t =>
        (t.name || '').toLowerCase().includes(q.toLowerCase())
    );

    const handleChangeStatus = async (tour, newStatusRaw) => {
        if (!tour?.id) {
            alert('Thiếu ID tour trong dữ liệu trả về. Hãy thêm id vào TourDTO ở backend.');
            return;
        }
        const newStatus = String(newStatusRaw).toUpperCase(); // gửi đúng ENUM server

        // lưu bản sao để rollback nếu lỗi
        const prev = [...tours];

        // optimistic update
        setTours(tours.map(t => t.id === tour.id ? { ...t, status: newStatus } : t));
        setSavingId(tour.id);

        try {
            const url = API_ENDPOINTS.admin.tourChangeStatus(tour.id, newStatus);
            const res = await fetch(url, { method: 'PATCH' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

        } catch (err) {
            console.error(err);
            alert('Cập nhật trạng thái thất bại. Khôi phục lại giá trị cũ.');
            setTours(prev); // rollback
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="tmn-page">
            <div className="tmn-header">
                <div className="tmn-actions">
                    <input
                        className="tmn-search"
                        placeholder="Tìm theo tên tour…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
            </div>

            {loading && <p>Đang tải…</p>}
            {error && <p className="tmn-error">{error}</p>}

            {!loading && !error && (
                <div className="tmn-table-wrapper">
                    <table className="tmn-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ProviderId</th>
                                <th>CategoryId</th>
                                <th>Tên tour</th>
                                <th>Mô tả</th>
                                <th>Loại tour</th>
                                <th>Thời lượng (days)</th>
                                <th>Trạng thái</th>
                                <th>Cập nhật trạng thái</th>
                                <th>CreatedAt</th>
                                <th>UpdatedAt</th>
                                <th>Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((t) => (
                                <tr key={t.id ?? `${t.name}-${t.categoryId}`}>
                                    <td>{t.id ?? '—'}</td>
                                    <td>{t.tourProvider_Id}</td>
                                    <td>{t.categoryId}</td>
                                    <td className="tmn-strong">{t.name}</td>
                                    <td className="tmn-desc">
                                        {(t.description || '').length > 80
                                            ? `${t.description.slice(0, 80)}…`
                                            : t.description}
                                    </td>
                                    <td>{t.tourType}</td>
                                    <td>{t.durationDays}</td>
                                    <td>
                                        <span className={`tmn-status ${String(t.status).toLowerCase()}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <select
                                                value={t.status}
                                                onChange={(e) => handleChangeStatus(t, e.target.value)}
                                                disabled={savingId === t.id}
                                            >
                                                {STATUS_OPTIONS.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                            {savingId === t.id && <small>Đang lưu…</small>}
                                        </div>
                                    </td>
                                    <td>{t.createdAt?.replace('T', ' ').slice(0, 19)}</td>
                                    <td>{t.updatedAt?.replace('T', ' ').slice(0, 19)}</td>
                                    <td>{((t.price ?? t.tourPrice) || 0).toLocaleString('vi-VN')}</td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={12} style={{ textAlign: 'center', padding: 16 }}>
                                        Không có tour phù hợp
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TourManagement;
