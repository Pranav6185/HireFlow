import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/companyService';

const OfferManagement = () => {
  const { driveId } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [offerLinks, setOfferLinks] = useState({});

  useEffect(() => {
    loadOffers();
  }, [driveId]);

  const loadOffers = async () => {
    try {
      const data = await companyService.getOffers(driveId);
      setOffers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load offers');
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

  const handleIssueOffers = async () => {
    if (selectedIds.length === 0) {
      setError('Please select applicants to issue offers');
      return;
    }

    // Check if all have offer links
    const missingLinks = selectedIds.filter(
      (id) => !offerLinks[id] || offerLinks[id].trim() === ''
    );

    if (missingLinks.length > 0) {
      setError('Please provide offer letter links for all selected applicants');
      return;
    }

    setProcessing(true);
    setError('');
    try {
      const links = selectedIds.map((id) => offerLinks[id]);
      await companyService.issueOffers(driveId, selectedIds, links);
      setSuccess(`${selectedIds.length} offers issued successfully`);
      setSelectedIds([]);
      setOfferLinks({});
      setShowIssueForm(false);
      await loadOffers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue offers');
    } finally {
      setProcessing(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await companyService.exportSelected(driveId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `selected-candidates-${driveId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export');
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
          <button onClick={() => navigate('/company/drives')} style={styles.navLink}>
            Back
          </button>
          <button onClick={handleExport} style={styles.exportBtn}>
            Export Selected
          </button>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <h2>Offer Management</h2>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <div style={styles.actionBar}>
          <button
            onClick={() => setShowIssueForm(!showIssueForm)}
            style={styles.actionBtn}
          >
            {showIssueForm ? 'Cancel' : 'Issue Offers'}
          </button>
        </div>

        {showIssueForm && (
          <div style={styles.issueForm}>
            <h3>Select Applicants and Provide Offer Links</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Name</th>
                    <th>College</th>
                    <th>Status</th>
                    <th>Offer Letter Link</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={styles.empty}>
                        No eligible applicants found. Applicants must be in FINAL status.
                      </td>
                    </tr>
                  ) : (
                    offers
                      .filter(
                        (o) =>
                          o.applicationId?.status === 'FINAL' ||
                          o.applicationId?.status === 'OFFERED'
                      )
                      .map((offer) => (
                        <tr key={offer._id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(offer.applicationId?._id)}
                              onChange={() =>
                                handleSelect(offer.applicationId?._id)
                              }
                            />
                          </td>
                          <td>
                            {offer.applicationId?.studentId?.name || 'N/A'}
                          </td>
                          <td>
                            {offer.applicationId?.collegeId?.name || 'N/A'}
                          </td>
                          <td>{offer.status || 'N/A'}</td>
                          <td>
                            <input
                              type="text"
                              placeholder="Enter offer letter link"
                              value={offerLinks[offer.applicationId?._id] || ''}
                              onChange={(e) =>
                                setOfferLinks({
                                  ...offerLinks,
                                  [offer.applicationId?._id]: e.target.value,
                                })
                              }
                              style={styles.linkInput}
                            />
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
            {selectedIds.length > 0 && (
              <button
                onClick={handleIssueOffers}
                disabled={processing}
                style={styles.submitBtn}
              >
                {processing ? 'Issuing...' : `Issue ${selectedIds.length} Offers`}
              </button>
            )}
          </div>
        )}

        <div style={styles.tableContainer}>
          <h3>Issued Offers</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>College</th>
                <th>Status</th>
                <th>Issued At</th>
                <th>Acknowledged At</th>
                <th>Offer Letter</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer._id}>
                  <td>
                    {offer.applicationId?.studentId?.name || 'N/A'}
                  </td>
                  <td>{offer.applicationId?.collegeId?.name || 'N/A'}</td>
                  <td>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor:
                          offer.status === 'acknowledged'
                            ? '#28a745'
                            : offer.status === 'rejected'
                            ? '#dc3545'
                            : '#ffc107',
                      }}
                    >
                      {offer.status}
                    </span>
                  </td>
                  <td>
                    {offer.issuedAt
                      ? new Date(offer.issuedAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    {offer.acknowledgedAt
                      ? new Date(offer.acknowledgedAt).toLocaleDateString()
                      : 'Pending'}
                  </td>
                  <td>
                    {offer.offerLetterLink ? (
                      <a
                        href={offer.offerLetterLink}
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
          {offers.length === 0 && (
            <p style={styles.empty}>No offers issued yet</p>
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
  exportBtn: {
    backgroundColor: '#007bff',
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
  actionBar: {
    marginBottom: '1rem',
  },
  actionBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  issueForm: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'auto',
    marginTop: '1rem',
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
  linkInput: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
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
  submitBtn: {
    padding: '0.75rem 2rem',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem',
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

export default OfferManagement;

