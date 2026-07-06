import { useState, useEffect } from 'react';
import { getDriverStandings, getConstructorStandings } from '../services/api';
import { drivers as localDrivers, constructors as localConstructors } from '../data/f1Data';
import './Standings.css';

// Helper to convert nationalities to 3-letter codes like F1 does
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

const Standings = () => {
  const [activeTab, setActiveTab] = useState('drivers');
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentYear = 2026;

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      const driversData = await getDriverStandings(currentYear);
      const constructorsData = await getConstructorStandings(currentYear);
      setDriverStandings(driversData);
      setConstructorStandings(constructorsData);
      setLoading(false);
    };
    fetchStandings();
  }, []);

  if (loading) {
    return <div className="standings-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="standings-page page-container fade-in">
      <div className="container">
        <div className="standings-header">
          <h1>{currentYear} DRIVERS' STANDINGS</h1>
          
          <div className="standings-tabs">
            <button 
              className={activeTab === 'drivers' ? 'active' : ''} 
              onClick={() => setActiveTab('drivers')}
            >
              Drivers
            </button>
            <button 
              className={activeTab === 'constructors' ? 'active' : ''} 
              onClick={() => setActiveTab('constructors')}
            >
              Teams
            </button>
          </div>
        </div>

        <div className="standings-table-container">
          {activeTab === 'drivers' ? (
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
                {driverStandings.map(d => {
                  const teamName = d.Constructors[0]?.name || '';

                  return (
                    <tr key={d.Driver.driverId}>
                      <td className="pos-col">{d.position}</td>
                      <td className="driver-name-col">
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
          ) : (
            <table className="standings-table">
              <thead>
                <tr>
                  <th>POS.</th>
                  <th>TEAM</th>
                  <th>NATIONALITY</th>
                  <th style={{textAlign: 'right'}}>PTS.</th>
                </tr>
              </thead>
              <tbody>
                {constructorStandings.map(c => (
                  <tr key={c.Constructor.constructorId}>
                    <td className="pos-col">{c.position}</td>
                    <td>
                      <strong style={{textTransform: 'uppercase'}}>{c.Constructor.name}</strong>
                    </td>
                    <td>{getNatCode(c.Constructor.nationality)}</td>
                    <td className="pts-col">{c.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Standings;
