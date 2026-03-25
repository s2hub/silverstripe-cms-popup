import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../shared/Spinner';

const CmsModalSearchResults = ({ html, searching, onSelect }) => {
  const resultsRef = useRef(null);

  useEffect(() => {
    if (!resultsRef.current || !html) return;

    const container = resultsRef.current;

    const handleClick = (e) => {
      const selectEl = e.target.closest('[data-cms-select]');
      if (!selectEl) return;

      e.preventDefault();
      try {
        const selectedData = JSON.parse(selectEl.getAttribute('data-cms-select'));
        onSelect(selectedData);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('CmsModalSearch: invalid data-cms-select JSON', err);
      }
    };
    container.addEventListener('click', handleClick);

    return () => container.removeEventListener('click', handleClick);
  }, [html, onSelect]);

  if (searching) {
    return (
      <div className="cms-popup__loading">
        <Spinner /> <span className="text-muted">Searching...</span>
      </div>
    );
  }

  if (!html) return null;

  return (
    /* eslint-disable-next-line react/no-danger */
    <div ref={resultsRef} dangerouslySetInnerHTML={{ __html: html }} />
  );
};

CmsModalSearchResults.propTypes = {
  html: PropTypes.string,
  searching: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

CmsModalSearchResults.defaultProps = {
  html: '',
  searching: false,
};

export default CmsModalSearchResults;
