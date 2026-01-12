import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/companyService';

const ApplicantScreening = () => {
  const { driveId } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    collegeId: '',
    status: '',
  });

  useEffect(() => {
    loadApplicants();
  }, [driveId, filters]);

  const loadApplicants = async () => {
    try {
      const params = {};
      if (filters.collegeId) params.collegeId = filters.collegeId;
      if (filters.status) params.status = filters.status;
      const data = await companyService.getApplicants(driveId, params);
      setApplicants(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === applicants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applicants.map((a) => a._id));
    }
  };

  const handleShortlist = async () => {
    if (selectedIds.length === 0) {
      setError('Please select at least one applicant');
      return;
    }
    setProcessing(true);
    setError('');
    try {
      await companyService.shortlistApplicants(driveId, selectedIds);
      setSuccess(`${selectedIds.length} applicants shortlisted`);
      setSelectedIds([]);
      await loadApplicants();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to shortlist');
    } finally {
      setProcessing(false);
    }
  };

  const handleAdvanceRound = async (roundIndex) => {
    if (selectedIds.length === 0) {
      setError('Please select at least one applicant');
      return;
    }
    setProcessing(true);
    setError('');
    try {
      await companyService.advanceRound(driveId, selectedIds, roundIndex);
      setSuccess(`${selectedIds.length} applicants advanced`);
      setSelectedIds([]);
      await loadApplicants();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to advance');
    } finally {
      setProcessing(false);
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
    };
    return colors[status] || '#6c757d';
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>HireFlow - Company</h1>
        <div style={styles.navLinks}>
          <button onClick={() => navigate('/company/drives')} style={styles.navLink}>
            Back
          </button>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <h2>Applicant Screening</h2>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <div style={styles.filters}>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            style={styles.filterInput}
          >
            <option value="">All Statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="ELIGIBLE">Eligible</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="ROUND_1">Round 1</option>
            <option value="ROUND_2">Round 2</option>
            <option value="FINAL">Final</option>
          </select>
        </div>

        {selectedIds.length > 0 && (
          <div style={styles.actionBar}>
            <span>{selectedIds.length} selected</span>
            <button onClick={handleShortlist} disabled={processing} style={styles.actionBtn}>
              Shortlist
            </button>
            <button
              onClick={() => handleAdvanceRound(0)}
              disabled={processing}
              style={styles.actionBtn}
            >
              Advance to Round 1
            </button>
            <button
              onClick={() => handleAdvanceRound(1)}
              disabled={processing}
              style={styles.actionBtn}
            >
              Advance to Round 2
            </button>
            <button
              onClick={() => handleAdvanceRound(2)}
              disabled={processing}
              style={styles.actionBtn}
            >
              Advance to Final
            </button>
          </div>
        )}

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === applicants.length && applicants.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Name</th>
                <th>Branch</th>
                <th>Batch</th>
                <th>CGPA</th>
                <th>College</th>
                <th>Status</th>
                <th>Resume</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(app._id)}
                      onChange={() => handleSelect(app._id)}
                    />
                  </td>
                  <td>{app.studentId?.name || 'N/A'}</td>
                  <td>{app.studentId?.branch || 'N/A'}</td>
                  <td>{app.studentId?.batch || 'N/A'}</td>
                  <td>{app.studentId?.cgpa || 'N/A'}</td>
                  <td>{app.collegeId?.name || 'N/A'}</td>
                  <td>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(app.status),
                      }}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td>
                    {app.studentId?.resumeLink ? (
                      <a
                        href={app.studentId.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                      >
                        View
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {applicants.length === 0 && (
            <p style={styles.empty}>No applicants found</p>
          )}
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
    maxWidth: '1400px',
    margin: '0 auto',
  },
  filters: {
    marginBottom: '1rem',
  },
  filterInput: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  actionBar: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  actionBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  table th: {
    padding: '1rem',
    textAlign: 'left',
    borderBottom: '2px solid #eee',
    backgroundColor: '#f9f9f9',
  },
  table td: {
    padding: '1rem',
    borderBottom: '1px solid #eee',
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  link: {
    color: '#059669',
    textDecoration: 'none',
  },
  empty: {
    padding: '2rem',
    textAlign: 'center',
    color: '#666',
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
};

export default ApplicantScreening;

