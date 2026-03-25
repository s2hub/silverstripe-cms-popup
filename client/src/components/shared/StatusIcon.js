import React from 'react';
import Spinner from './Spinner';

// Uses SilverStripe admin font-icon classes where available
const icons = {
  pending: { cls: 'font-icon-circle', label: 'Pending' },
  running: null, // rendered as Spinner
  success: { cls: 'font-icon-check-mark', label: 'Success' },
  warning: { cls: 'font-icon-attention', label: 'Warning' },
  error:   { cls: 'font-icon-cancel-circled', label: 'Error' },
};

const StatusIcon = ({ status }) => {
  if (status === 'running') {
    return <Spinner />;
  }

  const icon = icons[status];
  if (!icon) return null;

  return (
    <span
      className={`cms-popup__status-icon ${icon.cls}`}
      aria-label={icon.label}
    />
  );
};

export default StatusIcon;
