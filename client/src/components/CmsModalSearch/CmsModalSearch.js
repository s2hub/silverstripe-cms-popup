import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import CmsModalSearchForm from './CmsModalSearchForm';
import CmsModalSearchResults from './CmsModalSearchResults';

const CmsModalSearch = ({ data, onSelect }) => {
  const { formEndpoint, searchEndpoint, autoSearch = true, initialQuery = '' } = data || {};

  const [resultsHtml, setResultsHtml] = useState('');
  const [searching, setSearching] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Perform initial search on mount if autoSearch is enabled
  useEffect(() => {
    if (!autoSearch || !searchEndpoint || initialized) return;

    const doInitialSearch = async () => {
      setSearching(true);
      setResultsHtml('');

      try {
        // Use ?q= to get all videos (empty query returns all)
        const url = searchEndpoint.includes('?')
          ? `${searchEndpoint}&q=`
          : `${searchEndpoint}?q=`;

        const res = await fetch(url, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });

        if (!res.ok) {
          setResultsHtml(`<div class="alert alert-danger">HTTP ${res.status}</div>`);
        } else {
          setResultsHtml(await res.text());
        }
      } catch (e) {
        console.error('Initial search error:', e);
        setResultsHtml(`<div class="alert alert-danger">${e.message || 'Network error'}</div>`);
      } finally {
        setSearching(false);
        setInitialized(true);
      }
    };

    doInitialSearch();
  }, [autoSearch, searchEndpoint, initialized]);

  const doSearch = useCallback(async (formValues) => {
    if (!searchEndpoint) return;

    const params = new URLSearchParams(formValues).toString();
    const sep = searchEndpoint.includes('?') ? '&' : '?';
    const url = params ? `${searchEndpoint}${sep}${params}` : searchEndpoint;

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
    autoSearch: PropTypes.bool,
    initialQuery: PropTypes.string,
  }),
  onSelect: PropTypes.func,
};

CmsModalSearch.defaultProps = {
  data: {},
  onSelect: () => {},
  autoSearch: true,
  initialQuery: '',
};

export default CmsModalSearch;
