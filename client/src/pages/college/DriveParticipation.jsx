import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { collegeService } from '../../services/collegeService';

const DriveParticipation = () => {
  const { logout } = useAuth();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await collegeService.getDrives();
      // Handle both paginated and non-paginated responses
      if (res.data && Array.isArray(res.data)) {
        setInvites(res.data);
      } else if (Array.isArray(res)) {
        setInvites(res);
      } else {
        setInvites([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load drives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const respond = async (id, action) => {
    try {
      await collegeService.respondToInvite(id, action);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update response');
    }
  };

  const pushEligible = async (driveId) => {
    try {
      await collegeService.pushEligibleApplicants(driveId);
      alert('Eligible applicants pushed successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to push eligible applicants');
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'Accepted':
        return 'Accepted';
      case 'Rejected':
        return 'Rejected';
      case 'Withdrawn':
        return 'Withdrawn';
      default:
        return 'Invited';
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
        <h2>Drive Participation</h2>
        {error && <div style={styles.error}>{error}</div>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((inv) => (
                  <tr key={inv._id}>
                    <td>{inv.driveId?.companyId?.name || 'N/A'}</td>
                    <td>{inv.driveId?.role || 'N/A'}</td>
                    <td>{formatStatus(inv.participationStatus)}</td>
                    <td>
                      {inv.participationStatus === 'Invited' && (
                        <>
                          <button
                            onClick={() => respond(inv._id, 'accept')}
                            style={styles.smallButton}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => respond(inv._id, 'reject')}
                            style={styles.smallSecondaryButton}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {inv.participationStatus === 'Accepted' && (
                        <button
                          onClick={() => pushEligible(inv.driveId?._id)}
                          style={styles.smallButton}
                        >
                          Push Eligible Applicants
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {invites.length === 0 && !loading && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>
                      No drive invitations yet.
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
  smallButton: {
    padding: '0.25rem 0.5rem',
    marginRight: '0.25rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  smallSecondaryButton: {
    padding: '0.25rem 0.5rem',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
};

export default DriveParticipation;


