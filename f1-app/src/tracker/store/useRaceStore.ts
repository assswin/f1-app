import { create } from 'zustand';
import { AppMode, Driver, DriverState, Session, Weather, Overtake } from '../types';
import { getTeamColor } from '../constants';

interface RaceState {
  mode: AppMode;
  currentSession: Session | null;
  drivers: Record<number, DriverState>; // Map driver_number -> state
  weather: Weather | null;
  overtakes: Overtake[];
  currentTime: string; // ISO string of simulation time
  isPlaying: boolean;
  playbackSpeed: number; // 1, 2, 5
  focusDriverNumber: number | null;
  
  // Actions
  setMode: (mode: AppMode) => void;
  setSession: (session: Session) => void;
  updateDrivers: (drivers: Driver[]) => void;
  updateDriverTelemetry: (num: number, data: Partial<DriverState>) => void;
  updateWeather: (weather: Weather) => void;
  setOvertakes: (overtakes: Overtake[]) => void;
  addOvertake: (overtake: Overtake) => void;
  setFocusDriver: (num: number | null) => void;
  setPlaybackTime: (time: string) => void;
  setPlaybackSpeed: (speed: number) => void;
  togglePlay: () => void;
}

export const useRaceStore = create<RaceState>((set) => ({
  mode: AppMode.REPLAY,
  currentSession: null,
  drivers: {},
  weather: null,
  overtakes: [],
  currentTime: new Date().toISOString(),
  isPlaying: false,
  playbackSpeed: 1,
  focusDriverNumber: null,

  setMode: (mode) => set({ mode }),
  setSession: (session) => set({ currentSession: session, currentTime: session.date_start, isPlaying: false, overtakes: [] }),
  
  updateDrivers: (rawDrivers) => set((state) => {
    const newDrivers = { ...state.drivers };
    rawDrivers.forEach(d => {
      if (!newDrivers[d.driver_number]) {
        newDrivers[d.driver_number] = {
            ...d,
            team_colour: getTeamColor(d.team_colour, d.team_name),
            position: 0,
            last_updated: new Date().toISOString()
        };
      }
    });
    return { drivers: newDrivers };
  }),

  updateDriverTelemetry: (num, data) => set((state) => {
    const driver = state.drivers[num];
    if (!driver) return {};
    return {
      drivers: {
        ...state.drivers,
        [num]: { ...driver, ...data, last_updated: new Date().toISOString() }
      }
    };
  }),

  updateWeather: (w) => set({ weather: w }),
  setOvertakes: (overtakes) => set({ overtakes }),
  addOvertake: (o) => set((state) => ({ 
    overtakes: [o, ...state.overtakes].slice(0, 50) 
  })),
  setFocusDriver: (num) => set({ focusDriverNumber: num }),
  setPlaybackTime: (time) => set({ currentTime: time }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying }))
}));