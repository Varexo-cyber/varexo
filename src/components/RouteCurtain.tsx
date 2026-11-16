import React from 'react';
import { useLocation } from 'react-router-dom';

// Two panels sweep across the screen on every page change (and on first load).
const RouteCurtain: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="curtain" aria-hidden>
      <div className="curtain-a" />
      <div className="curtain-b"><span className="curtain-logo">varexo</span></div>
    </div>
  );
};

export default RouteCurtain;
