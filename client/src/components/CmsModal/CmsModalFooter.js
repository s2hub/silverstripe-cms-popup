import React from 'react';
import PropTypes from 'prop-types';

const CmsModalFooter = ({ children }) => (
  <div className="cms-popup__footer">
    {children}
  </div>
);

CmsModalFooter.propTypes = {
  children: PropTypes.node,
};

CmsModalFooter.defaultProps = {
  children: null,
};

export default CmsModalFooter;
