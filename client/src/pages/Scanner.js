import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import './Scanner.css';

const FeatureItem = ({ label, value, type }) => {
  const isTrue = value === true;
  const isFalse = value === false;

  return (
    <div className="feature-item">
      <span className="feature-label">{label}</span>
      <span className={`feature-value ${isTrue && type === 'danger' ? 'danger' : isTrue && type === 'good' ? 'good' : isFalse && type === 'danger' ? 'good' : ''}`}>
        {isTrue ? 'Yes' : isFalse ? 'No' : value}
      </span>
    </div>
  );
};

export default function Scanner() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [url, setUrl] = useState(searchParams.get('url') || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async (scanUrl) => {
    const targetUrl = scanUrl || url;
    if (!targetUrl.trim()) {
      setError('Please enter a valid URL to analyze.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const endpoint = user ? '/api/scan' : '/api/scan/guest';
      const res = await axios.post(endpoint, { url: targetUrl.trim() });
      setResult(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to scan URL. Verify backend and ML service are active.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParam = searchParams.get('url');
    if (urlParam) {
      setUrl(urlParam);
      handleScan(urlParam);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e) => {
    e.preventDefault();
    handleScan(url);
  };

  const isPhishing = result?.prediction === 'phishing';

  return (
    <div className="scanner-page">
      <div className="container">
        <div className="scanner-header">
          <h1>URL Scanner</h1>
          <p>Analyze target domain heuristics using the trained Random Forest classifier</p>
        </div>

        <div className="scanner-card card">
          <form onSubmit={handleSubmit}>
            <div className="scan-input-group">
              <div className="url-input-wrap">
                <input
                  type="text"
                  className="form-input url-input"
                  placeholder="Enter URL to inspect (e.g. https://example.com)..."
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary scan-submit-btn"
                disabled={loading || !url.trim()}
              >
                {loading ? (
                  <><div className="spinner"></div> Analyzing...</>
                ) : 'Scan URL'}
              </button>
            </div>
          </form>

          {!user && (
            <div className="alert alert-warning" style={{ marginTop: 16 }}>
              <span>Tip: <a href="/login">Sign in</a> to save your scan records and view persistent telemetry.</span>
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-error animate-fadeIn" style={{ marginTop: 16 }}>
            <span>Error: {error}</span>
          </div>
        )}

        {loading && (
          <div className="scanning-animation card animate-fadeIn">
            <div className="scan-logo-wrap">
              <Logo size={72} />
              <div className="scan-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </div>
            <h3>Inspecting URL Heuristics</h3>
            <p>Extracting 24 structural features and executing Random Forest classifier</p>
            <div className="scan-steps">
              <span className="scan-step active">1. Extracting URL features</span>
              <span className="scan-step">2. Running Random Forest</span>
              <span className="scan-step">3. Calculating risk score</span>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="results-container animate-fadeIn">
            {/* Main Result Card */}
            <div className={`result-card card ${isPhishing ? 'result-phishing' : 'result-legitimate'}`}>
              <div className="result-status-indicator">
                <span className={`status-pill ${isPhishing ? 'pill-phishing' : 'pill-legitimate'}`}>
                  {isPhishing ? 'FLAGGED' : 'CLEAN'}
                </span>
              </div>
              <div className="result-info">
                <div className={`result-verdict ${isPhishing ? 'verdict-phishing' : 'verdict-legitimate'}`}>
                  {isPhishing ? 'PHISHING WEBSITE DETECTED' : 'LEGITIMATE WEBSITE'}
                </div>
                <p className="result-url">{result.url}</p>
                <div className="result-meta">
                  <span>Confidence: <strong>{result.confidence ? (result.confidence * 100).toFixed(1) : 0}%</strong></span>
                  <span>|</span>
                  <span>Risk Score: <strong>{result.riskScore}/100</strong></span>
                </div>
              </div>
            </div>

            {/* Risk Meter */}
            <div className="card risk-meter-card">
              <h3>Calculated Risk Assessment</h3>
              <div className="risk-meter">
                <div className="risk-bar-container">
                  <div
                    className={`risk-bar ${result.riskScore < 30 ? 'risk-low' : result.riskScore < 60 ? 'risk-medium' : 'risk-high'}`}
                    style={{ width: `${result.riskScore}%` }}
                  ></div>
                </div>
                <div className="risk-labels">
                  <span style={{ color: 'var(--color-green)' }}>Low Risk (0-29)</span>
                  <span style={{ color: 'var(--color-yellow)' }}>Moderate Risk (30-59)</span>
                  <span style={{ color: 'var(--color-red)' }}>High Risk (60-100)</span>
                </div>
              </div>
              <div className="risk-score-display">
                <span className={`risk-num ${result.riskScore < 30 ? 'score-low' : result.riskScore < 60 ? 'score-medium' : 'score-high'}`}>
                  {result.riskScore}
                </span>
                <span className="risk-label-txt">/ 100 Risk Score</span>
              </div>
              <p className="risk-desc">
                {result.riskScore < 30 ? 'Low threat level. The URL conforms to standard legitimate domain structures.' :
                 result.riskScore < 60 ? 'Moderate threat level. Potential anomalies detected in URL components.' :
                 'High threat level. Strongly elevated likelihood of deceptive or spoofed domain parameters.'}
              </p>
            </div>

            {/* Suspicious Features */}
            {result.suspiciousFeatures && result.suspiciousFeatures.length > 0 && (
              <div className="card suspicious-features-card">
                <h3>Suspicious Indicators Flagged ({result.suspiciousFeatures.length})</h3>
                <ul className="suspicious-list">
                  {result.suspiciousFeatures.map((f, i) => (
                    <li key={i} className="suspicious-item">
                      <span className="suspicious-indicator"></span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.prediction === 'legitimate' && (!result.suspiciousFeatures || result.suspiciousFeatures.length === 0) && (
              <div className="card" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}>
                <h3 style={{ color: 'var(--color-green)' }}>No Suspicious Heuristics Detected</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
                  The candidate URL passed checks for IP address hosting, excessive subdomains, credential keywords, and suspicious redirects.
                </p>
              </div>
            )}

            {/* URL Features Grid */}
            {result.features && (
              <div className="card features-grid-card">
                <h3>Extracted Feature Vectors</h3>
                <div className="features-analysis-grid">
                  <FeatureItem label="URL Length" value={result.features.url_length} />
                  <FeatureItem label="Dot Count" value={result.features.num_dots} />
                  <FeatureItem label="HTTPS Protocol" value={result.features.has_https} type="good" />
                  <FeatureItem label="IP Address in Host" value={result.features.has_ip_address} type="danger" />
                  <FeatureItem label="@ Symbol Present" value={result.features.has_at_symbol} type="danger" />
                  <FeatureItem label="URL Shortener Mask" value={result.features.is_url_shortener} type="danger" />
                  <FeatureItem label="Subdomain Levels" value={result.features.num_subdomains} />
                  <FeatureItem label="Suspicious Keywords" value={result.features.has_suspicious_words} type="danger" />
                  <FeatureItem label="Domain Length" value={result.features.domain_length} />
                  <FeatureItem label="Special Character Count" value={result.features.special_char_count} />
                  <FeatureItem label="Hyphen in Domain" value={result.features.has_dash_in_domain} type="danger" />
                  <FeatureItem label="Double Slash in Path" value={result.features.has_double_slash} type="danger" />
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="disclaimer card">
              <p>Security Notice: PhishGuard evaluates threat likelihood using statistical classification on lexical features. It does not navigate to or interact with target servers to preserve endpoint safety.</p>
            </div>

            {/* Scan Another */}
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button className="btn btn-outline" onClick={() => { setResult(null); setUrl(''); setError(''); }}>
                Inspect Another URL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
