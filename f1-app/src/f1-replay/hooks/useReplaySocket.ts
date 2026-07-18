import { useState, useEffect, useRef, useCallback } from "react";

export interface ReplayDriver {
  abbr: string;
  x: number;
  y: number;
  color: string;
  team: string;
  position: number | null;
  grid_position: number | null;
  compound: string | null;
  tyre_life: number | null;
  pit_stops: number;
  in_pit: boolean;
  pit_time: number | null;
  finished: boolean;
  tyre_history: string[];
  gap: string | null;
  interval: string | null;
  best_lap_time: string | null;
  has_fastest_lap: boolean;
  flag: "investigation" | "penalty" | null;
  retired: boolean;
  knocked_out?: boolean;
  pit_start: boolean;
  no_timing: boolean;
  relative_distance: number;
  speed: number | null;
  throttle: number | null;
  brake: boolean;
  gear: number | null;
  rpm: number | null;
  drs: number | null;
  pit_prediction: number | null;
  pit_prediction_margin: number | null;
  pit_prediction_free_air: number | null;
  sectors: { num: number; color: "purple" | "green" | "yellow" }[] | null;
}

export interface WeatherData {
  air_temp: number;
  track_temp: number;
  humidity: number;
  rainfall: boolean;
  wind_speed: number;
  wind_direction: number;
}

export interface QualiPhase {
  phase: string;
  elapsed: number;
  remaining: number;
}

export interface RCMessage {
  message: string;
  category: string;
  timestamp: number;
  lap?: number;
  racing_number?: string;
}

export interface ReplayFrame {
  timestamp: number;
  lap: number;
  total_laps: number;
  session_type?: string;
  drivers: ReplayDriver[];
  status: string;
  weather?: WeatherData;
  quali_phase?: QualiPhase;
  rc_messages?: RCMessage[];
  red_flag_end?: number;
  sector_flags?: { sector: number; flag: string; driver: string }[];
  safety_car?: { x: number; y: number; phase: string; alpha: number } | null;
}

export interface QualiPhaseInfo {
  phase: string;
  timestamp: number;
}

interface ReplayState {
  connected: boolean;
  ready: boolean;
  loading: boolean;
  playing: boolean;
  speed: number;
  frame: ReplayFrame | null;
  totalTime: number;
  totalLaps: number;
  qualiPhases: QualiPhaseInfo[];
  finished: boolean;
  error: string | null;
  statusMessage: string | null;
  sessionData: any | null;
  trackData: any | null;
  lapsData: any | null;
}

export function useReplaySocket(year: number, round: number, sessionType: string = "R") {
  const [state, setState] = useState<ReplayState>({
    connected: false,
    ready: false,
    loading: true,
    playing: false,
    speed: 1,
    frame: null,
    totalTime: 0,
    totalLaps: 0,
    qualiPhases: [],
    finished: false,
    error: null,
    statusMessage: null,
    sessionData: null,
    trackData: null,
    lapsData: null,
  });

  const framesRef = useRef<ReplayFrame[]>([]);
  const currentFrameIndexRef = useRef(0);
  const playingRef = useRef(false);
  const speedRef = useRef(1);
  const animationRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Load the static JSON file once
  useEffect(() => {
    setState((s) => ({ ...s, loading: true, statusMessage: "Downloading telemetry data..." }));
    
    // In production, you would fetch from /data/{year}/{round}/replay_{sessionType}.json
    // For this example we'll assume the JSON is available at that path
    fetch(`/data/${year}/${round}/replay_${sessionType}.json`)
      .then(res => {
        if (!res.ok) throw new Error("Replay data not found for this race.");
        return res.json();
      })
      .then(data => {
        framesRef.current = data.frames;
        
        const totalLaps = data.total_laps || 0;
        const totalTime = data.frames.length > 0 ? data.frames[data.frames.length - 1].timestamp : 0;
        
        setState((s) => ({
          ...s,
          connected: true,
          ready: true,
          loading: false,
          statusMessage: null,
          totalLaps,
          totalTime,
          frame: framesRef.current[0] || null,
          sessionData: data.session_data,
          trackData: data.track_data,
          lapsData: data.laps_data,
        }));
      })
      .catch(err => {
        setState((s) => ({ ...s, error: err.message, loading: false }));
      });

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [year, round, sessionType]);

  // Main playback loop
  useEffect(() => {
    const loop = (time: number) => {
      if (!playingRef.current || framesRef.current.length === 0) {
        lastUpdateRef.current = time;
        animationRef.current = requestAnimationFrame(loop);
        return;
      }

      const deltaMs = time - lastUpdateRef.current;
      
      // Target 30fps update rate for smoothness (similar to backend output rate)
      if (deltaMs > (1000 / 30)) {
        // Calculate how many frames to advance based on speed
        // Assuming original frames are ~30Hz (0.033s apart)
        const framesToAdvance = Math.max(1, Math.round((deltaMs / 33) * speedRef.current));
        
        let nextIndex = currentFrameIndexRef.current + framesToAdvance;
        
        if (nextIndex >= framesRef.current.length) {
          nextIndex = framesRef.current.length - 1;
          playingRef.current = false;
          setState(s => ({ ...s, playing: false, finished: true }));
        }
        
        currentFrameIndexRef.current = nextIndex;
        setState(s => ({ ...s, frame: framesRef.current[nextIndex] }));
        
        lastUpdateRef.current = time;
      }
      
      animationRef.current = requestAnimationFrame(loop);
    };
    
    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current!);
  }, []);

  const play = useCallback(() => {
    if (currentFrameIndexRef.current >= framesRef.current.length - 1) {
      currentFrameIndexRef.current = 0; // Restart if at end
    }
    playingRef.current = true;
    lastUpdateRef.current = performance.now();
    setState((s) => ({ ...s, playing: true, finished: false }));
  }, []);

  const pause = useCallback(() => {
    playingRef.current = false;
    setState((s) => ({ ...s, playing: false }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    speedRef.current = speed;
    setState((s) => ({ ...s, speed }));
  }, []);

  const seek = useCallback((timeSec: number) => {
    if (framesRef.current.length === 0) return;
    
    // Find closest frame by timestamp
    // Binary search would be faster but linear is fine for client
    let closestIdx = 0;
    for (let i = 0; i < framesRef.current.length; i++) {
      if (framesRef.current[i].timestamp >= timeSec) {
        closestIdx = i;
        break;
      }
    }
    
    currentFrameIndexRef.current = closestIdx;
    setState((s) => ({ ...s, frame: framesRef.current[closestIdx], finished: false }));
  }, []);

  const seekToLap = useCallback((lap: number) => {
    if (framesRef.current.length === 0) return;
    
    let targetIdx = 0;
    for (let i = 0; i < framesRef.current.length; i++) {
      if (framesRef.current[i].lap >= lap) {
        targetIdx = i;
        break;
      }
    }
    
    currentFrameIndexRef.current = targetIdx;
    setState((s) => ({ ...s, frame: framesRef.current[targetIdx], finished: false }));
  }, []);

  const reset = useCallback(() => {
    currentFrameIndexRef.current = 0;
    playingRef.current = false;
    setState((s) => ({ 
      ...s, 
      playing: false, 
      finished: false, 
      frame: framesRef.current[0] 
    }));
  }, []);

  return { ...state, play, pause, setSpeed, seek, seekToLap, reset };
}

