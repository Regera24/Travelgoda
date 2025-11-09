import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Modal, Form, Input, InputNumber, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { API_ENDPOINTS } from '../config/api';
import './TourProviderPage.css';
import { Select } from 'antd';

const { TextArea } = Input;

const TourProviderPage = () => {
    const [tours, setTours] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    // Fetch tours on component mount
    useEffect(() => {
        fetchTours();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.tours.categories);
            const data = await response.json();
            if (data.code === 200) {
                setCategories(data.data);
            }
        } catch (error) {
            message.error('Lỗi khi tải danh mục');
        }
    };

    const fetchTours = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_ENDPOINTS.tours.list);
            const data = await response.json();
            if (data.code === 200) {
                setTours(data.data.content);
            }
        } catch (error) {
            message.error('Lỗi khi tải danh sách tour');
        } finally {
            setLoading(false);
        }
    };

    const showModal = (tour = null) => {
        setEditingTour(tour);
        if (tour) {
            form.setFieldsValue({
                name: tour.name,
                description: tour.description,
                tourPrice: tour.tourPrice,
                durationDays: tour.durationDays,
                categoryId: tour.category.id,
                groupSize: tour.groupSize
                // Add other fields as needed
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const url = editingTour
                ? API_ENDPOINTS.tours.detail(editingTour.id)
                : API_ENDPOINTS.tours.list;

            const method = editingTour ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values),
            });

            const result = await response.json();

            if (response.ok) {
                message.success(editingTour ? 'Cập nhật tour thành công' : 'Thêm tour mới thành công');
                fetchTours();
                setIsModalVisible(false);
            } else {
                throw new Error(result.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            message.error(error.message || 'Có lỗi xảy ra khi lưu tour');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const response = await fetch(API_ENDPOINTS.tours.detail(id), {
                method: 'DELETE',
                // Add authorization header if needed
                // headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                message.success('Xóa tour thành công');
                fetchTours();
            } else {
                throw new Error('Xóa tour thất bại');
            }
        } catch (error) {
            message.error(error.message || 'Có lỗi xảy ra khi xóa tour');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Price (VND)',
            dataIndex: 'tourPrice',
            key: 'price',
            render: (price) => new Intl.NumberFormat('vi-VN').format(price),
        },
        {
            title: 'Duration day',
            dataIndex: 'durationDays',
            key: 'duration',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa tour này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="tour-provider-page">
            <div className="tour-header">
                <h2>Quản lý Tour du lịch</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                >
                    Thêm tour mới
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={tours}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingTour ? 'Chỉnh sửa tour' : 'Thêm tour mới'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        name: '',
                        description: '',
                        tourPrice: 0,
                        durationDays: 1,
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Tên tour"
                        rules={[{ required: true, message: 'Vui lòng nhập tên tour' }]}
                    >
                        <Input placeholder="Nhập tên tour" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                    >
                        <TextArea rows={4} placeholder="Nhập mô tả tour" />
                    </Form.Item>

                    <Form.Item
                        name="tourPrice"
                        label="Giá (VND)"
                        rules={[{ required: true, message: 'Vui lòng nhập giá tour' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="durationDays"
                        label="Số ngày"
                        rules={[{ required: true, message: 'Vui lòng nhập số ngày' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>


                    <Form.Item
                        name="categoryId"
                        label="Danh mục"
                        rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                    >
                        <Select
                            placeholder="Chọn danh mục"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {categories.map(category => (
                                <Option key={category.id} value={category.id}>
                                    {category.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="groupSize"
                        label="Số lượng người tối đa"
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng người tối đa' }]}
                    >
                        <InputNumber
                            min={1}
                            style={{ width: '100%' }}
                            placeholder="Nhập số lượng người tối đa"
                        />
                    </Form.Item>

                    {/* Add more form fields as needed */}

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Button
                            onClick={() => setIsModalVisible(false)}
                            style={{ marginRight: 8 }}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            {editingTour ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TourProviderPage;