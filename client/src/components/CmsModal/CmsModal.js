import React from 'react';
import PropTypes from 'prop-types';
import CmsModalOverlay from './CmsModalOverlay';
import CmsModalDialog from './CmsModalDialog';
import CmsModalHeader from './CmsModalHeader';
import CmsModalBody from './CmsModalBody';

const CmsModal = ({ title, size, onClose, children }) => (
  <CmsModalOverlay onClose={onClose}>
    <CmsModalDialog size={size}>
      <CmsModalHeader title={title} onClose={onClose} />
      <CmsModalBody>
        {children}
      </CmsModalBody>
    </CmsModalDialog>
  </CmsModalOverlay>
);

CmsModal.propTypes = {
  title: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

CmsModal.defaultProps = {
  title: '',
  size: 'md',
  children: null,
};

export default CmsModal;
