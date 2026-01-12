import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user, student, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await studentService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>HireFlow</h1>
        <div style={styles.navLinks}>
          <Link to="/student/dashboard" style={styles.navLink}>
            Dashboard
          </Link>
          <Link to="/student/profile" style={styles.navLink}>
            Profile
          </Link>
          <Link to="/student/drives" style={styles.navLink}>
            Browse Drives
          </Link>
          <Link to="/student/applications" style={styles.navLink}>
            My Applications
          </Link>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <h2>Welcome, {profile?.name || user?.email}!</h2>
        
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Profile Status</h3>
            <p>{profile?.isVerified ? '✓ Verified' : '⚠ Pending Verification'}</p>
            {!profile?.resumeLink && (
              <p style={styles.warning}>⚠ Resume not uploaded</p>
            )}
          </div>

          <div style={styles.card}>
            <h3>Quick Actions</h3>
            <Link to="/student/profile" style={styles.actionLink}>
              Update Profile
            </Link>
            <Link to="/student/drives" style={styles.actionLink}>
              Browse Drives
            </Link>
            <Link to="/student/applications" style={styles.actionLink}>
              View Applications
            </Link>
          </div>
        </div>
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
    alignItems: 'center',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
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
    maxWidth: '1200px',
    margin: '0 auto',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  warning: {
    color: '#f59e0b',
    marginTop: '0.5rem',
  },
  actionLink: {
    display: 'block',
    color: '#007bff',
    textDecoration: 'none',
    marginTop: '0.5rem',
    padding: '0.5rem',
  },
};

export default Dashboard;

