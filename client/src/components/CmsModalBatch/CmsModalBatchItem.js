import React from 'react';
import PropTypes from 'prop-types';
import StatusIcon from '../shared/StatusIcon';

const CmsModalBatchItem = ({ item }) => {
  const { title, id, status, message, details } = item;

  return (
    <li className="cms-popup__item">
      <div className="cms-popup__item-row">
        <StatusIcon status={status} />
        <strong>{title}</strong>
        <span className="cms-popup__item-id">#{id}</span>
      </div>

      {message && (
        <div className="cms-popup__item-message">{message}</div>
      )}

      {details && details.length > 0 && (
        <ul className="cms-popup__item-details">
          {details.map((d) => (
            <li key={d.label} className={`cms-popup__item-detail--${d.level || 'info'}`}>
              {d.label}: {d.status}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

CmsModalBatchItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    message: PropTypes.string,
    details: PropTypes.array,
  }).isRequired,
};

export default CmsModalBatchItem;
