import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/companyService';

const CompanyDashboard = () => {
  const { user, company, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await companyService.getDashboard();
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>HireFlow - Company</h1>
        <div style={styles.navLinks}>
          <Link to="/company/dashboard" style={styles.navLink}>
            Dashboard
          </Link>
          <Link to="/company/drives" style={styles.navLink}>
            My Drives
          </Link>
          <Link to="/company/create-drive" style={styles.navLink}>
            Create Drive
          </Link>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <h2>Welcome, {company?.name || user?.email}</h2>
        {error && <div style={styles.error}>{error}</div>}

        {data && (
          <div style={styles.cards}>
            <div style={styles.card}>
              <h3>Company Info</h3>
              <p>{data.company?.name}</p>
              {data.company?.domain && <p>Domain: {data.company.domain}</p>}
            </div>
            <div style={styles.card}>
              <h3>Drives</h3>
              <p>Total: {data.stats?.totalDrives || 0}</p>
              <p>Active: {data.stats?.activeDrives || 0}</p>
            </div>
            <div style={styles.card}>
              <h3>Applications</h3>
              <p>Total: {data.stats?.totalApplications || 0}</p>
            </div>
            <div style={styles.card}>
              <h3>Offers</h3>
              <p>Issued: {data.stats?.offeredCount || 0}</p>
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
    backgroundColor: '#059669',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
};

export default CompanyDashboard;

