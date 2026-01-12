import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { collegeService } from '../../services/collegeService';

const TPODashboard = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await collegeService.getDashboard();
        setData(res);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>HireFlow - TPO</h1>
        <div style={styles.navLinks}>
          <Link to="/college/dashboard" style={styles.navLink}>
            Dashboard
          </Link>
          <Link to="/college/students" style={styles.navLink}>
            Students
          </Link>
          <Link to="/college/drives" style={styles.navLink}>
            Drives
          </Link>
          <Link to="/college/placements" style={styles.navLink}>
            Placements
          </Link>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <h2>Welcome, {user?.email}</h2>
        {error && <div style={styles.error}>{error}</div>}

        {data && (
          <div style={styles.cards}>
            <div style={styles.card}>
              <h3>College</h3>
              <p>{data.college?.name}</p>
              <p>{data.college?.location}</p>
            </div>
            <div style={styles.card}>
              <h3>Students</h3>
              <p>Total: {data.stats.students}</p>
              <p>Verified: {data.stats.verifiedStudents}</p>
            </div>
            <div style={styles.card}>
              <h3>Drives</h3>
              <p>Invited: {data.stats.invitedDrives}</p>
            </div>
            <div style={styles.card}>
              <h3>Placements</h3>
              <p>Records: {data.stats.placements}</p>
            </div>
          </div>
        )}
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
    backgroundColor: '#1f2937',
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
    backgroundColor: '#ef4444',
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
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    marginTop: '1rem',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};

export default TPODashboard;


