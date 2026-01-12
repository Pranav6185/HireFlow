import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateForm } from '../../utils/validators';
import ErrorBanner from '../../components/common/ErrorBanner';

const Signup = () => {
  const [role, setRole] = useState('student'); // 'student', 'college', 'company'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    collegeId: '',
    branch: '',
    batch: '',
    cgpa: '',
    // College fields
    location: '',
    departments: '',
    // Company fields
    domain: '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, signupCompany, signupCollege } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});
    
    // Validate form based on role
    let validationRules = {
      email: { required: true, email: true },
      password: { required: true, password: true },
      name: { required: true, minLength: 2 },
    };

    if (role === 'student') {
      validationRules = {
        ...validationRules,
        collegeId: { required: true },
        branch: { required: true },
        batch: { required: true, batch: true },
        cgpa: { required: true, cgpa: true },
      };
    } else if (role === 'college') {
      validationRules = {
        ...validationRules,
        location: { required: true },
      };
    } else if (role === 'company') {
      // Company validation (domain is optional)
    }

    const validation = validateForm(formData, validationRules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      if (role === 'student') {
        await signup({
          ...formData,
          cgpa: parseFloat(formData.cgpa),
        });
        navigate('/student/dashboard');
      } else if (role === 'college') {
        await signupCollege({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          location: formData.location,
          departments: formData.departments ? formData.departments.split(',').map(d => d.trim()) : [],
        });
        navigate('/college/dashboard');
      } else if (role === 'company') {
        await signupCompany({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          domain: formData.domain || '',
        });
        navigate('/company/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign Up</h2>
        <ErrorBanner error={error} onDismiss={() => setError('')} />
        
        {/* Role Selection */}
        <div style={styles.roleSelector}>
          <label style={styles.roleLabel}>I am a:</label>
          <div style={styles.roleButtons}>
            <button
              type="button"
              onClick={() => setRole('student')}
              style={{
                ...styles.roleButton,
                ...(role === 'student' ? styles.roleButtonActive : {}),
              }}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('college')}
              style={{
                ...styles.roleButton,
                ...(role === 'college' ? styles.roleButtonActive : {}),
              }}
            >
              College
            </button>
            <button
              type="button"
              onClick={() => setRole('company')}
              style={{
                ...styles.roleButton,
                ...(role === 'company' ? styles.roleButtonActive : {}),
              }}
            >
              Company
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
            />
            {errors.email && <span style={styles.fieldError}>{errors.email}</span>}
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
            />
            {errors.password && <span style={styles.fieldError}>{errors.password}</span>}
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
            />
            {errors.name && <span style={styles.fieldError}>{errors.name}</span>}
          </div>
          {/* Student-specific fields */}
          {role === 'student' && (
            <>
              <div style={styles.formGroup}>
                <label htmlFor="collegeId" style={styles.label}>
                  College ID
                </label>
                <input
                  type="text"
                  id="collegeId"
                  name="collegeId"
                  value={formData.collegeId}
                  onChange={handleChange}
                  required
                  style={{ ...styles.input, ...(errors.collegeId ? styles.inputError : {}) }}
                  placeholder="Enter your college ID"
                />
                {errors.collegeId && <span style={styles.fieldError}>{errors.collegeId}</span>}
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="branch" style={styles.label}>
                  Branch
                </label>
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  style={{ ...styles.input, ...(errors.branch ? styles.inputError : {}) }}
                  placeholder="e.g., Computer Science"
                />
                {errors.branch && <span style={styles.fieldError}>{errors.branch}</span>}
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="batch" style={styles.label}>
                  Batch (Year of Passing)
                </label>
                <input
                  type="text"
                  id="batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  required
                  style={{ ...styles.input, ...(errors.batch ? styles.inputError : {}) }}
                  placeholder="e.g., 2024"
                />
                {errors.batch && <span style={styles.fieldError}>{errors.batch}</span>}
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="cgpa" style={styles.label}>
                  CGPA
                </label>
                <input
                  type="number"
                  id="cgpa"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  required
                  min="0"
                  max="10"
                  step="0.01"
                  style={{ ...styles.input, ...(errors.cgpa ? styles.inputError : {}) }}
                />
                {errors.cgpa && <span style={styles.fieldError}>{errors.cgpa}</span>}
              </div>
            </>
          )}

          {/* College-specific fields */}
          {role === 'college' && (
            <>
              <div style={styles.formGroup}>
                <label htmlFor="location" style={styles.label}>
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  style={{ ...styles.input, ...(errors.location ? styles.inputError : {}) }}
                  placeholder="e.g., Mumbai, Maharashtra"
                />
                {errors.location && <span style={styles.fieldError}>{errors.location}</span>}
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="departments" style={styles.label}>
                  Departments (comma-separated)
                </label>
                <input
                  type="text"
                  id="departments"
                  name="departments"
                  value={formData.departments}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g., CSE, IT, ECE, ME"
                />
                <small style={styles.helpText}>Optional: List departments separated by commas</small>
              </div>
            </>
          )}

          {/* Company-specific fields */}
          {role === 'company' && (
            <>
              <div style={styles.formGroup}>
                <label htmlFor="domain" style={styles.label}>
                  Domain/Website
                </label>
                <input
                  type="text"
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g., techcorp.com"
                />
                <small style={styles.helpText}>Optional: Your company website domain</small>
              </div>
            </>
          )}
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '1rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#555',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  fieldError: {
    color: '#dc3545',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
    display: 'block',
  },
  link: {
    textAlign: 'center',
    marginTop: '1rem',
    color: '#666',
  },
  roleSelector: {
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  roleLabel: {
    display: 'block',
    marginBottom: '0.75rem',
    color: '#555',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  roleButtons: {
    display: 'flex',
    gap: '0.5rem',
  },
  roleButton: {
    flex: 1,
    padding: '0.75rem',
    border: '2px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  roleButtonActive: {
    borderColor: '#007bff',
    backgroundColor: '#007bff',
    color: 'white',
  },
  helpText: {
    display: 'block',
    marginTop: '0.25rem',
    fontSize: '0.75rem',
    color: '#666',
    fontStyle: 'italic',
  },
};

export default Signup;

