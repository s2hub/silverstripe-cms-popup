import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CmsModalContent = ({ data }) => {
  const { url } = data || {};
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!url) {
      setError('No URL configured');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(url, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (!res.ok) {
          setError(`HTTP ${res.status}`);
        } else {
          const text = await res.text();
          setHtml(text);
        }
      } catch (e) {
        setError(e.message || 'Network error');
      } finally {
        setLoading(false);
      }
    })();
  }, [url]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <span className="text-muted">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div
      style={{ padding: '20px' }}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

CmsModalContent.propTypes = {
  data: PropTypes.shape({
    url: PropTypes.string,
  }),
};

CmsModalContent.defaultProps = {
  data: {},
};

export default CmsModalContent;
