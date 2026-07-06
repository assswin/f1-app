import React from 'react';
import { DriverList } from './DriverList';
import { CircuitMap } from './CircuitMap';
import { TelemetryPanel } from './TelemetryPanel';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left: Drivers */}
      <div className="w-[300px] shrink-0 h-full border-r border-border bg-surface/30 overflow-y-auto">
        <DriverList />
      </div>

      {/* Center: Circuit */}
      <div className="flex-1 min-w-0 h-full relative bg-neutral-950">
         {/* We use a ResizeObserver in a real app, strict dims here for MVP */}
         <div className="absolute inset-0 flex items-center justify-center">
             <CircuitMap width={800} height={600} />
         </div>
      </div>

      {/* Right: Telemetry */}
      <div className="w-[350px] shrink-0 h-full border-l border-border bg-surface/30">
        <TelemetryPanel />
      </div>
    </div>
  );
};
