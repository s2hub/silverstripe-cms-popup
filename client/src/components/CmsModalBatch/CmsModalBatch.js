import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CmsModalBatchForm from './CmsModalBatchForm';
import CmsModalBatchProgress from './CmsModalBatchProgress';

const STATUS_PENDING = 'pending';
const STATUS_RUNNING = 'running';
const STATUS_SUCCESS = 'success';
const STATUS_WARNING = 'warning';
const STATUS_ERROR   = 'error';

const CmsModalBatch = ({ data, onClose }) => {
  const {
    formEndpoint,
    actionEndpoint,
    queueEndpoint,
    submitLabel = 'Start',
    baseQueue = [],
  } = data || {};

  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState([]);

  const handleStart = async (formValues) => {
    let queue = [...baseQueue];

    if (formValues.recursive && queueEndpoint) {
      try {
        const res = await fetch(queueEndpoint, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const json = await res.json();
            (json.items || [])
              .filter((item) => item.enabled !== false)
              .forEach((item) => queue.push(item));
          }
        }
      } catch (e) {
        // continue with base queue only
      }
    }

    if (queue.length === 0) return;

    setProcessing(true);
    setDone(false);

    const initialProgress = queue.map((item) => ({
      ...item,
      status: STATUS_PENDING,
      details: [],
      message: '',
    }));
    setProgress(initialProgress);

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];

      setProgress((prev) =>
        prev.map((p, idx) => (idx === i ? { ...p, status: STATUS_RUNNING } : p))
      );

      try {
        const res = await fetch(actionEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({ ...item, ...formValues }),
        });

        const contentType = res.headers.get('content-type') || '';
        let result;

        if (contentType.includes('application/json')) {
          result = await res.json();
        } else {
          const html = await res.text();
          const errorMsg = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 300);
          result = { status: 'Error', message: `Server error (${res.status}): ${errorMsg}`, details: [] };
        }

        if (!res.ok && !result.message) {
          result.message = `HTTP ${res.status}`;
        }

        const hasError   = !res.ok || (result.details || []).some((d) => d.level === 'error');
        const hasWarning = (result.details || []).some((d) => d.level === 'warning');
        let itemStatus = STATUS_SUCCESS;
        if (hasError) itemStatus = STATUS_ERROR;
        else if (hasWarning) itemStatus = STATUS_WARNING;

        setProgress((prev) =>
          prev.map((p, idx) =>
            idx === i
              ? { ...p, status: itemStatus, details: result.details || [], message: result.message || '' }
              : p
          )
        );
      } catch (e) {
        setProgress((prev) =>
          prev.map((p, idx) =>
            idx === i ? { ...p, status: STATUS_ERROR, message: e.message || 'Network error' } : p
          )
        );
      }
    }

    setProcessing(false);
    setDone(true);
  };

  if (!processing && !done) {
    return (
      <CmsModalBatchForm
        formEndpoint={formEndpoint}
        submitLabel={submitLabel}
        onSubmit={handleStart}
        onCancel={onClose}
      />
    );
  }

  return (
    <CmsModalBatchProgress
      items={progress}
      isProcessing={processing}
      onClose={onClose}
    />
  );
};

CmsModalBatch.propTypes = {
  data: PropTypes.shape({
    formEndpoint: PropTypes.string,
    actionEndpoint: PropTypes.string,
    queueEndpoint: PropTypes.string,
    submitLabel: PropTypes.string,
    baseQueue: PropTypes.array,
  }),
  onClose: PropTypes.func,
};

CmsModalBatch.defaultProps = {
  data: {},
  onClose: () => {},
};

export default CmsModalBatch;
