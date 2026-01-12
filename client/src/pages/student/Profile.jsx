import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';

const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    branch: '',
    batch: '',
    cgpa: '',
    resumeLink: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await studentService.getProfile();
      setProfile({
        name: data.name || '',
        branch: data.branch || '',
        batch: data.batch || '',
        cgpa: data.cgpa || '',
        resumeLink: data.resumeLink || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setResumeFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Upload resume if file selected
      if (resumeFile) {
        await studentService.uploadResume(resumeFile);
        setSuccess('Resume uploaded successfully');
        setResumeFile(null);
        await loadProfile();
      }

      // Update profile
      await studentService.updateProfile({
        name: profile.name,
        branch: profile.branch,
        batch: profile.batch,
        cgpa: parseFloat(profile.cgpa),
      });
      setSuccess('Profile updated successfully');
      await loadProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>HireFlow</h1>
        <div style={styles.navLinks}>
          <button onClick={() => navigate('/student/dashboard')} style={styles.navLink}>
            Back to Dashboard
          </button>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <h2>Edit Profile</h2>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="branch" style={styles.label}>
              Branch
            </label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={profile.branch}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="batch" style={styles.label}>
              Batch (Year of Passing)
            </label>
            <input
              type="text"
              id="batch"
              name="batch"
              value={profile.batch}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="cgpa" style={styles.label}>
              CGPA
            </label>
            <input
              type="number"
              id="cgpa"
              name="cgpa"
              value={profile.cgpa}
              onChange={handleChange}
              required
              min="0"
              max="10"
              step="0.01"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="resume" style={styles.label}>
              Resume (PDF only, max 5MB)
            </label>
            <input
              type="file"
              id="resume"
              accept="application/pdf"
              onChange={handleFileChange}
              style={styles.input}
            />
            {profile.resumeLink && (
              <div style={styles.resumeInfo}>
                <p>Current resume: <a href={profile.resumeLink} target="_blank" rel="noopener noreferrer">View</a></p>
              </div>
            )}
          </div>

          <button type="submit" disabled={saving} style={styles.button}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  nav: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
  },
  navLinks: {
    display: 'flex',
    gap: '1rem',
  },
  navLink: {
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  content: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#333',
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
    padding: '0.75rem 2rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  success: {
    backgroundColor: '#efe',
    color: '#3c3',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  resumeInfo: {
    marginTop: '0.5rem',
    color: '#666',
  },
};

export default Profile;

