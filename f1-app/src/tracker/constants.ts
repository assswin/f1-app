export const API_BASE = '/api/openf1';

export const TEAM_COLORS: Record<string, string> = {
  'Red Bull Racing': '#3671C6',
  'McLaren': '#FF8000',
  'Ferrari': '#E80020',
  'Mercedes': '#27F4D2',
  'Aston Martin': '#229971',
  'RB': '#6692FF',
  'Haas F1 Team': '#B6BABD',
  'Williams': '#64C4FF',
  'Alpine': '#0093CC',
  'Kick Sauber': '#52E252',
  'Sauber': '#52E252',
};

// Fallback color if API team_colour is missing or invalid
export const DEFAULT_COLOR = '#FFFFFF';

// Helper to sanitize team colors from API (sometimes they lack #)
export const getTeamColor = (hex?: string, teamName?: string) => {
  if (hex && hex.length >= 6) {
    return hex.startsWith('#') ? hex : `#${hex}`;
  }
  if (teamName && TEAM_COLORS[teamName]) {
    return TEAM_COLORS[teamName];
  }
  return DEFAULT_COLOR;
};

// Circuit bounding box estimations (fallback if we don't have perfect circuit data)
// In a real app, this would be a large JSON file with strict bounds per circuit_key
export const DEFAULT_CIRCUIT_BOUNDS = {
  minX: -15000,
  maxX: 15000,
  minY: -15000,
  maxY: 15000,
};
