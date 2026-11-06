import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import './Dashboard.css';

const StatCard = ({ code, title, value, color, subtitle }) => (
  <div className="stat-card card">
    <div className="stat-card-badge" style={{ borderColor: color, color }}>{code}</div>
    <div className="stat-card-info">
      <div className="stat-card-value" style={{ color }}>{value}</div>
      <div className="stat-card-title">{title}</div>
      {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
    </div>
  </div>
);

const PIE_COLORS = ['#ef4444', '#10b981'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/dashboard/stats');
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" style={{ width: 48, height: 48 }}></div>
        <p>Loading security telemetry...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  const { stats, recentScans, weeklyChart } = data || {};

  const pieData = [
    { name: 'Phishing', value: stats?.phishingDetected || 0 },
    { name: 'Legitimate', value: stats?.legitimateDetected || 0 },
  ];

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Security Dashboard</h1>
            <p>Real-time telemetry and classification analytics</p>
          </div>
          <Link to="/scanner" className="btn btn-primary">
            Scan New URL
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            code="TOTAL"
            title="Total Scans"
            value={stats?.totalScans || 0}
            color="var(--accent-secondary)"
            subtitle="Inspected records"
          />
          <StatCard
            code="THREAT"
            title="Phishing Detected"
            value={stats?.phishingDetected || 0}
            color="var(--color-red)"
            subtitle={`${stats?.phishingRate || 0}% threat ratio`}
          />
          <StatCard
            code="SAFE"
            title="Legitimate URLs"
            value={stats?.legitimateDetected || 0}
            color="var(--color-green)"
            subtitle="Verified authentic"
          />
          <StatCard
            code="RATIO"
            title="Threat Rate"
            value={`${stats?.phishingRate || 0}%`}
            color="var(--color-yellow)"
            subtitle="Relative proportion"
          />
        </div>

        {/* Charts Row */}
        <div className="charts-row">
          {/* Weekly Bar Chart */}
          <div className="card chart-card">
            <h3>Inspection Activity Timeline</h3>
            {weeklyChart && weeklyChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={weeklyChart}>
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 8 }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="phishing" name="Phishing" fill="#ef4444" radius={[4,4,0,0]} />
                  <Bar dataKey="legitimate" name="Legitimate" fill="#10b981" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                <p>No activity recorded in the past 7 days.</p>
                <Link to="/scanner" className="btn btn-outline" style={{ marginTop: 12 }}>Inspect a URL</Link>
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="card chart-card">
            <h3>Classification Ratio</h3>
            {stats?.totalScans > 0 ? (
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 8 }}
                  />
                  <Legend
                    formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 13 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                <p>No classification data available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Scans */}
        <div className="card recent-scans-card">
          <div className="recent-header">
            <h3>Recent Scan Activity</h3>
            <Link to="/history" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}>All History</Link>
          </div>
          {recentScans && recentScans.length > 0 ? (
            <div className="recent-list">
              {recentScans.map((scan, i) => (
                <div key={scan._id || i} className="recent-item">
                  <div className="recent-url">
                    <span className={`result-dot ${scan.prediction}`}></span>
                    <span className="url-text" title={scan.url}>{scan.url}</span>
                  </div>
                  <div className="recent-meta">
                    <span className={`badge badge-${scan.prediction}`}>
                      {scan.prediction.toUpperCase()}
                    </span>
                    <span className="scan-score">Risk: {scan.riskScore}/100</span>
                    <span className="scan-date">
                      {new Date(scan.scannedAt).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="chart-empty">
              <p>No recent scans found. <Link to="/scanner">Submit a URL to analyze.</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
