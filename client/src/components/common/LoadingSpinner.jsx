import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeStyles = {
    small: { width: '20px', height: '20px', borderWidth: '2px' },
    medium: { width: '40px', height: '40px', borderWidth: '3px' },
    large: { width: '60px', height: '60px', borderWidth: '4px' },
  };

  const spinnerStyle = {
    ...sizeStyles[size],
    border: `${sizeStyles[size].borderWidth} solid #f3f3f3`,
    borderTop: `${sizeStyles[size].borderWidth} solid #007bff`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  };

  return (
    <div style={styles.container}>
      <div style={spinnerStyle}></div>
      {message && <p style={styles.message}>{message}</p>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  message: {
    marginTop: '1rem',
    color: '#666',
    fontSize: '0.9rem',
  },
};

export default LoadingSpinner;

