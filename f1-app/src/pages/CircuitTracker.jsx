import React from 'react';
import TrackerApp from '../tracker/App';

const CircuitTracker = () => {
  return (
    <div className="w-full h-screen pt-[80px] flex flex-col bg-background relative z-10">
      <TrackerApp />
    </div>
  );
};

export default CircuitTracker;
