import React from 'react';
import PropTypes from 'prop-types';

const CmsModalHeader = ({ title, onClose }) => (
  <div className="cms-popup__header">
    <strong id="cms-popup-title">{title}</strong>
    <button
      type="button"
      className="btn-close"
      onClick={onClose}
      aria-label="Close"
    />
  </div>
);

CmsModalHeader.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

CmsModalHeader.defaultProps = {
  title: '',
};

export default CmsModalHeader;
