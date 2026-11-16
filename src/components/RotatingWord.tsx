import React, { useEffect, useState } from 'react';

// Word that cycles through a list with a vertical slide
const RotatingWord: React.FC<{ words: string[]; className?: string }> = ({ words, className = 'serif text-primary-300' }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <span className="rotator">
      {words.map((w, idx) => (
        <span key={w} className={`rotator-word ${className} ${idx === i ? 'is-in' : idx === (i - 1 + words.length) % words.length ? 'is-out' : ''}`}>{w}</span>
      ))}
      <span className={`invisible ${className}`}>{words.reduce((a, b) => (a.length > b.length ? a : b))}</span>
    </span>
  );
};

export default RotatingWord;
