// Validation utility functions
import { VALIDATION_RULES } from '../config/constants';

// Email validation
export const validateEmail = (email) => {
  if (!email) {
    return 'Email là bắt buộc';
  }
  
  if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
    return 'Email không hợp lệ';
  }
  
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return 'Mật khẩu là bắt buộc';
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return `Mật khẩu phải có ít nhất ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} ký tự`;
  }
  
  if (password.length > VALIDATION_RULES.PASSWORD_MAX_LENGTH) {
    return `Mật khẩu không được quá ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} ký tự`;
  }
  
  // Check for at least one uppercase, one lowercase, and one number
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số';
  }
  
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (confirmPassword, password) => {
  if (!confirmPassword) {
    return 'Xác nhận mật khẩu là bắt buộc';
  }
  
  if (confirmPassword !== password) {
    return 'Mật khẩu xác nhận không khớp';
  }
  
  return null;
};

// Phone number validation
export const validatePhone = (phone) => {
  if (!phone) {
    return 'Số điện thoại là bắt buộc';
  }
  
  if (!VALIDATION_RULES.PHONE_REGEX.test(phone)) {
    return 'Số điện thoại không hợp lệ';
  }
  
  return null;
};

// Required field validation
export const validateRequired = (value, fieldName = 'Trường này') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} là bắt buộc`;
  }
  
  return null;
};

// Min length validation
export const validateMinLength = (value, minLength, fieldName = 'Trường này') => {
  if (!value) {
    return null; // Use validateRequired for required check
  }
  
  if (value.length < minLength) {
    return `${fieldName} phải có ít nhất ${minLength} ký tự`;
  }
  
  return null;
};

// Max length validation
export const validateMaxLength = (value, maxLength, fieldName = 'Trường này') => {
  if (!value) {
    return null;
  }
  
  if (value.length > maxLength) {
    return `${fieldName} không được quá ${maxLength} ký tự`;
  }
  
  return null;
};

// Number validation
export const validateNumber = (value, fieldName = 'Giá trị') => {
  if (!value && value !== 0) {
    return null;
  }
  
  if (isNaN(value)) {
    return `${fieldName} phải là số`;
  }
  
  return null;
};

// Min value validation
export const validateMinValue = (value, minValue, fieldName = 'Giá trị') => {
  const numError = validateNumber(value, fieldName);
  if (numError) return numError;
  
  if (value < minValue) {
    return `${fieldName} phải lớn hơn hoặc bằng ${minValue}`;
  }
  
  return null;
};

// Max value validation
export const validateMaxValue = (value, maxValue, fieldName = 'Giá trị') => {
  const numError = validateNumber(value, fieldName);
  if (numError) return numError;
  
  if (value > maxValue) {
    return `${fieldName} phải nhỏ hơn hoặc bằng ${maxValue}`;
  }
  
  return null;
};

// Date validation
export const validateDate = (date, fieldName = 'Ngày') => {
  if (!date) {
    return `${fieldName} là bắt buộc`;
  }
  
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return `${fieldName} không hợp lệ`;
  }
  
  return null;
};

// Future date validation
export const validateFutureDate = (date, fieldName = 'Ngày') => {
  const dateError = validateDate(date, fieldName);
  if (dateError) return dateError;
  
  const d = new Date(date);
  const now = new Date();
  
  if (d <= now) {
    return `${fieldName} phải là ngày trong tương lai`;
  }
  
  return null;
};

// Past date validation
export const validatePastDate = (date, fieldName = 'Ngày') => {
  const dateError = validateDate(date, fieldName);
  if (dateError) return dateError;
  
  const d = new Date(date);
  const now = new Date();
  
  if (d >= now) {
    return `${fieldName} phải là ngày trong quá khứ`;
  }
  
  return null;
};

// URL validation
export const validateUrl = (url, fieldName = 'URL') => {
  if (!url) {
    return null;
  }
  
  try {
    new URL(url);
    return null;
  } catch {
    return `${fieldName} không hợp lệ`;
  }
};

// File size validation
export const validateFileSize = (file, maxSize = VALIDATION_RULES.MAX_FILE_SIZE) => {
  if (!file) {
    return null;
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return `Kích thước file không được vượt quá ${maxSizeMB}MB`;
  }
  
  return null;
};

// File type validation
export const validateFileType = (file, allowedTypes = VALIDATION_RULES.ALLOWED_IMAGE_TYPES) => {
  if (!file) {
    return null;
  }
  
  if (!allowedTypes.includes(file.type)) {
    return `Định dạng file không được hỗ trợ. Vui lòng chọn file có định dạng: ${allowedTypes.join(', ')}`;
  }
  
  return null;
};

// Username validation
export const validateUsername = (username) => {
  if (!username) {
    return 'Tên đăng nhập là bắt buộc';
  }
  
  if (username.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
    return `Tên đăng nhập phải có ít nhất ${VALIDATION_RULES.USERNAME_MIN_LENGTH} ký tự`;
  }
  
  if (username.length > VALIDATION_RULES.USERNAME_MAX_LENGTH) {
    return `Tên đăng nhập không được quá ${VALIDATION_RULES.USERNAME_MAX_LENGTH} ký tự`;
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
  }
  
  return null;
};

// Credit card validation (Luhn algorithm)
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber) {
    return 'Số thẻ là bắt buộc';
  }
  
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  if (!/^\d+$/.test(cleaned)) {
    return 'Số thẻ chỉ được chứa số';
  }
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return 'Số thẻ không hợp lệ';
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return 'Số thẻ không hợp lệ';
  }
  
  return null;
};

// CVV validation
export const validateCVV = (cvv) => {
  if (!cvv) {
    return 'CVV là bắt buộc';
  }
  
  if (!/^\d{3,4}$/.test(cvv)) {
    return 'CVV phải là 3 hoặc 4 chữ số';
  }
  
  return null;
};

// Expiry date validation (MM/YY format)
export const validateExpiryDate = (expiryDate) => {
  if (!expiryDate) {
    return 'Ngày hết hạn là bắt buộc';
  }
  
  const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
  if (!match) {
    return 'Ngày hết hạn phải có định dạng MM/YY';
  }
  
  const month = parseInt(match[1]);
  const year = parseInt('20' + match[2]);
  
  if (month < 1 || month > 12) {
    return 'Tháng không hợp lệ';
  }
  
  const now = new Date();
  const expiry = new Date(year, month - 1);
  
  if (expiry < now) {
    return 'Thẻ đã hết hạn';
  }
  
  return null;
};

export default {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumber,
  validateMinValue,
  validateMaxValue,
  validateDate,
  validateFutureDate,
  validatePastDate,
  validateUrl,
  validateFileSize,
  validateFileType,
  validateUsername,
  validateCreditCard,
  validateCVV,
  validateExpiryDate,
};
