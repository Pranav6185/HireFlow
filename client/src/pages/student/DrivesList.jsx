import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { driveService } from '../../services/studentService';

const DrivesList = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = async () => {
    try {
      const data = await driveService.getEligibleDrives();
      setDrives(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load drives');
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
        <h1 style={styles.logo}>HireFlow</h1>
        <div style={styles.navLinks}>
          <button onClick={() => navigate('/student/dashboard')} style={styles.navLink}>
            Dashboard
          </button>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <h2>Available Hiring Drives</h2>
        {error && <div style={styles.error}>{error}</div>}
        
        {drives.length === 0 ? (
          <div style={styles.empty}>
            <p>No drives available at the moment.</p>
            <p style={styles.note}>Drives will appear here once companies create them and invite your college.</p>
          </div>
        ) : (
          <div style={styles.drivesGrid}>
            {drives.map((drive) => (
              <div key={drive._id} style={styles.driveCard}>
                <h3>{drive.role}</h3>
                <p>{drive.companyId?.name || 'Company'}</p>
                {drive.ctc && <p>CTC: ₹{drive.ctc} LPA</p>}
                {drive.stipend && <p>Stipend: ₹{drive.stipend}/month</p>}
                {drive.hasApplied && (
                  <p style={styles.appliedBadge}>✓ Applied</p>
                )}
                <Link to={`/student/drives/${drive._id}`} style={styles.viewBtn}>
                  {drive.hasApplied ? 'View Application' : 'View Details'}
                </Link>
              </div>
            ))}
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
    maxWidth: '1200px',
    margin: '0 auto',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  empty: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#666',
  },
  note: {
    fontSize: '0.9rem',
    marginTop: '1rem',
    fontStyle: 'italic',
  },
  drivesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  driveCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  viewBtn: {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
  },
};

export default DrivesList;

