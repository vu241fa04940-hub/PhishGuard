import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <Logo size={36} />
          <div className="navbar-brand-text">
            <span className="brand-name">PhishGuard</span>
            <span className="brand-tagline">Phishing Detection System</span>
          </div>
        </Link>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
            <span></span><span></span><span></span>
          </span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/scanner" className={`nav-link ${isActive('/scanner') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Scanner
          </Link>
          {user && (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                History
              </Link>
            </>
          )}
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            About
          </Link>

          <div className="navbar-auth">
            {user ? (
              <div className="user-menu">
                <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.name}</span>
                <button className="btn btn-outline" onClick={handleLogout}>Sign Out</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link to="/signup" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
