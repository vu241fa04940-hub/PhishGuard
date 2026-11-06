import React from 'react';

export default function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="innerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0b1120" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      {/* Outer Shield Contour */}
      <path
        d="M50 8 L85 24 L85 52 C85 71 65 86 50 92 C35 86 15 71 15 52 L15 24 Z"
        fill="url(#shieldGrad)"
      />
      {/* Inner Shield Body */}
      <path
        d="M50 15 L79 28 L79 52 C79 67 62 81 50 86 C38 81 21 67 21 52 L21 28 Z"
        fill="url(#innerGrad)"
      />
      {/* Network / Link Geometry */}
      <path
        d="M40 50 C40 44.5 44.5 40 50 40 C55.5 40 60 44.5 60 50 C60 55.5 55.5 60 50 60 C44.5 60 40 55.5 40 50 Z"
        stroke="#6366f1"
        strokeWidth="2.5"
        fill="none"
      />
      <circle cx="50" cy="50" r="4" fill="#a855f7" />
      <line x1="50" y1="28" x2="50" y2="38" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="62" x2="50" y2="72" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="26" r="2.5" fill="#a855f7" />
      <circle cx="50" cy="74" r="2.5" fill="#10b981" />
    </svg>
  );
}
