import React from 'react';

// Illustrated round conference speaker (Jabra Speak style) with an animated
// listening ring. Drawn in SVG so no third-party product photo is needed.
const SpeakerVisual: React.FC<{ className?: string; listening?: boolean }> = ({ className = '', listening = true }) => (
  <div className={`speaker-visual ${listening ? 'is-listening' : ''} ${className}`}>
    <span className="speaker-wave w1" />
    <span className="speaker-wave w2" />
    <span className="speaker-wave w3" />
    <svg viewBox="0 0 400 400" className="relative w-full h-full" aria-label="Jabra Speak speaker" role="img">
      <defs>
        <radialGradient id="spk-body" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#3b4252" />
          <stop offset="55%" stopColor="#1f2430" />
          <stop offset="100%" stopColor="#0b0e14" />
        </radialGradient>
        <radialGradient id="spk-top" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#2a303c" />
          <stop offset="100%" stopColor="#12151c" />
        </radialGradient>
        <pattern id="spk-mesh" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="1.1" fill="#4b5363" />
        </pattern>
        <linearGradient id="spk-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="spk-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="spk-shadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="28" stdDeviation="22" floodColor="#000" floodOpacity="0.7" />
        </filter>
      </defs>

      {/* body */}
      <g filter="url(#spk-shadow)">
        <ellipse cx="200" cy="232" rx="168" ry="74" fill="#07090d" />
        <ellipse cx="200" cy="214" rx="170" ry="76" fill="url(#spk-body)" />
      </g>
      {/* top face */}
      <ellipse cx="200" cy="200" rx="158" ry="68" fill="url(#spk-top)" />
      <ellipse cx="200" cy="200" rx="140" ry="58" fill="url(#spk-mesh)" opacity="0.85" />
      {/* LED ring */}
      <ellipse cx="200" cy="200" rx="150" ry="64" fill="none" stroke="url(#spk-ring)" strokeWidth="5" className="speaker-led" filter="url(#spk-glow)" />
      <ellipse cx="200" cy="200" rx="150" ry="64" fill="none" stroke="url(#spk-ring)" strokeWidth="2.5" className="speaker-led" />
      {/* centre button */}
      <ellipse cx="200" cy="198" rx="44" ry="19" fill="#0d1017" stroke="#2c3240" strokeWidth="1.5" />
      <ellipse cx="200" cy="196" rx="38" ry="15" fill="#161a23" />
      <text x="200" y="201" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="13" letterSpacing="2" fill="#cbd5e1">JABRA</text>
      {/* side buttons */}
      {[-95, -55, 55, 95].map((dx, i) => (
        <ellipse key={i} cx={200 + dx} cy={200 + (Math.abs(dx) > 70 ? 14 : 30)} rx="11" ry="5" fill="#0f1218" stroke="#323848" strokeWidth="1" />
      ))}
      {/* highlight */}
      <ellipse cx="160" cy="168" rx="70" ry="16" fill="#fff" opacity="0.05" />
    </svg>
  </div>
);

export default SpeakerVisual;
