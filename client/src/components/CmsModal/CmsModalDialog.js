import React from 'react';
import PropTypes from 'prop-types';

const CmsModalDialog = ({ size, children }) => (
  <div
    className={`cms-popup__dialog cms-popup__dialog--${size}`}
    onClick={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
  >
    {children}
  </div>
);

CmsModalDialog.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.node,
};

CmsModalDialog.defaultProps = {
  size: 'md',
  children: null,
};

export default CmsModalDialog;
