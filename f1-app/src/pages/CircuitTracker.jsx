import React from 'react';
import TrackerApp from '../tracker/App';

const CircuitTracker = () => {
  return (
    <div className="w-full h-screen pt-[80px] flex flex-col bg-background relative z-10 overflow-hidden">
      <div className="flex-1 w-full relative overflow-hidden">
        <TrackerApp />
      </div>
    </div>
  );
};

export default CircuitTracker;
