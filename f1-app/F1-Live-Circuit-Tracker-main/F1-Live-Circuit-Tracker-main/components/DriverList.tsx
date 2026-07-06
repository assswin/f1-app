import React from 'react';
import { useRaceStore } from '../store/useRaceStore';
import { Card } from './ui/Card';
import { ChevronRight } from 'lucide-react';
import { DriverState } from '../types';

export const DriverList: React.FC = () => {
  const { drivers, focusDriverNumber, setFocusDriver } = useRaceStore();

  const sortedDrivers = (Object.values(drivers) as DriverState[]).sort((a, b) => {
    // Basic sorting by position if available, else driver number
    if (a.position && b.position) return a.position - b.position;
    return a.driver_number - b.driver_number;
  });

  return (
    <div className="flex flex-col h-full bg-surface/50 border-r border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-bold text-muted uppercase tracking-wider">Standings</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sortedDrivers.map((driver) => {
            const isFocus = focusDriverNumber === driver.driver_number;
            return (
                <div 
                    key={driver.driver_number}
                    onClick={() => setFocusDriver(driver.driver_number)}
                    className={`
                        group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all
                        ${isFocus ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5 border border-transparent'}
                    `}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center justify-center w-6">
                             <span className="text-xs font-mono text-muted">{driver.position || '-'}</span>
                        </div>
                        <div className="w-1 h-8 rounded-full" style={{ backgroundColor: driver.team_colour }} />
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">{driver.name_acronym}</span>
                            <span className="text-[10px] text-muted uppercase truncate max-w-[80px]">
                                {driver.team_name}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end text-right">
                         {driver.gap_to_leader && (
                             <span className="text-xs font-mono text-muted">
                                 {driver.gap_to_leader}
                             </span>
                         )}
                         {driver.interval && driver.interval !== driver.gap_to_leader && (
                             <span className="text-[10px] font-mono text-neutral-500">
                                 +{driver.interval}
                             </span>
                         )}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};