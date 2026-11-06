import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './History.css';

export default function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [deleting, setDeleting] = useState(null);
  const [clearingAll, setClearingAll] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filter !== 'all') params.append('filter', filter);
      const res = await axios.get(`/api/history?${params}`);
      setScans(res.data.results || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load scan history.');
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this scan record?')) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/history/${id}`);
      setScans(prev => prev.filter(s => s._id !== id));
      showSuccess('Scan record removed successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete record.');
    } finally {
      setDeleting(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Delete all scan records? This action cannot be reversed.')) return;
    setClearingAll(true);
    try {
      const res = await axios.delete('/api/history');
      setScans([]);
      setPagination({});
      showSuccess(res.data.message || 'All scan records cleared.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to clear scan history.');
    } finally {
      setClearingAll(false);
    }
  };

  return (
    <div className="history-page">
      <div className="container">
        <div className="history-header">
          <div>
            <h1>Scan History</h1>
            <p>Chronological log of analyzed URLs and detection results</p>
          </div>
          <div className="history-actions">
            <Link to="/scanner" className="btn btn-primary">New Inspection</Link>
            {scans.length > 0 && (
              <button
                className="btn btn-danger"
                onClick={handleClearAll}
                disabled={clearingAll}
              >
                {clearingAll ? <><div className="spinner" style={{ width: 14, height: 14 }}></div> Clearing...</> : 'Clear All'}
              </button>
            )}
          </div>
        </div>

        {successMsg && (
          <div className="alert alert-success animate-fadeIn" style={{ marginBottom: 16 }}>
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error animate-fadeIn" style={{ marginBottom: 16 }}>
            <span>{error}</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {[
            { key: 'all', label: 'All Records' },
            { key: 'phishing', label: 'Phishing' },
            { key: 'legitimate', label: 'Legitimate' }
          ].map(f => (
            <button
              key={f.key}
              className={`filter-tab ${filter === f.key ? 'active' : ''}`}
              onClick={() => { setFilter(f.key); setPage(1); }}
            >
              {f.label}
              {f.key === 'all' && pagination.total !== undefined && (
                <span className="tab-count">{pagination.total}</span>
              )}
            </button>
          ))}
        </div>

        {/* History Table */}
        {loading ? (
          <div className="history-loading">
            <div className="spinner" style={{ width: 36, height: 36 }}></div>
            <p>Retrieving scan records...</p>
          </div>
        ) : scans.length === 0 ? (
          <div className="history-empty card">
            <h3>No Records Located</h3>
            <p>{filter !== 'all' ? `No ${filter} URLs found in current filter.` : 'No URLs have been analyzed yet.'}</p>
            <Link to="/scanner" className="btn btn-primary" style={{ marginTop: 20 }}>Inspect a Website</Link>
          </div>
        ) : (
          <>
            <div className="history-table card">
              <div className="table-header">
                <span>Target URL</span>
                <span>Verdict</span>
                <span>Risk Level</span>
                <span>Timestamp</span>
                <span>Action</span>
              </div>
              <div className="table-body">
                {scans.map(scan => (
                  <div key={scan._id} className="table-row animate-fadeIn">
                    <div className="table-url">
                      <span className={`result-dot ${scan.prediction}`}></span>
                      <span className="url-cell" title={scan.url}>{scan.url}</span>
                    </div>
                    <div>
                      <span className={`badge badge-${scan.prediction}`}>
                        {scan.prediction.toUpperCase()}
                      </span>
                    </div>
                    <div className="risk-cell">
                      <div className="mini-risk-bar">
                        <div
                          className={`mini-risk-fill ${scan.riskScore < 30 ? 'risk-low' : scan.riskScore < 60 ? 'risk-medium' : 'risk-high'}`}
                          style={{ width: `${scan.riskScore}%` }}
                        ></div>
                      </div>
                      <span className="risk-num-small">{scan.riskScore}/100</span>
                    </div>
                    <div className="date-cell">
                      {new Date(scan.scannedAt).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                    <div>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(scan._id)}
                        disabled={deleting === scan._id}
                        title="Remove record"
                      >
                        {deleting === scan._id ? '...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-outline"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </button>
                <span className="page-info">Page {page} of {pagination.pages}</span>
                <button
                  className="btn btn-outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= pagination.pages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
