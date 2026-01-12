import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { APPLICATION_STATUS } from '../../utils/constants';
import { applicationService } from '../../services/studentService';

const ApplicationStatus = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await applicationService.getMyApplications();
      // Handle both paginated and non-paginated responses
      if (data.data && Array.isArray(data.data)) {
        setApplications(data.data);
      } else if (Array.isArray(data)) {
        setApplications(data);
      } else {
        setApplications([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      APPLIED: '#007bff',
      ELIGIBLE: '#17a2b8',
      SHORTLISTED: '#ffc107',
      ROUND_1: '#6f42c1',
      ROUND_2: '#6f42c1',
      FINAL: '#28a745',
      OFFERED: '#28a745',
      ACCEPTED: '#28a745',
      REJECTED: '#dc3545',
      WITHDRAWN: '#6c757d',
    };
    return colors[status] || '#6c757d';
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
        <h2>My Applications</h2>
        {error && <div style={styles.error}>{error}</div>}
        
        {applications.length === 0 ? (
          <div style={styles.empty}>
            <p>You haven't applied to any drives yet.</p>
            <button onClick={() => navigate('/student/drives')} style={styles.browseBtn}>
              Browse Available Drives
            </button>
          </div>
        ) : (
          <div style={styles.applicationsList}>
            {applications.map((app) => (
              <div key={app._id} style={styles.applicationCard}>
                <h3>{app.driveId?.role || 'N/A'}</h3>
                <p><strong>Company:</strong> {app.driveId?.companyId?.name || 'N/A'}</p>
                {app.driveId?.ctc && <p><strong>CTC:</strong> ₹{app.driveId.ctc} LPA</p>}
                {app.driveId?.stipend && <p><strong>Stipend:</strong> ₹{app.driveId.stipend}/month</p>}
                <p><strong>Applied on:</strong> {new Date(app.submittedAt).toLocaleDateString()}</p>
                <div style={styles.statusBar}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(app.status),
                    }}
                  >
                    {app.status}
                  </span>
                </div>
                {app.timeline && app.timeline.length > 0 && (
                  <div style={styles.timeline}>
                    <h4>Timeline</h4>
                    {app.timeline.map((event, idx) => (
                      <div key={idx} style={styles.timelineItem}>
                        <strong>{event.status}</strong> - {new Date(event.updatedAt).toLocaleString()}
                      </div>
                    ))}
                  </div>
                )}
                {app.status === APPLICATION_STATUS.OFFERED && (
                  <div style={styles.offerSection}>
                    <p>Offer received!</p>
                    <button style={styles.acceptBtn}>Accept Offer</button>
                  </div>
                )}
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
  empty: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#666',
  },
  browseBtn: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  timeline: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  },
  timelineItem: {
    marginTop: '0.5rem',
    fontSize: '0.9rem',
    color: '#666',
  },
  applicationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  applicationCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  statusBar: {
    marginTop: '1rem',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  offerSection: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f0f9ff',
    borderRadius: '4px',
  },
  acceptBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
};

export default ApplicationStatus;

