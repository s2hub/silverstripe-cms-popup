import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../shared/Spinner';
import CmsModalFooter from '../CmsModal/CmsModalFooter';

const CmsModalBatchForm = ({ formEndpoint, submitLabel, onSubmit, onCancel }) => {
  const formRef = useRef(null);
  const [formHtml, setFormHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!formEndpoint) {
      setError('No form endpoint configured');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(formEndpoint, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (!res.ok) {
          setError(`HTTP ${res.status}`);
        } else {
          setFormHtml(await res.text());
        }
      } catch (e) {
        setError(e.message || 'Network error');
      } finally {
        setLoading(false);
      }
    })();
  }, [formEndpoint]);

  const getFormValues = () => {
    if (!formRef.current) return {};
    const values = {};
    const inputs = formRef.current.querySelectorAll('input, select, textarea');

    inputs.forEach((input) => {
      const { name, type } = input;
      if (!name) return;

      // SilverStripe CheckboxSetField: name="fieldName[key]"
      const match = name.match(/^([^[]+)\[([^\]]*)\]$/);
      if (match) {
        const [, groupName, key] = match;
        if (!values[groupName]) values[groupName] = [];
        if (type === 'checkbox' && input.checked) {
          values[groupName].push(key || input.value);
        }
        return;
      }

      if (type === 'checkbox') {
        values[name] = input.checked;
      } else if (type === 'radio') {
        if (input.checked) values[name] = input.value;
      } else {
        values[name] = input.value;
      }
    });

    return values;
  };

  const handleSubmit = () => {
    onSubmit(getFormValues());
  };

  if (loading) {
    return (
      <div className="cms-popup__loading">
        <Spinner /> <span className="text-muted">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <div ref={formRef} dangerouslySetInnerHTML={{ __html: formHtml }} />
      <CmsModalFooter>
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
          {submitLabel}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </CmsModalFooter>
    </>
  );
};

CmsModalBatchForm.propTypes = {
  formEndpoint: PropTypes.string,
  submitLabel: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

CmsModalBatchForm.defaultProps = {
  formEndpoint: '',
  submitLabel: 'Start',
};

export default CmsModalBatchForm;
