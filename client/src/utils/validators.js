// Email validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Password validation (min 6 characters)
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// CGPA validation (0-10)
export const validateCGPA = (cgpa) => {
  const num = parseFloat(cgpa);
  return !isNaN(num) && num >= 0 && num <= 10;
};

// Batch validation (4 digit year)
export const validateBatch = (batch) => {
  const year = parseInt(batch);
  const currentYear = new Date().getFullYear();
  return !isNaN(year) && year >= 2000 && year <= currentYear + 5;
};

// Required field validation
export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

// File validation
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['application/pdf'],
    allowedExtensions = ['.pdf'],
  } = options;

  if (!file) return { valid: false, error: 'No file selected' };

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  if (allowedExtensions.length > 0 && !hasValidExtension) {
    return { valid: false, error: `File extension not allowed. Allowed: ${allowedExtensions.join(', ')}` };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB` };
  }

  return { valid: true };
};

// URL validation
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Form validation helper
export const validateForm = (fields, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(fieldName => {
    const value = fields[fieldName];
    const fieldRules = rules[fieldName];
    
    // Required check
    if (fieldRules.required && !validateRequired(value)) {
      errors[fieldName] = fieldRules.requiredMessage || `${fieldName} is required`;
      return;
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !fieldRules.required) return;
    
    // Email validation
    if (fieldRules.email && !validateEmail(value)) {
      errors[fieldName] = fieldRules.emailMessage || 'Invalid email address';
      return;
    }
    
    // Password validation
    if (fieldRules.password && !validatePassword(value)) {
      errors[fieldName] = fieldRules.passwordMessage || 'Password must be at least 6 characters';
      return;
    }
    
    // CGPA validation
    if (fieldRules.cgpa && !validateCGPA(value)) {
      errors[fieldName] = fieldRules.cgpaMessage || 'CGPA must be between 0 and 10';
      return;
    }
    
    // Batch validation
    if (fieldRules.batch && !validateBatch(value)) {
      errors[fieldName] = fieldRules.batchMessage || 'Invalid batch year';
      return;
    }
    
    // URL validation
    if (fieldRules.url && !validateURL(value)) {
      errors[fieldName] = fieldRules.urlMessage || 'Invalid URL';
      return;
    }
    
    // Min length
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[fieldName] = fieldRules.minLengthMessage || `Minimum length is ${fieldRules.minLength} characters`;
      return;
    }
    
    // Max length
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[fieldName] = fieldRules.maxLengthMessage || `Maximum length is ${fieldRules.maxLength} characters`;
      return;
    }
    
    // Custom validator
    if (fieldRules.custom && typeof fieldRules.custom === 'function') {
      const customError = fieldRules.custom(value, fields);
      if (customError) {
        errors[fieldName] = customError;
        return;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

