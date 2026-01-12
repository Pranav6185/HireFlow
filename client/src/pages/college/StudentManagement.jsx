import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { collegeService } from '../../services/collegeService';

const StudentManagement = () => {
  const { logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterVerified, setFilterVerified] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search) params.search = search;
      if (filterVerified === 'true' || filterVerified === 'false') {
        params.verified = filterVerified;
      }
      const res = await collegeService.getStudents(params);
      // Handle both paginated and non-paginated responses
      if (res.data && Array.isArray(res.data)) {
        setStudents(res.data);
      } else if (Array.isArray(res)) {
        setStudents(res);
      } else {
        setStudents([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async (id) => {
    try {
      await collegeService.verifyStudent(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify student');
    }
  };

  const startEdit = (student) => {
    setEditingId(student._id);
    setEditForm({
      name: student.name,
      branch: student.branch,
      batch: student.batch,
      cgpa: student.cgpa,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    try {
      await collegeService.updateStudent(id, {
        ...editForm,
        cgpa: parseFloat(editForm.cgpa),
      });
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update student');
    }
  };

  const exportCsv = async () => {
    try {
      const blob = await collegeService.exportStudents();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to export students');
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
        <h2>Student Management</h2>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Search by name / branch / batch"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value)}
            style={styles.select}
          >
            <option value="all">All</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
          <button onClick={load} style={styles.button}>
            Apply Filters
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
                  <th>Name</th>
                  <th>Branch</th>
                  <th>Batch</th>
                  <th>CGPA</th>
                  <th>Verified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td>
                      {editingId === s._id ? (
                        <input
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          style={styles.input}
                        />
                      ) : (
                        s.name
                      )}
                    </td>
                    <td>
                      {editingId === s._id ? (
                        <input
                          name="branch"
                          value={editForm.branch}
                          onChange={handleEditChange}
                          style={styles.input}
                        />
                      ) : (
                        s.branch
                      )}
                    </td>
                    <td>
                      {editingId === s._id ? (
                        <input
                          name="batch"
                          value={editForm.batch}
                          onChange={handleEditChange}
                          style={styles.input}
                        />
                      ) : (
                        s.batch
                      )}
                    </td>
                    <td>
                      {editingId === s._id ? (
                        <input
                          name="cgpa"
                          type="number"
                          value={editForm.cgpa}
                          onChange={handleEditChange}
                          style={styles.input}
                        />
                      ) : (
                        s.cgpa
                      )}
                    </td>
                    <td>{s.isVerified ? 'Yes' : 'No'}</td>
                    <td>
                      {!s.isVerified && (
                        <button
                          onClick={() => handleVerify(s._id)}
                          style={styles.smallButton}
                        >
                          Verify
                        </button>
                      )}
                      {editingId === s._id ? (
                        <>
                          <button
                            onClick={() => saveEdit(s._id)}
                            style={styles.smallButton}
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            style={styles.smallSecondaryButton}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(s)}
                          style={styles.smallSecondaryButton}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {students.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>
                      No students found.
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
  filters: {
    display: 'flex',
    gap: '1rem',
    margin: '1rem 0',
    flexWrap: 'wrap',
  },
  searchInput: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    flex: '1 1 240px',
  },
  select: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
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
  input: {
    width: '100%',
    padding: '0.25rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
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

export default StudentManagement;


