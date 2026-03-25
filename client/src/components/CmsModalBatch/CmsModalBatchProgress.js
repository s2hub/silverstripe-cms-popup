import React from 'react';
import PropTypes from 'prop-types';
import CmsModalBatchItem from './CmsModalBatchItem';
import CmsModalFooter from '../CmsModal/CmsModalFooter';

const CmsModalBatchProgress = ({ items, isProcessing, onClose }) => {
  const totalCount = items.length;
  const completedCount = items.filter(
    (p) => p.status !== 'pending' && p.status !== 'running'
  ).length;
  const successCount = items.filter((p) => p.status === 'success').length;
  const warningCount = items.filter((p) => p.status === 'warning').length;
  const errorCount   = items.filter((p) => p.status === 'error').length;

  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isDone = !isProcessing;

  const barModifier = errorCount > 0 ? 'error' : isProcessing ? 'running' : '';

  return (
    <>
      <div className="cms-popup__progress">
        <div className="cms-popup__progress-label">
          <span>{isProcessing ? 'Processing...' : 'Done'}</span>
          <span>{completedCount} / {totalCount}</span>
        </div>
        <div className="cms-popup__progress-track">
          <div
            className={`cms-popup__progress-bar${barModifier ? ` cms-popup__progress-bar--${barModifier}` : ''}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {isDone && (
        <div className="cms-popup__summary">
          <strong>Summary:</strong>{' '}
          {successCount > 0 && (
            <span className="cms-popup__summary-success">{successCount} successful</span>
          )}
          {warningCount > 0 && (
            <span className="cms-popup__summary-warning">
              {successCount > 0 ? ', ' : ''}{warningCount} warnings
            </span>
          )}
          {errorCount > 0 && (
            <span className="cms-popup__summary-error">
              {(successCount + warningCount) > 0 ? ', ' : ''}{errorCount} errors
            </span>
          )}
        </div>
      )}

      <ul className="cms-popup__items">
        {items.map((item) => (
          <CmsModalBatchItem key={item.id} item={item} />
        ))}
      </ul>

      <CmsModalFooter>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
          disabled={isProcessing}
        >
          {isDone ? 'Close' : 'Cancel'}
        </button>
      </CmsModalFooter>
    </>
  );
};

CmsModalBatchProgress.propTypes = {
  items: PropTypes.array.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CmsModalBatchProgress;
