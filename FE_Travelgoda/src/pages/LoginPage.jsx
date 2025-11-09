import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '../components';
import { useAuth } from '../hooks';
import { useForm } from '../hooks';
import { validateRequired } from '../utils/validators';
import authService from '../services/authService';
import './AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const validationRules = {
    username: (value) => validateRequired(value),
    password: (value) => validateRequired(value),
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { username: '', password: '' },
    validationRules
  );

  const onSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Call backend API
      const result = await authService.login(values.username, values.password);
      
      if (result.success && result.token) {
        // Store user data and login
        const userData = {
          username: values.username,
          role: 'customer', // Will be decoded from token in future
        };
        
        await login(userData, result.token);
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-icon">TG</div>
              <span className="logo-text">TravelGoda</span>
            </div>
            <h1>Đăng Nhập</h1>
            <p>Chào mừng bạn quay lại!</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <Input
              label="Tên đăng nhập"
              type="text"
              name="username"
              placeholder="username"
              icon={<User size={20} />}
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.username && errors.username}
              required
              fullWidth
            />

            <div className="password-field">
              <Input
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                icon={<Lock size={20} />}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
                required
                fullWidth
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            >
              Đăng Nhập
            </Button>
          </form>

          <div className="auth-divider">
            <span>Hoặc</span>
          </div>

          <div className="social-login">
            <button className="social-btn google">
              <img src="https://www.google.com/favicon.ico" alt="Google" />
              Đăng nhập với Google
            </button>
            <button className="social-btn facebook">
              <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
              Đăng nhập với Facebook
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Chưa có tài khoản?{' '}
              <Link to="/register" className="auth-link">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-image">
          <div className="auth-image-overlay">
            <h2>Khám Phá Thế Giới</h2>
            <p>Hàng nghìn điểm đến tuyệt vời đang chờ bạn khám phá</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
