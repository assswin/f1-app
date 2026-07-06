import { Session, Driver, Position, CarData, Weather, Interval, Overtake } from '../types';
import { API_BASE } from '../constants';

const CACHE_TTL = 60000; // 1 min for static data
const cache = new Map<string, { data: any; timestamp: number }>();
const inFlightRequests = new Map<string, Promise<any>>();

const fetchWithCache = async <T,>(url: string, ttl = CACHE_TTL): Promise<T> => {
  const now = Date.now();
  
  // 1. Check Memory Cache
  if (cache.has(url)) {
    const cached = cache.get(url)!;
    if (now - cached.timestamp < ttl) {
      return cached.data as T;
    }
  }

  // 2. Check/Register In-Flight Request
  if (inFlightRequests.has(url)) {
    return inFlightRequests.get(url) as Promise<T>;
  }

  const fetchPromise = (async () => {
    let retries = 0;
    const maxRetries = 2;
    
    while (retries <= maxRetries) {
      try {
        const response = await fetch(url);
        
        if (response.status === 429) {
          // Exponential backoff if we hit rate limits
          const delay = Math.pow(2, retries) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          retries++;
          continue;
        }

        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        
        const data = await response.json();
        cache.set(url, { data, timestamp: Date.now() });
        return data as T;
      } catch (err) {
        if (retries === maxRetries) throw err;
        retries++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    throw new Error("Max retries exceeded");
  })();

  inFlightRequests.set(url, fetchPromise);
  
  try {
    return await fetchPromise;
  } finally {
    inFlightRequests.delete(url);
  }
};

export const OpenF1 = {
  getSessions: async (year: number): Promise<Session[]> => {
    return fetchWithCache<Session[]>(`${API_BASE}/sessions?year=${year}`);
  },

  getDrivers: async (sessionKey: number): Promise<Driver[]> => {
    return fetchWithCache<Driver[]>(`${API_BASE}/drivers?session_key=${sessionKey}`);
  },

  getPositions: async (sessionKey: number, start?: string, end?: string): Promise<Position[]> => {
    let url = `${API_BASE}/location?session_key=${sessionKey}`;
    if (start) url += `&date>=${start}`;
    if (end) url += `&date<=${end}`;
    return fetchWithCache<Position[]>(url, 2000); // 2s cache for positions
  },

  getCarData: async (sessionKey: number, driverNumber: number, start?: string, end?: string): Promise<CarData[]> => {
     let url = `${API_BASE}/car_data?session_key=${sessionKey}&driver_number=${driverNumber}`;
     if (start) url += `&date>=${start}`;
     if (end) url += `&date<=${end}`;
     return fetchWithCache<CarData[]>(url, 2000);
  },

  getWeather: async (sessionKey: number, start?: string): Promise<Weather[]> => {
     let url = `${API_BASE}/weather?session_key=${sessionKey}`;
     if (start) url += `&date>=${start}`;
     return fetchWithCache<Weather[]>(url, 30000); // 30s cache for weather
  },

  getIntervals: async (sessionKey: number, start?: string): Promise<Interval[]> => {
     let url = `${API_BASE}/intervals?session_key=${sessionKey}`;
     if (start) url += `&date>=${start}`;
     return fetchWithCache<Interval[]>(url, 5000); // 5s cache for intervals
  },

  // Simulated overtakes for demonstration as OpenF1 doesn't have a direct "overtake" endpoint
  // Real implementation would derive this from intervals/rankings
  getOvertakes: async (sessionKey: number, dateStart: string): Promise<Overtake[]> => {
    // Return a few simulated events based on the date to populate the feed
    return [
      {
        id: `ov-${sessionKey}-1`,
        driver_number: 1,
        overtaken_driver_number: 44,
        lap: 12,
        date: dateStart
      },
      {
        id: `ov-${sessionKey}-2`,
        driver_number: 16,
        overtaken_driver_number: 11,
        lap: 15,
        date: dateStart
      }
    ];
  }
};