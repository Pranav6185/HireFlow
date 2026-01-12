import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  pageSize,
  totalItems,
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div style={styles.container}>
      <div style={styles.info}>
        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
      </div>
      <div style={styles.pagination}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ ...styles.button, ...(currentPage === 1 ? styles.disabled : {}) }}
        >
          Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button onClick={() => onPageChange(1)} style={styles.button}>1</button>
            {startPage > 2 && <span style={styles.ellipsis}>...</span>}
          </>
        )}

        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              ...styles.button,
              ...(page === currentPage ? styles.active : {}),
            }}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span style={styles.ellipsis}>...</span>}
            <button onClick={() => onPageChange(totalPages)} style={styles.button}>
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ ...styles.button, ...(currentPage === totalPages ? styles.disabled : {}) }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2rem',
    padding: '1rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  info: {
    color: '#666',
    fontSize: '0.9rem',
  },
  pagination: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  button: {
    padding: '0.5rem 1rem',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  active: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#007bff',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  ellipsis: {
    padding: '0 0.5rem',
    color: '#666',
  },
};

export default Pagination;

