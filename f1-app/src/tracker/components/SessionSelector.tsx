import React, { useEffect, useState } from 'react';
import { useRaceStore } from '../store/useRaceStore';
import { OpenF1 } from '../services/openf1Service';
import { Session, AppMode } from '../types';
import { Play, Pause, FastForward, Activity, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const SessionSelector: React.FC = () => {
  const { 
    currentSession, 
    setSession, 
    mode, 
    setMode, 
    isPlaying, 
    togglePlay, 
    playbackSpeed, 
    setPlaybackSpeed,
    currentTime 
  } = useRaceStore();
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      try {
        // Default to current year 2024 or 2023 for demo data availability
        const data = await OpenF1.getSessions(2023); 
        // Filter for Races only for cleaner demo
        const raceSessions = data.filter(s => s.session_name === 'Race').reverse();
        setSessions(raceSessions);
        if (raceSessions.length > 0 && !currentSession) {
          setSession(raceSessions[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
    // eslint-disable-next-line
  }, []);

  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const s = sessions.find(sess => sess.session_key === parseInt(e.target.value));
    if (s) setSession(s);
  };

  return (
    <div className="h-16 border-b border-border bg-background/80 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tighter">
          <Activity className="w-6 h-6" />
          <span>F1 TRACKER</span>
        </div>
        
        <div className="h-6 w-px bg-border mx-2" />

        <select 
          className="bg-surface border border-border rounded px-3 py-1 text-sm focus:outline-none focus:border-primary"
          value={currentSession?.session_key || ''}
          onChange={handleSessionChange}
          disabled={loading}
        >
          {loading ? <option>Loading...</option> : sessions.map(s => (
            <option key={s.session_key} value={s.session_key}>
              {s.year} {s.country_name} - {s.session_name}
            </option>
          ))}
        </select>


      </div>

      <div className="flex items-center gap-4">
        {/* Playback Controls (Visible in Replay) */}
        {mode === AppMode.REPLAY && (
            <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted tabular-nums">
                    {format(new Date(currentTime), 'HH:mm:ss')}
                </span>
                <button 
                    onClick={togglePlay} 
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>
                <div className="flex gap-1 text-xs font-mono">
                    {[1, 5, 10].map(speed => (
                        <button 
                            key={speed}
                            onClick={() => setPlaybackSpeed(speed)}
                            className={`px-2 py-0.5 rounded ${playbackSpeed === speed ? 'bg-white text-black' : 'bg-surface border border-border'}`}
                        >
                            {speed}x
                        </button>
                    ))}
                </div>
            </div>
        )}
        

      </div>
    </div>
  );
};
