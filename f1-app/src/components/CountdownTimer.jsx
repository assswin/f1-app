import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './CountdownTimer.css';

const CountdownTimer = ({ targetDate, eventName }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];
  Object.keys(timeLeft).forEach((interval) => {
    if (timeLeft[interval] !== undefined) {
      timerComponents.push(
        <div key={interval} className="countdown-box glass-panel">
          <span className="countdown-value">{String(timeLeft[interval]).padStart(2, '0')}</span>
          <span className="countdown-label">{interval}</span>
        </div>
      );
    }
  });

  return (
    <motion.div 
      className="countdown-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="countdown-header">
        <span className="live-dot"></span> NEXT RACE: {eventName}
      </div>
      <div className="countdown-timer">
        {timerComponents.length ? timerComponents : <span>Race is live!</span>}
      </div>
    </motion.div>
  );
};

export default CountdownTimer;
