import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import CmsModalSearchForm from './CmsModalSearchForm';
import CmsModalSearchResults from './CmsModalSearchResults';

const CmsModalSearch = ({ data, onSelect }) => {
  const { formEndpoint, searchEndpoint } = data || {};

  const [resultsHtml, setResultsHtml] = useState('');
  const [searching, setSearching] = useState(false);

  const doSearch = useCallback(async (formValues) => {
    if (!searchEndpoint) return;

    const params = new URLSearchParams(formValues).toString();
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
  }, [searchEndpoint]);

  return (
    <>
      <CmsModalSearchForm
        formEndpoint={formEndpoint}
        onSearch={doSearch}
      />
      <CmsModalSearchResults
        html={resultsHtml}
        searching={searching}
        onSelect={onSelect}
      />
    </>
  );
};

CmsModalSearch.propTypes = {
  data: PropTypes.shape({
    formEndpoint: PropTypes.string,
    searchEndpoint: PropTypes.string,
  }),
  onSelect: PropTypes.func,
};

CmsModalSearch.defaultProps = {
  data: {},
  onSelect: () => {},
};

export default CmsModalSearch;
