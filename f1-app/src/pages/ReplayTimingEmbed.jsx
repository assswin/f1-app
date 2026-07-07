import React from 'react';
import './ReplayTimingEmbed.css';

const ReplayTimingEmbed = () => {
  return (
    <div className="replay-embed-page">
      <div className="embed-container">
        {/* We use an iframe to embed the F1ReplayTiming application */}
        {/* Make sure the backend is running on port 8000! */}
        <iframe 
          src="http://localhost:8000" 
          title="F1 Replay Timing"
          className="timing-iframe"
          allowFullScreen
        ></iframe>
      </div>
      <div className="embed-warning">
        If you see an error above, ensure the F1 Replay Timing backend is running on <strong>http://localhost:8000</strong>
      </div>
    </div>
  );
};

export default ReplayTimingEmbed;
