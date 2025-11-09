import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Briefcase } from 'lucide-react';
import { Button, Input } from '../components';
import { useAuth } from '../hooks';
import { useForm } from '../hooks';
import { validateEmail, validatePassword, validateRequired } from '../utils/validators';
import { USER_ROLES } from '../config/constants';
import authService from '../services/authService';
import './AuthPages.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validationRules = {
    username: (value) => validateRequired(value),
    email: (value) => validateRequired(value) || validateEmail(value),
    role: (value) => validateRequired(value),
    password: (value) => validateRequired(value) || validatePassword(value),
    confirmPassword: (value, values) => {
      if (!value) return 'Vui lòng xác nhận mật khẩu';
      if (value !== values.password) return 'Mật khẩu không khớp';
      return null;
    },
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { username: '', email: '', role: '', password: '', confirmPassword: '' },
    validationRules
  );

  const onSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Call backend API
      const result = await authService.register({
        username: values.username,
        password: values.password,
        email: values.email,
        role: values.role,
      });
      
      if (result.success) {
        // After successful registration, login automatically
        const loginResult = await authService.login(values.username, values.password);
        
        if (loginResult.success && loginResult.token) {
          const userData = {
            username: values.username,
            email: values.email,
            role: values.role,
          };
          
          await login(userData, loginResult.token);
          navigate('/');
        } else {
          // Registration successful but auto-login failed, redirect to login page
          navigate('/login', { 
            state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } 
          });
        }
      } else {
        setError(result.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
      console.error('Register error:', err);
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
            <h1>Đăng Ký</h1>
            <p>Tạo tài khoản để bắt đầu hành trình</p>
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

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="your@email.com"
              icon={<Mail size={20} />}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
              required
              fullWidth
            />

            <div className="input-container input-full-width">
              <label htmlFor="role" className="input-label">
                Vai trò<span className="input-required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon input-icon-left"><Briefcase size={20} /></span>
                <select
                  id="role"
                  name="role"
                  className="input-field input-with-icon-left"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                >
                  <option value="">-- Chọn vai trò --</option>
                  <option value={USER_ROLES.CUSTOMER}>Khách hàng</option>
                  <option value={USER_ROLES.TOUR_PROVIDER}>Nhà cung cấp tour</option>
                </select>
              </div>
              {touched.role && errors.role && (
                <span className="input-error-message">{errors.role}</span>
              )}
            </div>


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
                helperText="Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số"
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

            <div className="password-field">
              <Input
                label="Xác nhận mật khẩu"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="••••••••"
                icon={<Lock size={20} />}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && errors.confirmPassword}
                required
                fullWidth
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <label className="checkbox-label terms">
              <input type="checkbox" required />
              <span>
                Tôi đồng ý với{' '}
                <Link to="/terms" className="link">
                  Điều khoản dịch vụ
                </Link>{' '}
                và{' '}
                <Link to="/privacy" className="link">
                  Chính sách bảo mật
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            >
              Đăng Ký
            </Button>
          </form>

          <div className="auth-divider">
            <span>Hoặc</span>
          </div>

          <div className="social-login">
            <button className="social-btn google">
              <img src="https://www.google.com/favicon.ico" alt="Google" />
              Đăng ký với Google
            </button>
            <button className="social-btn facebook">
              <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
              Đăng ký với Facebook
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Đã có tài khoản?{' '}
              <Link to="/login" className="auth-link">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-image">
          <div className="auth-image-overlay">
            <h2>Bắt Đầu Hành Trình</h2>
            <p>Tham gia cùng hàng nghìn người dùng đã tin tưởng TravelGoda</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
