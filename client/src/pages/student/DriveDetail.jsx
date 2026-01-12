import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { driveService, applicationService } from '../../services/studentService';

const DriveDetail = () => {
  const { driveId } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadDrive();
  }, [driveId]);

  const loadDrive = async () => {
    try {
      const data = await driveService.getDriveDetails(driveId);
      setDrive(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load drive details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    setError('');
    setSuccess('');

    try {
      await applicationService.submitApplication(driveId);
      setSuccess('Application submitted successfully!');
      await loadDrive(); // Reload to show updated status
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  if (!drive) {
    return (
      <div style={styles.container}>
        <nav style={styles.nav}>
          <h1 style={styles.logo}>HireFlow</h1>
          <button onClick={() => navigate('/student/drives')} style={styles.navLink}>
            Back
          </button>
        </nav>
        <div style={styles.content}>
          {error ? (
            <div style={styles.error}>{error}</div>
          ) : (
            <p>Loading drive details...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>HireFlow</h1>
        <div style={styles.navLinks}>
          <button onClick={() => navigate('/student/drives')} style={styles.navLink}>
            Back
          </button>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <h2>{drive.role}</h2>
        <div style={styles.driveInfo}>
          <p><strong>Company:</strong> {drive.companyId?.name || 'N/A'}</p>
          {drive.ctc && <p><strong>CTC:</strong> ₹{drive.ctc} LPA</p>}
          {drive.stipend && <p><strong>Stipend:</strong> ₹{drive.stipend}/month</p>}
          {drive.eligibilityCriteria && (
            <div style={styles.eligibility}>
              <h3>Eligibility Criteria</h3>
              {drive.eligibilityCriteria.minCGPA && (
                <p>Minimum CGPA: {drive.eligibilityCriteria.minCGPA}</p>
              )}
              {drive.eligibilityCriteria.allowedBranches && drive.eligibilityCriteria.allowedBranches.length > 0 && (
                <p>Branches: {drive.eligibilityCriteria.allowedBranches.join(', ')}</p>
              )}
              {drive.eligibilityCriteria.batch && (
                <p>Batch: {drive.eligibilityCriteria.batch}</p>
              )}
            </div>
          )}
          {drive.roundStructure && drive.roundStructure.length > 0 && (
            <div style={styles.rounds}>
              <h3>Round Structure</h3>
              {drive.roundStructure.map((round, idx) => (
                <div key={idx} style={styles.roundItem}>
                  <strong>{round.title}</strong> ({round.type})
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {drive.hasApplied ? (
          <div style={styles.appliedSection}>
            <p style={styles.appliedText}>✓ You have already applied to this drive</p>
            <button onClick={() => navigate('/student/applications')} style={styles.viewAppBtn}>
              View Application Status
            </button>
          </div>
        ) : (
          <button onClick={handleApply} disabled={applying} style={styles.applyBtn}>
            {applying ? 'Applying...' : 'Apply Now'}
          </button>
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
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  driveInfo: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  },
  eligibility: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '4px',
  },
  rounds: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '4px',
  },
  roundItem: {
    marginTop: '0.5rem',
    padding: '0.5rem',
  },
  applyBtn: {
    padding: '0.75rem 2rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  appliedSection: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#d4edda',
    borderRadius: '4px',
  },
  appliedText: {
    color: '#155724',
    fontWeight: '500',
  },
  viewAppBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    marginTop: '1rem',
  },
  success: {
    backgroundColor: '#efe',
    color: '#3c3',
    padding: '1rem',
    borderRadius: '4px',
    marginTop: '1rem',
  },
};

export default DriveDetail;

