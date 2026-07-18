export interface Session {
  session_key: number;
  session_name: string;
  date_start: string;
  date_end: string;
  gmt_offset: string;
  session_type: string;
  meeting_key: number;
  location: string;
  country_key: number;
  country_code: string;
  country_name: string;
  circuit_key: number;
  circuit_short_name: string;
  year: number;
}

export interface Driver {
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  headshot_url: string | null;
  country_code: string;
  session_key: number;
  meeting_key: number;
}

export interface Position {
  date: string; // ISO
  driver_number: number;
  x: number;
  y: number;
  z: number;
}

export interface CarData {
  date: string; // ISO
  driver_number: number;
  rpm: number;
  speed: number;
  n_gear: number;
  throttle: number;
  brake: number;
  drs: number;
}

export interface Interval {
  date: string;
  driver_number: number;
  gap_to_leader: number | string | null; // sometimes "1 LAP" or null
  interval: number | string | null;
}

export interface Weather {
  date: string;
  air_temperature: number;
  track_temperature: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  rainfall: number;
}

export interface Overtake {
  id?: string; // generated
  driver_number: number; // Overtaking
  overtaken_driver_number: number; // Overtaken
  lap: number;
  date: string;
}

// Normalized internal state for the app
export interface DriverState extends Driver {
  position: number;
  gap_to_leader?: string;
  interval?: string;
  x?: number;
  y?: number;
  speed?: number;
  rpm?: number;
  gear?: number;
  throttle?: number;
  brake?: number;
  drs?: number;
  last_updated: string;
}

export enum AppMode {
  REPLAY = 'REPLAY',
}