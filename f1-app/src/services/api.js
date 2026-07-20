import historicalStandings from '../data/historicalStandings.json';
import allDriverStandings from '../data/allDriverStandings.json';
import { drivers, constructors } from '../data/f1Data';

/**
 * Fetches the historical Champions vs Rivals data (1950 - 2024)
 */
export const getHistoricalChampions = () => {
  return historicalStandings;
};

/**
 * Fetches the FULL Schedule for a specific year from OpenF1 API
 */
export const getF1Calendar = async (year) => {
  try {
    const [meetingsRes, sessionsRes] = await Promise.all([
      fetch(`https://api.openf1.org/v1/meetings?year=${year}`),
      fetch(`https://api.openf1.org/v1/sessions?year=${year}`)
    ]);
    const meetings = await meetingsRes.json();
    const sessions = await sessionsRes.json();

    const championshipMeetings = meetings.filter(m => m.meeting_name !== 'Pre-Season Testing');

    return championshipMeetings.map((meeting, index) => {
      const meetingSessions = sessions.filter(s => s.meeting_key === meeting.meeting_key);
      const fp1 = meetingSessions.find(s => s.session_name === 'Practice 1');
      const fp2 = meetingSessions.find(s => s.session_name === 'Practice 2');
      const fp3 = meetingSessions.find(s => s.session_name === 'Practice 3');
      const qualifying = meetingSessions.find(s => s.session_name === 'Qualifying');
      const sprintQualifying = meetingSessions.find(s => s.session_name === 'Sprint Qualifying');
      const sprint = meetingSessions.find(s => s.session_name === 'Sprint');
      const gp = meetingSessions.find(s => s.session_name === 'Race');

      return {
        slug: meeting.meeting_name.toLowerCase().replace(/\s+/g, '-'),
        round: index + 1,
        name: meeting.meeting_name,
        location: meeting.location,
        sessions: {
          fp1: fp1 ? fp1.date_start : null,
          fp2: fp2 ? fp2.date_start : null,
          fp3: fp3 ? fp3.date_start : null,
          qualifying: qualifying ? qualifying.date_start : null,
          sprintQualifying: sprintQualifying ? sprintQualifying.date_start : null,
          sprint: sprint ? sprint.date_start : null,
          gp: gp ? gp.date_start : null
        }
      };
    });
  } catch (error) {
    console.error(`Error fetching F1 Calendar for ${year}:`, error);
    return [];
  }
};

/**
 * Fetches the FULL Driver Standings for a specific year from live API
 */
export const getDriverStandings = async (year) => {
  try {
    const endpoint = (year === 2026 || year === 'current') ? 'current' : year;
    const res = await fetch(`https://api.jolpi.ca/ergast/f1/${endpoint}/driverStandings.json`);
    const data = await res.json();
    const list = data.MRData.StandingsTable.StandingsLists[0];
    return list ? list.DriverStandings : [];
  } catch (error) {
    console.error(`Error fetching driver standings for ${year}:`, error);
    // Fallback to local historical data for past years if API fails
    if (year !== 2026 && year !== 'current' && allDriverStandings[year]) {
      return allDriverStandings[year];
    }
    return [];
  }
};

/**
 * Fetches the FULL Constructor Standings for a specific year from live API
 */
export const getConstructorStandings = async (year) => {
  try {
    const endpoint = (year === 2026 || year === 'current') ? 'current' : year;
    const res = await fetch(`https://api.jolpi.ca/ergast/f1/${endpoint}/constructorStandings.json`);
    const data = await res.json();
    const list = data.MRData.StandingsTable.StandingsLists[0];
    return list ? list.ConstructorStandings : [];
  } catch (error) {
    console.error(`Error fetching constructor standings for ${year}:`, error);
    return [];
  }
};

/**
 * Fetches the FULL Schedule for a specific year from live API
 */
export const getSchedule = async (year) => {
  try {
    const endpoint = (year === 2026 || year === 'current') ? 'current' : year;
    const res = await fetch(`https://api.jolpi.ca/ergast/f1/${endpoint}.json`);
    const data = await res.json();
    return data.MRData.RaceTable.Races || [];
  } catch (error) {
    console.error(`Error fetching schedule for ${year}:`, error);
    return [];
  }
};

/**
 * Fetches the race results (winners) for a specific year from live API
 */
export const getRaceResults = async (year) => {
  try {
    const endpoint = (year === 2026 || year === 'current') ? 'current' : year;
    const res = await fetch(`https://api.jolpi.ca/ergast/f1/${endpoint}/results.json?limit=1000`);
    const data = await res.json();
    return data.MRData.RaceTable.Races || [];
  } catch (error) {
    console.error(`Error fetching race results for ${year}:`, error);
    return [];
  }
};

/**
 * Fetches the race results for the most recently completed race
 */
export const getLatestRaceResult = async () => {
  try {
    const res = await fetch(`https://api.jolpi.ca/ergast/f1/current/last/results.json?limit=100`);
    const data = await res.json();
    return data.MRData.RaceTable.Races[0] || null;
  } catch (error) {
    console.error(`Error fetching latest race result:`, error);
    return null;
  }
};

/**
 * Fetches the race results for a specific race
 */
export const getRaceResult = async (season, round) => {
  try {
    const res = await fetch(`https://api.jolpi.ca/ergast/f1/${season}/${round}/results.json?limit=100`);
    const data = await res.json();
    return data.MRData.RaceTable.Races[0] || null;
  } catch (error) {
    console.error(`Error fetching race result for ${season} round ${round}:`, error);
    return null;
  }
};

/**
 * Fetches lap times for a specific race
 */
export const getLapData = async (season, round) => {
  try {
    const res = await fetch(`https://api.jolpi.ca/ergast/f1/${season}/${round}/laps.json?limit=2000`);
    const data = await res.json();
    return data.MRData.RaceTable.Races[0]?.Laps || [];
  } catch (error) {
    console.error(`Error fetching lap data for ${season} round ${round}:`, error);
    return [];
  }
};

/**
 * Fetches pit stops for a specific race
 */
export const getPitStops = async (season, round) => {
  try {
    const res = await fetch(`https://api.jolpi.ca/ergast/f1/${season}/${round}/pitstops.json?limit=100`);
    const data = await res.json();
    return data.MRData.RaceTable.Races[0]?.PitStops || [];
  } catch (error) {
    console.error(`Error fetching pit stops for ${season} round ${round}:`, error);
    return [];
  }
};
