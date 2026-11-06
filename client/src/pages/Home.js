import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import './Home.css';

const features = [
  {
    code: 'ML',
    title: 'Machine Learning Classification',
    desc: 'Trained Random Forest ensemble evaluates 24 structural and lexical URL parameters to identify malicious patterns.'
  },
  {
    code: 'RT',
    title: 'Real-Time Heuristic Inspection',
    desc: 'Rapid URL inspection providing deterministic classification, risk metrics, and confidence distribution in milliseconds.'
  },
  {
    code: 'FE',
    title: 'Multi-Vector Feature Extraction',
    desc: 'Inspects hostnames, IP address usage, domain entropy, nested subdomains, and URL obfuscation signatures.'
  },
  {
    code: 'EX',
    title: 'Explainable Diagnostics',
    desc: 'Detailed breakdown of triggered indicators with risk factor evaluations for transparent threat auditing.'
  },
  {
    code: 'AU',
    title: 'Scan Audit Logging',
    desc: 'Authenticated session management with searchable, filterable history records stored securely in MongoDB.'
  },
  {
    code: 'PV',
    title: 'Zero-Contact Analysis',
    desc: 'Purely heuristic lexical inspection. The system never executes, visits, or interacts with candidate web servers.'
  }
];

const steps = [
  { num: '01', title: 'Submit URL', desc: 'Enter any suspicious target domain or complete URL into the inspection console.' },
  { num: '02', title: 'Feature Extraction', desc: 'The engine extracts 24 syntactic, structural, and lexical indicators.' },
  { num: '03', title: 'Classification & Audit', desc: 'The Random Forest model outputs the prediction, risk score, and detailed diagnostics.' },
];

export default function Home() {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleScan = (e) => {
    e.preventDefault();
    if (url.trim()) {
      navigate(`/scanner?url=${encodeURIComponent(url.trim())}`);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Machine Learning Security System
            </div>
            <div className="hero-logo">
              <Logo size={72} />
            </div>
            <h1 className="hero-title">
              Website Phishing Detection System
            </h1>
            <p className="hero-subtitle">
              Using MERN Stack and Machine Learning
            </p>
            <p className="hero-desc">
              Identify and analyze deceptive websites using a trained Random Forest classification engine.
              Inspect URLs in real-time with deterministic feature extraction and transparent risk scoring.
            </p>

            <form className="hero-scanner" onSubmit={handleScan}>
              <div className="scanner-input-wrap">
                <input
                  type="text"
                  className="scanner-input"
                  placeholder="Enter website URL to analyze (e.g. https://example.com)..."
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  aria-label="URL to inspect"
                />
                <button type="submit" className="btn btn-primary scanner-btn" disabled={!url.trim()}>
                  Inspect URL
                </button>
              </div>
            </form>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">24</span>
                <span className="stat-label">Extracted Features</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">10,000+</span>
                <span className="stat-label">Training Samples</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">Random Forest</span>
                <span className="stat-label">Ensemble Classifier</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>System Capabilities</h2>
            <p>Comprehensive URL lexical analysis powered by machine learning</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card card">
                <div className="feature-code-badge">{f.code}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>Inspection Pipeline</h2>
            <p>Three-phase workflow for automated threat classification</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Verify a Suspicious URL</h2>
            <p>Evaluate domains instantly against lexical phishing signatures and classification rules.</p>
            <button className="btn btn-primary" onClick={() => navigate('/scanner')} style={{ padding: '12px 28px', fontSize: '15px' }}>
              Open URL Scanner
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <Logo size={28} />
              <span>PhishGuard</span>
            </div>
            <p className="footer-copyright">
              &copy; 2026 Website Phishing Detection System Using MERN Stack and Machine Learning. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
