import { useEffect, useRef } from 'react';
import { useRaceStore } from '../store/useRaceStore';
import { OpenF1 } from '../services/openf1Service';
import { AppMode, Position } from '../types';

export const useRaceData = () => {
  const { 
    currentSession, 
    mode, 
    isPlaying, 
    currentTime, 
    playbackSpeed, 
    updateDrivers, 
    updateDriverTelemetry,
    updateWeather,
    setOvertakes,
    setPlaybackTime
  } = useRaceStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const counterRef = useRef<number>(0);

  // 1. Initial Load of Drivers when Session Changes
  useEffect(() => {
    if (!currentSession) return;
    
    const loadDrivers = async () => {
      try {
        const drivers = await OpenF1.getDrivers(currentSession.session_key);
        updateDrivers(drivers);
      } catch (e) {
        console.error("Failed to load drivers", e);
      }
    };
    loadDrivers();
  }, [currentSession, updateDrivers]);

  // 2. Replay Loop / Live Polling Loop
  useEffect(() => {
    if (!currentSession) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    const tickRate = 1000; // UI update tick
    
    const fetchData = async () => {
        const count = counterRef.current;
        counterRef.current += 1;

        try {
            const tDate = new Date(currentTime);
            const windowSizeMs = 1000; 
            const startISO = new Date(tDate.getTime() - windowSizeMs).toISOString();
            const endISO = new Date(tDate.getTime() + windowSizeMs).toISOString();

            const promises: Promise<any>[] = [];
            
            if (count % 3 === 0) {
              promises.push(OpenF1.getPositions(currentSession.session_key, startISO, endISO).then(pos => ({ type: 'pos', data: pos })));
            }
            if (count % 10 === 0) {
              promises.push(OpenF1.getIntervals(currentSession.session_key, startISO).then(intl => ({ type: 'intl', data: intl })));
            }
            if (count % 15 === 0) {
              promises.push(OpenF1.getOvertakes(currentSession.session_key, startISO).then(ov => ({ type: 'overtakes', data: ov })));
            }
            if (count % 60 === 0) {
              promises.push(OpenF1.getWeather(currentSession.session_key, startISO).then(w => ({ type: 'weather', data: w })));
            }

            if (promises.length === 0) return;

            const results = await Promise.allSettled(promises);
            
            results.forEach(res => {
              if (res.status === 'fulfilled') {
                const { type, data } = res.value;
                if (type === 'pos' && data) {
                  data.forEach((p: Position) => {
                    updateDriverTelemetry(p.driver_number, {
                      x: p.x,
                      y: p.y,
                      last_updated: p.date
                    });
                  });
                } else if (type === 'weather' && data && data.length > 0) {
                  updateWeather(data[data.length - 1]);
                } else if (type === 'overtakes' && data) {
                  setOvertakes(data);
                } else if (type === 'intl' && data) {
                  data.forEach((i: any) => {
                    updateDriverTelemetry(i.driver_number, {
                      gap_to_leader: i.gap_to_leader !== null && i.gap_to_leader !== undefined ? i.gap_to_leader.toString() : '-',
                      interval: i.interval !== null && i.interval !== undefined ? i.interval.toString() : '-'
                    });
                  });
                }
              }
            });

        } catch (err) {
            console.error("Data fetch error", err);
        }
    };

    if (isPlaying) {
        intervalRef.current = setInterval(() => {
            if (mode === AppMode.REPLAY && isPlaying) {
                const newTime = new Date(new Date(currentTime).getTime() + (tickRate * playbackSpeed)).toISOString();
                setPlaybackTime(newTime);
                fetchData();
            }
        }, tickRate);
    } else {
        fetchData();
    }

    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentSession, mode, isPlaying, currentTime, playbackSpeed, updateDriverTelemetry, updateWeather, setOvertakes, setPlaybackTime]);
};