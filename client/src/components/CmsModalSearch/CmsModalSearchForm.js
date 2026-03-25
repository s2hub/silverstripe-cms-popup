import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../shared/Spinner';

const CmsModalSearchForm = ({ formEndpoint, onSearch }) => {
  const formRef = useRef(null);
  const debounceRef = useRef(null);
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

  const getFormValues = useCallback(() => {
    if (!formRef.current) return {};
    const values = {};
    const inputs = formRef.current.querySelectorAll('input, select, textarea');

    inputs.forEach((input) => {
      const { name, type } = input;
      if (!name) return;

      if (type === 'checkbox') {
        if (input.checked) values[name] = input.value;
      } else if (type === 'radio') {
        if (input.checked) values[name] = input.value;
      } else {
        values[name] = input.value;
      }
    });

    return values;
  }, []);

  useEffect(() => {
    if (!formRef.current || !formHtml) return;

    const container = formRef.current;

    const handleSubmit = (e) => {
      if (e.target.tagName === 'FORM' || e.target.closest('form')) {
        e.preventDefault();
        onSearch(getFormValues());
      }
    };
    container.addEventListener('submit', handleSubmit, true);

    const handleInput = (e) => {
      if (e.target.tagName === 'INPUT' && (e.target.type === 'text' || e.target.type === 'search')) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          onSearch(getFormValues());
        }, 300);
      }
    };
    container.addEventListener('input', handleInput);

    return () => {
      container.removeEventListener('submit', handleSubmit, true);
      container.removeEventListener('input', handleInput);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [formHtml, onSearch, getFormValues]);

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
    /* eslint-disable-next-line react/no-danger */
    <div ref={formRef} dangerouslySetInnerHTML={{ __html: formHtml }} />
  );
};

CmsModalSearchForm.propTypes = {
  formEndpoint: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
};

CmsModalSearchForm.defaultProps = {
  formEndpoint: '',
};

export default CmsModalSearchForm;
