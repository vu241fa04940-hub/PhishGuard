import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <div className="container about-container">
        {/* Hero Section */}
        <div className="about-hero-section card">
          <span className="about-badge">Security Intelligence</span>
          <h1>About PhishGuard</h1>
          <p className="about-lead">
            PhishGuard is a dedicated web security platform designed to protect users and organizations from malicious websites and deceptive online threats through advanced URL analysis.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="about-grid-two">
          <div className="about-card card">
            <h2>Our Mission</h2>
            <p>
              To deliver fast, reliable, and accessible threat detection tools that help individuals and teams navigate the digital landscape safely. We believe online safety should be proactive, straightforward, and transparent.
            </p>
          </div>
          <div className="about-card card">
            <h2>Our Approach</h2>
            <p>
              Phishing tactics evolve rapidly, often outpacing conventional domain blacklists. PhishGuard evaluates the underlying anatomical structure, syntax, and behavioral indicators of URLs to detect zero-hour threats before damage occurs.
            </p>
          </div>
        </div>

        {/* What Sets Us Apart / Core Pillars */}
        <div className="about-card card">
          <h2>Core Principles</h2>
          <div className="principles-grid">
            <div className="principle-item">
              <h3>Zero-Contact Safety</h3>
              <p>
                Our inspection engine analyzes URL lexical heuristics without executing code or navigating to suspicious destinations, ensuring complete endpoint isolation.
              </p>
            </div>
            <div className="principle-item">
              <h3>Predictive Intelligence</h3>
              <p>
                By assessing structural anomalies—such as IP-based hosts, nested subdomains, and obfuscated redirect paths—we identify deceptive patterns that static lists miss.
              </p>
            </div>
            <div className="principle-item">
              <h3>Transparent Scoring</h3>
              <p>
                Every analysis provides a clear risk score and highlights specific suspicious characteristics, empowering users to make informed security decisions.
              </p>
            </div>
            <div className="principle-item">
              <h3>Privacy-Focused</h3>
              <p>
                User queries and account histories are handled with strict confidentiality. We do not track personal web activity or share audit records with third parties.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="about-cta card">
          <div>
            <h2>Protect Your Browsing</h2>
            <p>Inspect any suspicious link before clicking or disclosing sensitive credentials.</p>
          </div>
          <Link to="/scanner" className="btn btn-primary">
            Launch Scanner
          </Link>
        </div>
      </div>
    </div>
  );
}
