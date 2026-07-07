import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSchedule, getLatestRaceResult, getRaceResult, getLapData, getPitStops } from '../services/api';
import { constructors } from '../data/f1Data';
import './LiveTiming.css';
import { TrendingUp, History } from 'lucide-react';

const LiveTiming = () => {
  const [schedule, setSchedule] = useState([]);
  const [selectedRound, setSelectedRound] = useState('latest');
  const [raceData, setRaceData] = useState(null);
  const [lapData, setLapData] = useState([]);
  const [pitData, setPitData] = useState([]);
  const [overtakes, setOvertakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Initial load: Fetch schedule and default to latest race
  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      const sched = await getSchedule('current'); // Current year schedule
      if (isMounted) {
        // Filter out races that haven't happened yet (no results)
        // Usually past races have a date in the past, but we can just list them all.
        setSchedule(sched);
      }
    };
    init();
    
    return () => { isMounted = false; };
  }, []);

  // Fetch data when the selected round changes
  useEffect(() => {
    let isMounted = true;
    let intervalId;

    const fetchDashboardData = async (isInitial = false) => {
      if (isInitial) setLoading(true);
      try {
        let result;
        if (selectedRound === 'latest') {
          result = await getLatestRaceResult();
        } else {
          result = await getRaceResult('current', selectedRound);
        }
        
        if (result && isMounted) {
          setRaceData(result);
          
          const [laps, pits] = await Promise.all([
            getLapData(result.season, result.round),
            getPitStops(result.season, result.round)
          ]);
          
          if (isMounted) {
            setLapData(laps);
            setPitData(pits);
            setOvertakes(computeOvertakes(laps));
          }
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        if (isMounted && isInitial) setLoading(false);
      }
    };

    fetchDashboardData(true);
    intervalId = setInterval(() => fetchDashboardData(false), 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [selectedRound]);

  // Compute overtakes from lap data
  const computeOvertakes = (laps) => {
    let overtakesList = [];
    let previousPositions = {};
    
    const sortedLaps = [...laps].sort((a, b) => parseInt(a.number) - parseInt(b.number));

    sortedLaps.forEach((lap) => {
      const currentPositions = {};
      lap.Timings.forEach(t => {
        currentPositions[t.driverId] = parseInt(t.position);
      });

      if (Object.keys(previousPositions).length > 0) {
        lap.Timings.forEach(t => {
          const driverId = t.driverId;
          const currentPos = parseInt(t.position);
          const prevPos = previousPositions[driverId];

          if (prevPos && currentPos < prevPos) {
            Object.keys(previousPositions).forEach(otherDriver => {
              if (otherDriver !== driverId) {
                const otherPrevPos = previousPositions[otherDriver];
                const otherCurrentPos = currentPositions[otherDriver];
                
                if (otherPrevPos < prevPos && otherCurrentPos > currentPos) {
                  overtakesList.push({
                    id: `lap${lap.number}-${driverId}-${otherDriver}`,
                    lap: lap.number,
                    attacker: driverId,
                    defender: otherDriver
                  });
                }
              }
            });
          }
        });
      }
      previousPositions = currentPositions;
    });
    
    return overtakesList.reverse(); // Show newest first
  };

  const getTeamColor = (constructorId) => {
    const team = constructors.find(c => c.id === constructorId || c.name.toLowerCase().includes(constructorId.toLowerCase()));
    return team ? team.color : '#ffffff';
  };

  const getDriverCode = (driverOrId) => {
    if (typeof driverOrId === 'string') {
      // It's a driverId from overtakes or laps, find in raceData
      const driverObj = raceData?.Results?.find(r => r.Driver.driverId === driverOrId)?.Driver;
      if (driverObj) return driverObj.code || driverObj.familyName.substring(0, 3).toUpperCase();
      return driverOrId.substring(0, 3).toUpperCase();
    }
    // It's a Driver object
    if (driverOrId.code) return driverOrId.code;
    return driverOrId.familyName.substring(0, 3).toUpperCase();
  };

  const getDriverTeamColor = (driverId) => {
    const result = raceData?.Results?.find(r => r.Driver.driverId === driverId);
    if (result) return getTeamColor(result.Constructor.constructorId);
    return '#ffffff';
  };

  if (loading && !raceData) {
    return (
      <div className="live-timing-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <h2>Syncing Race Telemetry...</h2>
        </div>
      </div>
    );
  }

  const displayLaps = [...lapData].reverse();

  return (
    <div className="live-timing-page">
      <div className="live-header">
        <div className="live-title">
          <h1>Race Dashboard</h1>
          <span className="live-indicator">LIVE TRACKING</span>
          
          <select 
            className="session-selector"
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
          >
            <option value="latest">Latest Race</option>
            {schedule.map(race => {
              // Only show races that are in the past
              if (new Date(race.date) < new Date()) {
                return (
                  <option key={race.round} value={race.round}>
                    R{race.round} - {race.raceName}
                  </option>
                );
              }
              return null;
            })}
          </select>
        </div>
        
        {raceData && (
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ margin: 0 }}>{raceData.raceName}</h3>
            <p style={{ margin: '5px 0 0', color: '#888' }}>Season {raceData.season} - Round {raceData.round}</p>
          </div>
        )}
      </div>

      {!raceData && !loading ? (
        <div className="loading-spinner">
          <h2>No Race Data Available</h2>
          <p>Please check your connection or try again later.</p>
        </div>
      ) : (
        <div className="dashboard-layout">
          
          {/* PANEL 1: RACE STANDINGS */}
          <div className="panel">
            <div className="panel-header">
              Race Standings
            </div>
            <div className="panel-content standings-list">
              {raceData.Results?.map(result => {
                const isSelected = selectedDriver === result.Driver.driverId;
                const color = getTeamColor(result.Constructor.constructorId);
                
                return (
                  <div 
                    key={result.Driver.driverId} 
                    className={`driver-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedDriver(isSelected ? null : result.Driver.driverId)}
                  >
                    <div className="driver-info-left">
                      <span className="pos">{result.position}</span>
                      <div className="team-color-bar" style={{ backgroundColor: color }}></div>
                      <span className="name">{getDriverCode(result.Driver)}</span>
                    </div>
                    <div className="driver-info-right">
                      <span className="gap">
                        {result.Time ? result.Time.time : result.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PANEL 2: LAP-BY-LAP TIMING */}
          <div className="panel">
            <div className="panel-header">
              Lap Timing Log
            </div>
            <div className="panel-content relative">
              {loading && <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur z-10"><div className="spinner"></div></div>}
              <div className="lap-chart-container">
                {displayLaps.map(lap => (
                  <div key={lap.number} className="lap-row">
                    <div className="lap-header">LAP {lap.number}</div>
                    <div className="lap-times">
                      {lap.Timings
                        .filter(t => !selectedDriver || t.driverId === selectedDriver)
                        .slice(0, selectedDriver ? 1 : 10)
                        .map(timing => (
                        <div key={timing.driverId} className="lap-time-card">
                          <span style={{ color: '#aaa', fontSize: '0.8rem' }}>{getDriverCode(timing.driverId)}</span>
                          <span>{timing.time}</span>
                        </div>
                      ))}
                      {!selectedDriver && lap.Timings.length > 10 && (
                        <div className="lap-time-card" style={{ justifyContent: 'center', color: '#666' }}>
                          +{lap.Timings.length - 10} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PANEL 3: OVERTAKES & PIT STOPS (Stacked) */}
          <div className="right-panels-container">
            
            <div className="panel right-half-panel">
              <div className="panel-header flex items-center gap-2">
                <TrendingUp size={16} className="text-accent-red" />
                Live Overtake Feed
              </div>
              <div className="panel-content overtakes-list">
                {overtakes.length > 0 ? overtakes.map((event) => (
                    <div key={event.id} className="overtake-item">
                        <div className="overtake-lap">Lap {event.lap}</div>
                        <div className="overtake-drivers">
                            <div className="attacker">
                                <span className="code">{getDriverCode(event.attacker)}</span>
                                <div className="color-dot" style={{ backgroundColor: getDriverTeamColor(event.attacker) }}></div>
                            </div>
                            <TrendingUp size={14} className="overtake-icon" />
                            <div className="defender">
                                <div className="color-dot" style={{ backgroundColor: getDriverTeamColor(event.defender) }}></div>
                                <span className="code">{getDriverCode(event.defender)}</span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="empty-state">
                        <History size={32} />
                        <p>No position changes detected.</p>
                    </div>
                )}
              </div>
            </div>

            <div className="panel right-half-panel">
              <div className="panel-header">
                Pit Stops
              </div>
              <div className="panel-content">
                {pitData.length > 0 ? (
                  pitData.map((pit, idx) => (
                    <div key={`${pit.driverId}-${pit.stop}-${idx}`} className="pit-stop-item">
                      <div>
                        <div className="pit-driver">{getDriverCode(pit.driverId)}</div>
                        <div className="pit-lap">Lap {pit.lap} • Stop {pit.stop}</div>
                      </div>
                      <div className="pit-duration">{pit.duration}s</div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No pit stop data available.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default LiveTiming;