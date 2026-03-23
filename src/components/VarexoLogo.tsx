import React from 'react';

interface VarexoLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

const VarexoLogo: React.FC<VarexoLogoProps> = ({ size = 32, showText = false, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left side of V - lighter */}
        <polygon
          points="10,15 50,90 38,90 5,25"
          fill="url(#gradLeft)"
        />
        {/* Right side of V - darker */}
        <polygon
          points="90,15 50,90 62,90 95,25"
          fill="url(#gradRight)"
        />
        {/* Center highlight */}
        <polygon
          points="50,90 35,55 50,45 65,55"
          fill="url(#gradCenter)"
          opacity="0.8"
        />
        {/* Left facet */}
        <polygon
          points="10,15 38,15 50,45 35,55"
          fill="url(#gradLeftFacet)"
          opacity="0.9"
        />
        {/* Right facet */}
        <polygon
          points="90,15 62,15 50,45 65,55"
          fill="url(#gradRightFacet)"
          opacity="0.9"
        />
        <defs>
          <linearGradient id="gradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="gradRight" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="100%" stopColor="#065f46" />
          </linearGradient>
          <linearGradient id="gradCenter" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="gradLeftFacet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id="gradRightFacet" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-extrabold tracking-tight text-white">VAREXO</span>
          <span className="text-[9px] tracking-[0.25em] text-primary-400 font-medium">ICT &bull; WEBSITES &bull; SOFTWARE</span>
        </div>
      )}
    </div>
  );
};

export default VarexoLogo;
