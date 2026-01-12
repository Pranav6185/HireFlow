import React from 'react';

const EmptyState = ({ 
  icon = '📭', 
  title = 'No items found', 
  message = 'There are no items to display at the moment.',
  actionLabel,
  onAction,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>{icon}</div>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.message}>{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} style={styles.actionButton}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 2rem',
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  icon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 0.5rem 0',
  },
  message: {
    fontSize: '1rem',
    color: '#666',
    margin: '0 0 1.5rem 0',
    maxWidth: '400px',
  },
  actionButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
  },
};

export default EmptyState;

