import React from 'react';
import { DriverList } from './DriverList';
import { CircuitMap } from './CircuitMap';
import { TelemetryPanel } from './TelemetryPanel';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="grid grid-cols-12 h-[calc(100vh-64px)] overflow-hidden">
      {/* Left: Drivers (2 cols) */}
      <div className="col-span-12 md:col-span-3 lg:col-span-2 h-full">
        <DriverList />
      </div>

      {/* Center: Circuit (7 cols) */}
      <div className="col-span-12 md:col-span-6 lg:col-span-7 h-[50vh] md:h-full relative bg-neutral-950 border-x border-border">
         {/* We use a ResizeObserver in a real app, strict dims here for MVP */}
         <div className="absolute inset-0">
             <CircuitMap width={800} height={600} />
         </div>
      </div>

      {/* Right: Telemetry (3 cols) */}
      <div className="col-span-12 md:col-span-3 lg:col-span-3 h-full">
        <TelemetryPanel />
      </div>
    </div>
  );
};
