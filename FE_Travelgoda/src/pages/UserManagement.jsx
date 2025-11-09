import React, { useEffect, useState } from 'react';
import API_ENDPOINTS from '../config/api';
import { Button } from '../components';
import { Modal, Form, Input, Select, message } from 'antd';
import './TourManagement.css'; // tái dùng style bảng
import './UserManagement.css';

const { Option } = Select;
// Hai trạng thái bạn mong muốn hiển thị/sửa
const STATUS_OPTIONS = ['ACTIVE', 'SUSPENDED'];

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [error, setError] = useState('');

    // Modal
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    // Load list
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await fetch(API_ENDPOINTS.users.list);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setUsers(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
                setError('Không tải được danh sách khách hàng.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filtered = users.filter(u =>
        (u.username || '').toLowerCase().includes(q.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(q.toLowerCase())
    );

    // Mở modal cập nhật
    const openEdit = (user) => {
        setEditing(user);
        form.setFieldsValue({
            id: user.id,
            username: user.username || '',
            email: user.email || '',
            status: user.status || 'ACTIVE',
        });
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
        setEditing(null);
        form.resetFields();
    };

    // Lưu từ Modal (PUT /api/users/{id})
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const id = values.id;
            setSavingId(id);

            // optimistic update
            const prev = [...users];
            setUsers(users.map(u => (u.id === id ? { ...u, ...values } : u)));

            const res = await fetch(API_ENDPOINTS.users.update(id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    id,
                    username: values.username,
                    email: values.email,
                    status: values.status,
                }),
            });

            if (!res.ok) {
                setUsers(prev); // rollback
                throw new Error(`HTTP ${res.status}`);
            }

            message.success('Cập nhật khách hàng thành công');
            closeModal();
        } catch (err) {
            if (err?.errorFields) {
                // lỗi validate của antd form
                return;
            }
            console.error(err);
            message.error('Cập nhật thất bại');
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
                        placeholder="Tìm theo username hoặc email…"
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
                                <th style={{ width: 60 }}>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Trạng thái</th>
                                {/* <th>Đổi trạng thái nhanh</th> */}
                                <th>CreatedAt</th>
                                <th>UpdatedAt</th>
                                <th style={{ width: 110 }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr key={u.id ?? u.email}>
                                    <td>{u.id ?? '—'}</td>
                                    <td className="tmn-strong">{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`tmn-status ${String(u.status).toLowerCase()}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    {/* <td>
                    <Select
                      size="small"
                      value={u.status}
                      style={{ minWidth: 140 }}
                      onChange={(val) => handleQuickStatusChange(u, val)}
                      disabled={savingId === u.id}
                      options={STATUS_OPTIONS.map(s => ({ value: s, label: s }))}
                    />
                    {savingId === u.id && <small style={{marginLeft: 8}}>Đang lưu…</small>}
                  </td> */}
                                    <td>{u.createdAt?.replace('T', ' ').slice(0, 19)}</td>
                                    <td>{u.updatedAt?.replace('T', ' ').slice(0, 19)}</td>
                                    <td>
                                        <Button variant="primary" onClick={() => openEdit(u)}>
                                            Cập nhật
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: 16 }}>
                                        Không có khách hàng phù hợp
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal antd */}
            <Modal
                title="Cập nhật khách hàng"
                open={open}
                onOk={handleSave}
                onCancel={closeModal}
                okText={savingId === editing?.id ? 'Đang lưu…' : 'Lưu'}
                okButtonProps={{ disabled: savingId === editing?.id, loading: savingId === editing?.id }}
                cancelText="Hủy"
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ status: 'ACTIVE' }}
                >
                    <Form.Item label="ID" name="id">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập username' }]}
                    >
                        <Input placeholder="Nhập username" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item label="Trạng thái" name="status">
                        <Select>
                            {STATUS_OPTIONS.map(s => (
                                <Option key={s} value={s}>{s}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;
