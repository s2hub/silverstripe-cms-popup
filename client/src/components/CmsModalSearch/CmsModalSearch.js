import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

const CmsModalSearch = ({ data, onSelect, onClose }) => {
  const { formEndpoint, searchEndpoint } = data || {};

  const formRef = useRef(null);
  const resultsRef = useRef(null);
  const debounceRef = useRef(null);

  const [formHtml, setFormHtml] = useState('');
  const [resultsHtml, setResultsHtml] = useState('');
  const [loadingForm, setLoadingForm] = useState(true);
  const [searching, setSearching] = useState(false);
  const [formError, setFormError] = useState('');

  // Load form HTML
  useEffect(() => {
    if (!formEndpoint) {
      setFormError('No form endpoint configured');
      setLoadingForm(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(formEndpoint, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (!res.ok) {
          setFormError(`HTTP ${res.status}`);
        } else {
          setFormHtml(await res.text());
        }
      } catch (e) {
        setFormError(e.message || 'Network error');
      } finally {
        setLoadingForm(false);
      }
    })();
  }, [formEndpoint]);

  // Read form values from DOM
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

  // Execute search
  const doSearch = useCallback(async () => {
    if (!searchEndpoint) return;

    const values = getFormValues();
    const params = new URLSearchParams(values).toString();
    const url = params ? `${searchEndpoint}?${params}` : searchEndpoint;

    setSearching(true);
    setResultsHtml('');

    try {
      const res = await fetch(url, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });
      if (!res.ok) {
        setResultsHtml(`<div class="alert alert-danger">HTTP ${res.status}</div>`);
      } else {
        setResultsHtml(await res.text());
      }
    } catch (e) {
      setResultsHtml(`<div class="alert alert-danger">${e.message || 'Network error'}</div>`);
    } finally {
      setSearching(false);
    }
  }, [searchEndpoint, getFormValues]);

  // Attach form submit handler + debounced input listener
  useEffect(() => {
    if (!formRef.current || !formHtml) return;

    const container = formRef.current;

    // Intercept form submit
    const handleSubmit = (e) => {
      if (e.target.tagName === 'FORM' || e.target.closest('form')) {
        e.preventDefault();
        doSearch();
      }
    };
    container.addEventListener('submit', handleSubmit, true);

    // Debounced auto-search on text input changes
    const handleInput = (e) => {
      if (e.target.tagName === 'INPUT' && (e.target.type === 'text' || e.target.type === 'search')) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          doSearch();
        }, 300);
      }
    };
    container.addEventListener('input', handleInput);

    return () => {
      container.removeEventListener('submit', handleSubmit, true);
      container.removeEventListener('input', handleInput);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [formHtml, doSearch]);

  // Attach click handler for selectable results
  useEffect(() => {
    if (!resultsRef.current || !resultsHtml) return;

    const container = resultsRef.current;

    const handleClick = (e) => {
      const selectEl = e.target.closest('[data-cms-select]');
      if (!selectEl) return;

      e.preventDefault();
      try {
        const selectedData = JSON.parse(selectEl.getAttribute('data-cms-select'));
        if (onSelect) {
          onSelect(selectedData);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('CmsModalSearch: invalid data-cms-select JSON', err);
      }
    };
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [resultsHtml, onSelect]);

  return (
    <div style={{ padding: '20px' }}>
      {loadingForm && (
        <div style={{ textAlign: 'center' }}>
          <span className="text-muted">Loading...</span>
        </div>
      )}

      {formError && (
        <div className="alert alert-danger">{formError}</div>
      )}

      {!loadingForm && !formError && (
        <>
          <div
            ref={formRef}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: formHtml }}
          />

          {searching && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <span className="text-muted">Searching...</span>
            </div>
          )}

          {resultsHtml && (
            <div
              ref={resultsRef}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: resultsHtml }}
            />
          )}
        </>
      )}
    </div>
  );
};

CmsModalSearch.propTypes = {
  data: PropTypes.shape({
    formEndpoint: PropTypes.string,
    searchEndpoint: PropTypes.string,
  }),
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
};

CmsModalSearch.defaultProps = {
  data: {},
  onSelect: () => {},
  onClose: () => {},
};

export default CmsModalSearch;
