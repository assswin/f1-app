import React from 'react';
import TrackerApp from '../tracker/App';

const CircuitTracker = () => {
  return (
    <div className="page-wrapper" style={{ padding: 0 }}>
      {/* We reset padding to 0 because the tracker app assumes a full screen layout, 
          but we still might need to offset the fixed navbar manually if needed. 
          The tracker layout uses min-h-screen. Let's add a top padding to avoid navbar overlap. */}
      <div style={{ paddingTop: '80px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TrackerApp />
      </div>
    </div>
  );
};

export default CircuitTracker;
