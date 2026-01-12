import React from 'react';
import ErrorBanner from './ErrorBanner';

const SuccessBanner = ({ success, onDismiss }) => {
  return <ErrorBanner error={success} onDismiss={onDismiss} type="success" />;
};

export default SuccessBanner;

