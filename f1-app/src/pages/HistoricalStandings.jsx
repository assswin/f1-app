import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { getHistoricalChampions, getDriverStandings } from '../services/api';
import './HistoricalStandings.css';
import { drivers as localDrivers } from '../data/f1Data';

const getNatCode = (nat) => {
  const codes = {
    'British': 'GBR', 'Dutch': 'NED', 'Monegasque': 'MON', 'Spanish': 'ESP',
    'French': 'FRA', 'Australian': 'AUS', 'Italian': 'ITA', 'German': 'GER',
    'Mexican': 'MEX', 'Finnish': 'FIN', 'Canadian': 'CAN', 'Thai': 'THA',
    'Japanese': 'JPN', 'Chinese': 'CHN', 'American': 'USA', 'Brazilian': 'BRA',
    'Argentine': 'ARG', 'New Zealander': 'NZL'
  };
  return codes[nat] || (nat ? nat.slice(0, 3).toUpperCase() : '');
};

const HistoricalStandings = () => {
  const [history, setHistory] = useState([]);
  const [expandedYear, setExpandedYear] = useState(null);
  const [yearData, setYearData] = useState({});
  const [loadingYear, setLoadingYear] = useState(null);

  useEffect(() => {
    setHistory(getHistoricalChampions());
  }, []);

  const toggleYear = async (year) => {
    if (expandedYear === year) {
      setExpandedYear(null);
      return;
    }

    setExpandedYear(year);

    if (!yearData[year]) {
      setLoadingYear(year);
      const standings = await getDriverStandings(year);
      setYearData(prev => ({ ...prev, [year]: standings }));
      setLoadingYear(null);
    }
  };

  return (
    <div className="historical-page page-container fade-in">
      <div className="container">
        <div className="historical-header">
          <h1>HALL OF FAME</h1>
          <p>F1 World Champions & Rivals (1950 - Present)</p>
        </div>

        <div className="history-list">
          {history.map((season) => (
            <div key={season.year} className="history-card glass-panel">
              <div 
                className="history-card-header" 
                onClick={() => toggleYear(season.year)}
              >
                <div className="history-year">{season.year}</div>
                
                <div className="history-battle">
                  <div className="champion">
                    <Trophy size={16} color="var(--accent-red)" />
                    <strong>{season.champion}</strong>
                    <span className="team-badge">{season.championTeam}</span>
                  </div>
                  <div className="vs">VS</div>
                  <div className="rival">
                    <span>{season.rival}</span>
                    <span className="team-badge">{season.rivalTeam}</span>
                  </div>
                </div>

                <div className="history-toggle">
                  {expandedYear === season.year ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>

              {expandedYear === season.year && (
                <div className="history-details fade-in">
                  {loadingYear === season.year ? (
                    <div className="history-loading"><div className="spinner"></div></div>
                  ) : (
                    <div className="standings-table-container" style={{borderRadius: 0, border: 'none'}}>
                      <table className="standings-table">
                        <thead>
                          <tr>
                            <th>POS.</th>
                            <th>DRIVER</th>
                            <th>NATIONALITY</th>
                            <th>TEAM</th>
                            <th style={{textAlign: 'right'}}>PTS.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {yearData[season.year]?.map(d => {
                            const fullName = `${d.Driver.givenName} ${d.Driver.familyName}`;
                            const localDriver = localDrivers.find(ld => ld.name === fullName);
                            const driverImg = localDriver?.image || 'https://media.formula1.com/image/upload/f_auto,c_fill,q_auto,w_100/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png'; // fallback
                            const teamName = d.Constructors[0]?.name || '';

                            return (
                              <tr key={d.Driver.driverId}>
                                <td className="pos-col">{d.position}</td>
                                <td className="driver-name-col">
                                  <img src={driverImg} alt={fullName} className="driver-icon" />
                                  <span className="given-name">{d.Driver.givenName}</span>
                                  <strong className="family-name">{d.Driver.familyName}</strong>
                                </td>
                                <td>{getNatCode(d.Driver.nationality)}</td>
                                <td>
                                  <div className="team-col">
                                    {teamName}
                                  </div>
                                </td>
                                <td className="pts-col">{d.points}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoricalStandings;
