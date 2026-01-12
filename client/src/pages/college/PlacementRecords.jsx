import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { placementService } from '../../services/collegeService';

const PlacementRecords = () => {
  const { logout } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await placementService.getPlacements();
      setRecords(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load placements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const exportCsv = async () => {
    try {
      const blob = await placementService.exportPlacements();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'placements.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to export placements');
    }
  };

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
        <h2>Placement Records</h2>
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.actions}>
          <button onClick={load} style={styles.button}>
            Refresh
          </button>
          <button onClick={exportCsv} style={styles.secondaryButton}>
            Export CSV
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Branch</th>
                  <th>Batch</th>
                  <th>CGPA</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Offer Accepted</th>
                  <th>Joining Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    <td>{r.studentId?.name || 'N/A'}</td>
                    <td>{r.studentId?.branch || 'N/A'}</td>
                    <td>{r.studentId?.batch || 'N/A'}</td>
                    <td>{r.studentId?.cgpa ?? ''}</td>
                    <td>{r.driveId?.companyId?.name || 'N/A'}</td>
                    <td>{r.driveId?.role || 'N/A'}</td>
                    <td>{r.offerAccepted ? 'Yes' : 'No'}</td>
                    <td>{r.joiningStatus}</td>
                  </tr>
                ))}
                {records.length === 0 && !loading && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '1rem' }}>
                      No placement records yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
  actions: {
    margin: '1rem 0',
    display: 'flex',
    gap: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  tableWrapper: {
    marginTop: '1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
};

export default PlacementRecords;


