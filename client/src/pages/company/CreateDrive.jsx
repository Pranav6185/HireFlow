import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/companyService';

const CreateDrive = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    role: '',
    ctc: '',
    stipend: '',
    mode: 'on-campus',
    minCGPA: '',
    allowedBranches: '',
    batch: '',
    selectedColleges: [],
  });

  const [rounds, setRounds] = useState([
    { index: 0, title: 'Aptitude Test', type: 'Test' },
    { index: 1, title: 'Technical Interview', type: 'Technical' },
    { index: 2, title: 'HR Interview', type: 'HR' },
  ]);

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      const data = await companyService.getColleges();
      setColleges(data);
    } catch (err) {
      setError('Failed to load colleges');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCollegeToggle = (collegeId) => {
    const selected = formData.selectedColleges;
    if (selected.includes(collegeId)) {
      setFormData({
        ...formData,
        selectedColleges: selected.filter((id) => id !== collegeId),
      });
    } else {
      setFormData({
        ...formData,
        selectedColleges: [...selected, collegeId],
      });
    }
  };

  const handleRoundChange = (index, field, value) => {
    const updated = rounds.map((r) =>
      r.index === index ? { ...r, [field]: value } : r
    );
    setRounds(updated);
  };

  const handleAddRound = () => {
    setRounds([
      ...rounds,
      { index: rounds.length, title: '', type: 'Custom' },
    ]);
  };

  const handleRemoveRound = (index) => {
    setRounds(rounds.filter((r) => r.index !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const eligibilityCriteria = {
        minCGPA: formData.minCGPA ? parseFloat(formData.minCGPA) : undefined,
        allowedBranches: formData.allowedBranches
          ? formData.allowedBranches.split(',').map((b) => b.trim())
          : [],
        batch: formData.batch || undefined,
      };

      const driveData = {
        role: formData.role,
        ctc: formData.ctc ? parseFloat(formData.ctc) : undefined,
        stipend: formData.stipend ? parseFloat(formData.stipend) : undefined,
        mode: formData.mode,
        roundStructure: rounds,
        eligibilityCriteria,
        collegeIds: formData.selectedColleges,
      };

      const result = await companyService.createDrive(driveData);
      setSuccess('Drive created successfully!');
      setTimeout(() => {
        navigate('/company/drives');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>HireFlow - Company</h1>
        <div style={styles.navLinks}>
          <button onClick={() => navigate('/company/dashboard')} style={styles.navLink}>
            Back
          </button>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <h2>Create New Drive</h2>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.section}>
            <h3>Basic Information</h3>
            <div style={styles.formGroup}>
              <label>Job Role *</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label>CTC (LPA)</label>
                <input
                  type="number"
                  name="ctc"
                  value={formData.ctc}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Stipend (per month)</label>
                <input
                  type="number"
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label>Mode</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="on-campus">On-Campus</option>
                <option value="virtual">Virtual</option>
                <option value="pooled">Pooled</option>
              </select>
            </div>
          </div>

          <div style={styles.section}>
            <h3>Eligibility Criteria</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label>Minimum CGPA</label>
                <input
                  type="number"
                  name="minCGPA"
                  value={formData.minCGPA}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.01"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Batch (Year of Passing)</label>
                <input
                  type="text"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  placeholder="e.g., 2024"
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label>Allowed Branches (comma-separated)</label>
              <input
                type="text"
                name="allowedBranches"
                value={formData.allowedBranches}
                onChange={handleChange}
                placeholder="e.g., Computer Science, Electronics"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.section}>
            <h3>Round Structure</h3>
            {rounds.map((round, idx) => (
              <div key={idx} style={styles.roundCard}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label>Round Title</label>
                    <input
                      type="text"
                      value={round.title}
                      onChange={(e) =>
                        handleRoundChange(round.index, 'title', e.target.value)
                      }
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label>Type</label>
                    <select
                      value={round.type}
                      onChange={(e) =>
                        handleRoundChange(round.index, 'type', e.target.value)
                      }
                      style={styles.input}
                    >
                      <option>Test</option>
                      <option>Interview</option>
                      <option>Technical</option>
                      <option>HR</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveRound(round.index)}
                    style={styles.removeBtn}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={handleAddRound} style={styles.addBtn}>
              Add Round
            </button>
          </div>

          <div style={styles.section}>
            <h3>Invite Colleges</h3>
            <div style={styles.collegeList}>
              {colleges.map((college) => (
                <label key={college._id} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.selectedColleges.includes(college._id)}
                    onChange={() => handleCollegeToggle(college._id)}
                  />
                  {college.name} - {college.location}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Creating...' : 'Create Drive'}
          </button>
        </form>
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
    maxWidth: '1000px',
    margin: '0 auto',
  },
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  section: {
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #eee',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  roundCard: {
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  addBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  removeBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    alignSelf: 'flex-end',
  },
  collegeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '0.75rem 2rem',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
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

export default CreateDrive;

