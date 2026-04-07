import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  language: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, language }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate);
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <span className="text-red-400 font-bold">
        {language === 'nl' ? 'Actie verlopen' : 'Offer expired'}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1 text-xs sm:text-sm">
      <span className="text-gray-500 text-xs sm:text-sm">
        {language === 'nl' ? 'Nog' : 'Only'}
      </span>
      <div className="flex gap-0.5 sm:gap-1">
        {timeLeft.days > 0 && (
          <span className="bg-primary-500/20 text-primary-400 px-1 sm:px-2 py-0.5 rounded font-mono font-bold min-w-[1.5rem] sm:min-w-[2rem] text-center text-xs sm:text-sm">
            {timeLeft.days}d
          </span>
        )}
        <span className="bg-primary-500/20 text-primary-400 px-1 sm:px-2 py-0.5 rounded font-mono font-bold min-w-[1.5rem] sm:min-w-[2rem] text-center text-xs sm:text-sm">
          {String(timeLeft.hours).padStart(2, '0')}h
        </span>
        <span className="bg-primary-500/20 text-primary-400 px-1 sm:px-2 py-0.5 rounded font-mono font-bold min-w-[1.5rem] sm:min-w-[2rem] text-center text-xs sm:text-sm">
          {String(timeLeft.minutes).padStart(2, '0')}m
        </span>
        <span className="bg-primary-500/20 text-primary-400 px-1 sm:px-2 py-0.5 rounded font-mono font-bold min-w-[1.5rem] sm:min-w-[2rem] text-center animate-pulse text-xs sm:text-sm">
          {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>
      <span className="text-gray-500 text-xs sm:text-sm">
        {language === 'nl' ? 'over' : 'left'}
      </span>
    </div>
  );
};

export default CountdownTimer;
