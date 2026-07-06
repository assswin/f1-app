import React from 'react';
import { useRaceStore } from '../store/useRaceStore';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Wind, Thermometer, CloudRain, Gauge, Zap, TrendingUp, History } from 'lucide-react';
import { format } from 'date-fns';

export const TelemetryPanel: React.FC = () => {
  const { drivers, focusDriverNumber, weather, overtakes } = useRaceStore();
  const focusedDriver = focusDriverNumber ? drivers[focusDriverNumber] : null;

  return (
    <div className="flex flex-col h-full bg-surface/50 border-l border-border overflow-y-auto p-4 space-y-4">
      
      {/* Weather Card */}
      <Card>
        <CardHeader>
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-2">
            <CloudRain className="w-3 h-3 text-primary" />
            Track Conditions
          </h3>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
           <div className="flex items-center gap-3">
               <div className="p-2 bg-neutral-800 rounded-full text-orange-400">
                   <Thermometer className="w-4 h-4" />
               </div>
               <div>
                   <div className="text-[10px] text-muted uppercase">Air</div>
                   <div className="font-mono text-sm">{weather?.air_temperature ?? '--'}°C</div>
               </div>
           </div>
           <div className="flex items-center gap-3">
               <div className="p-2 bg-neutral-800 rounded-full text-red-400">
                   <ActivityIcon className="w-4 h-4" />
               </div>
               <div>
                   <div className="text-[10px] text-muted uppercase">Track</div>
                   <div className="font-mono text-sm">{weather?.track_temperature ?? '--'}°C</div>
               </div>
           </div>
           <div className="flex items-center gap-3">
               <div className="p-2 bg-neutral-800 rounded-full text-blue-400">
                   <CloudRain className="w-4 h-4" />
               </div>
               <div>
                   <div className="text-[10px] text-muted uppercase">Rain</div>
                   <div className="font-mono text-sm">{weather?.rainfall ? 'YES' : 'NO'}</div>
               </div>
           </div>
           <div className="flex items-center gap-3">
               <div className="p-2 bg-neutral-800 rounded-full text-gray-400">
                   <Wind className="w-4 h-4" />
               </div>
               <div>
                   <div className="text-[10px] text-muted uppercase">Wind</div>
                   <div className="font-mono text-sm">{weather?.wind_speed ?? '--'} m/s</div>
               </div>
           </div>
        </CardContent>
      </Card>

      {/* Driver Telemetry */}
      {focusedDriver ? (
          <Card className="flex-none min-h-[300px] border-t-4" style={{ borderColor: focusedDriver.team_colour }}>
              <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                      <h2 className="text-lg font-bold tracking-tight">{focusedDriver.name_acronym}</h2>
                      <p className="text-[10px] text-muted uppercase font-bold">{focusedDriver.team_name}</p>
                  </div>
                  <div className="text-right">
                      <div className="text-3xl font-mono font-bold leading-none text-primary">
                          {focusedDriver.position ? `P${focusedDriver.position}` : '-'}
                      </div>
                  </div>
              </CardHeader>
              <CardContent className="space-y-6">
                  {/* Speed Gauge Simulation */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-neutral-900/50 border border-border/50 rounded p-2">
                          <div className="text-[9px] text-muted uppercase font-bold mb-1">Speed</div>
                          <div className="text-xl font-mono font-bold text-white leading-none">
                              {focusedDriver.speed ?? 0}
                          </div>
                          <div className="text-[9px] text-muted mt-1 uppercase">km/h</div>
                      </div>
                      <div className="bg-neutral-900/50 border border-border/50 rounded p-2">
                          <div className="text-[9px] text-muted uppercase font-bold mb-1">Gear</div>
                          <div className="text-2xl font-mono font-bold text-primary leading-none">
                              {focusedDriver.gear ?? '-'}
                          </div>
                      </div>
                      <div className="bg-neutral-900/50 border border-border/50 rounded p-2">
                          <div className="text-[9px] text-muted uppercase font-bold mb-1">RPM</div>
                          <div className="text-xl font-mono font-bold text-white leading-none">
                              {focusedDriver.rpm ?? 0}
                          </div>
                      </div>
                  </div>

                  {/* Throttle / Brake Bars */}
                  <div className="space-y-3">
                      <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] uppercase font-bold text-muted">
                              <span>Throttle</span>
                              <span className="text-green-400 font-mono">{focusedDriver.throttle ?? 0}%</span>
                          </div>
                          <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                              <div 
                                  className="h-full bg-green-500 transition-all duration-150 ease-out" 
                                  style={{ width: `${focusedDriver.throttle ?? 0}%` }}
                              />
                          </div>
                      </div>
                      <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] uppercase font-bold text-muted">
                              <span>Brake</span>
                              <span className="text-red-400 font-mono">{focusedDriver.brake ?? 0}%</span>
                          </div>
                          <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                              <div 
                                  className="h-full bg-red-500 transition-all duration-150 ease-out" 
                                  style={{ width: `${focusedDriver.brake ?? 0}%` }}
                              />
                          </div>
                      </div>
                  </div>
                  
                  {/* DRS Status */}
                  <div className="flex items-center justify-between p-2.5 bg-neutral-900/50 rounded border border-border/50">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider">DRS STATUS</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold ${focusedDriver.drs === 10 || focusedDriver.drs === 12 || focusedDriver.drs === 14 ? 'text-green-500' : 'text-neutral-500'}`}>
                            {focusedDriver.drs === 10 || focusedDriver.drs === 12 || focusedDriver.drs === 14 ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                        <div className={`w-2.5 h-2.5 rounded-full ${focusedDriver.drs === 10 || focusedDriver.drs === 12 || focusedDriver.drs === 14 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-neutral-800'}`} />
                      </div>
                  </div>
              </CardContent>
          </Card>
      ) : (
          <div className="flex-none h-[180px] flex items-center justify-center border border-dashed border-border rounded-xl text-muted text-xs text-center p-6 bg-surface/30">
              <div>
                  <Zap className="w-5 h-5 mx-auto mb-2 opacity-20" />
                  Select a driver from the list<br/>to view live car telemetry.
              </div>
          </div>
      )}
      
      {/* Overtake Feed */}
      <Card className="flex-1 min-h-0 flex flex-col">
          <CardHeader className="flex-none border-b border-border/50">
              <h3 className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-primary" />
                Live Overtake Feed
              </h3>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-2 space-y-2 mt-2">
              {overtakes.length > 0 ? overtakes.map((event) => {
                  const attacker = drivers[event.driver_number];
                  const defender = drivers[event.overtaken_driver_number];
                  
                  if (!attacker || !defender) return null;

                  return (
                      <div key={event.id} className="relative bg-neutral-900/40 hover:bg-neutral-800/50 border border-border/30 rounded-lg p-2.5 transition-colors overflow-hidden group">
                          <div 
                            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" 
                            style={{ backgroundColor: attacker.team_colour }}
                          />
                          <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[9px] font-mono text-muted uppercase">Lap {event.lap}</span>
                              <span className="text-[9px] font-mono text-neutral-600">{format(new Date(event.date), 'HH:mm:ss')}</span>
                          </div>
                          <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                  <span className="text-sm font-bold leading-none">{attacker.name_acronym}</span>
                                  <span className="text-[9px] text-muted uppercase truncate max-w-[60px]">{attacker.team_name}</span>
                              </div>
                              <div className="flex items-center justify-center px-3 text-primary">
                                  <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              </div>
                              <div className="flex flex-col items-end">
                                  <span className="text-sm font-bold leading-none text-neutral-400">{defender.name_acronym}</span>
                                  <span className="text-[9px] text-neutral-600 uppercase truncate max-w-[60px]">{defender.team_name}</span>
                              </div>
                          </div>
                      </div>
                  );
              }) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 opacity-30">
                      <History className="w-8 h-8" />
                      <div className="text-[10px] text-muted uppercase font-bold tracking-widest leading-relaxed">
                          Monitoring Track Activity...<br/>Waiting for Position Changes
                      </div>
                  </div>
              )}
          </CardContent>
      </Card>
    </div>
  );
};

// Icon helper
const ActivityIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);