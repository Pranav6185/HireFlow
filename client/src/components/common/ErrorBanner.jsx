import React, { useState } from 'react';

const ErrorBanner = ({ 
  error, 
  onDismiss,
  type = 'error', // 'error' | 'warning' | 'info' | 'success'
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!error || !isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  const typeStyles = {
    error: {
      backgroundColor: '#fee',
      color: '#c33',
      borderColor: '#fcc',
    },
    warning: {
      backgroundColor: '#fffbeb',
      color: '#92400e',
      borderColor: '#fde68a',
    },
    info: {
      backgroundColor: '#eff6ff',
      color: '#1e40af',
      borderColor: '#bfdbfe',
    },
    success: {
      backgroundColor: '#f0fdf4',
      color: '#166534',
      borderColor: '#bbf7d0',
    },
  };

  const style = typeStyles[type] || typeStyles.error;

  return (
    <div style={{ ...styles.container, ...style }}>
      <div style={styles.content}>
        <span style={styles.message}>{error}</span>
        {onDismiss && (
          <button onClick={handleDismiss} style={styles.dismissButton}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    border: '1px solid',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    flex: 1,
  },
  dismissButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0 0.5rem',
    lineHeight: 1,
    opacity: 0.7,
  },
};

export default ErrorBanner;

