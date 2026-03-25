import React from 'react';
import PropTypes from 'prop-types';

const CmsModalBody = ({ children }) => (
  <div className="cms-popup__body">
    {children}
  </div>
);

CmsModalBody.propTypes = {
  children: PropTypes.node,
};

CmsModalBody.defaultProps = {
  children: null,
};

export default CmsModalBody;
