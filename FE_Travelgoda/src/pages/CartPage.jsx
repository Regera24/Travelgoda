import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button, Card } from '../components';
import { useCart } from '../hooks';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="empty-cart">
            <ShoppingBag size={80} color="#dee2e6" />
            <h2>Giỏ hàng trống</h2>
            <p>Bạn chưa có tour nào trong giỏ hàng</p>
            <Button size="large" onClick={() => navigate('/tours')}>
              Khám Phá Tour
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Giỏ Hàng</h1>
          <p>{cartItems.length} tour</p>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <Card key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image || item.images?.[0]} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-location">{item.location}</p>
                  <p className="item-duration">{item.duration}</p>
                </div>
                <div className="item-quantity">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="qty-value">{item.quantity || 1}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="item-price">
                  <span className="price-value">
                    {(item.price * (item.quantity || 1)).toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={20} />
                </button>
              </Card>
            ))}
          </div>

          <aside className="cart-summary">
            <Card>
              <h3 className="summary-title">Tổng Đơn Hàng</h3>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Tạm tính</span>
                  <span>{getCartTotal().toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="summary-row">
                  <span>Thuế & Phí</span>
                  <span>0đ</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Tổng cộng</span>
                  <span>{getCartTotal().toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="large"
                fullWidth
                onClick={() => navigate('/checkout')}
              >
                Tiến Hành Thanh Toán
              </Button>

              <button className="clear-cart-btn" onClick={clearCart}>
                Xóa giỏ hàng
              </button>
            </Card>

            <div className="cart-note">
              <p>✓ Miễn phí hủy trong 24h</p>
              <p>✓ Hỗ trợ 24/7</p>
              <p>✓ Thanh toán an toàn</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
