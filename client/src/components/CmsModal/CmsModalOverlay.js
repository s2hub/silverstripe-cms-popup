import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const CmsModalOverlay = ({ onClose, children }) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="cms-popup"
      onClick={onClose}
      role="presentation"
    >
      {children}
    </div>
  );
};

CmsModalOverlay.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

CmsModalOverlay.defaultProps = {
  children: null,
};

export default CmsModalOverlay;
