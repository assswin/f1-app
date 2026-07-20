import { useState } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { drivers, constructors } from '../data/f1Data';
import './Compare.css';

const Compare = () => {
  const [compareType, setCompareType] = useState('drivers'); // 'drivers' or 'teams'
  
  // Default selections
  const [driver1, setDriver1] = useState(drivers[0].id);
  const [driver2, setDriver2] = useState(drivers[2].id);
  const [team1, setTeam1] = useState(constructors[0].id);
  const [team2, setTeam2] = useState(constructors[1].id);

  const getDriverData = () => {
    const d1 = drivers.find(d => d.id === driver1);
    const d2 = drivers.find(d => d.id === driver2);
    
    // Normalize data for radar chart (0-100 scale ideally, but we'll scale based on max)
    const maxWins = Math.max(d1.stats.wins, d2.stats.wins, 10);
    const maxPodiums = Math.max(d1.stats.podiums, d2.stats.podiums, 20);
    const maxChamps = Math.max(d1.stats.championships, d2.stats.championships, 1);
    const maxPoints = Math.max(d1.points, d2.points, 100);

    return [
      {
        subject: 'Wins',
        [d1.name]: (d1.stats.wins / maxWins) * 100,
        [d2.name]: (d2.stats.wins / maxWins) * 100,
        fullMark: 100,
      },
      {
        subject: 'Podiums',
        [d1.name]: (d1.stats.podiums / maxPodiums) * 100,
        [d2.name]: (d2.stats.podiums / maxPodiums) * 100,
        fullMark: 100,
      },
      {
        subject: 'Championships',
        [d1.name]: (d1.stats.championships / maxChamps) * 100,
        [d2.name]: (d2.stats.championships / maxChamps) * 100,
        fullMark: 100,
      },
      {
        subject: 'Points (2026)',
        [d1.name]: (d1.points / maxPoints) * 100,
        [d2.name]: (d2.points / maxPoints) * 100,
        fullMark: 100,
      },
    ];
  };

  const getTeamData = () => {
    const t1 = constructors.find(t => t.id === team1);
    const t2 = constructors.find(t => t.id === team2);
    
    return [
      { subject: 'Top Speed', [t1.name]: t1.specs.topSpeed, [t2.name]: t2.specs.topSpeed, fullMark: 100 },
      { subject: 'Downforce', [t1.name]: t1.specs.downforce, [t2.name]: t2.specs.downforce, fullMark: 100 },
      { subject: 'Reliability', [t1.name]: t1.specs.reliability, [t2.name]: t2.specs.reliability, fullMark: 100 },
      { subject: 'Acceleration', [t1.name]: t1.specs.acceleration, [t2.name]: t2.specs.acceleration, fullMark: 100 },
    ];
  };

  const currentD1 = drivers.find(d => d.id === driver1);
  const currentD2 = drivers.find(d => d.id === driver2);
  const currentT1 = constructors.find(t => t.id === team1);
  const currentT2 = constructors.find(t => t.id === team2);

  return (
    <div className="compare-container container page-wrapper">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="compare-header"
      >
        <h1 className="section-title">Telemetry Analysis</h1>
        <div className="toggle-group">
          <button 
            className={`toggle-btn ${compareType === 'drivers' ? 'active' : ''}`}
            onClick={() => setCompareType('drivers')}
          >
            Drivers
          </button>
          <button 
            className={`toggle-btn ${compareType === 'teams' ? 'active' : ''}`}
            onClick={() => setCompareType('teams')}
          >
            Teams
          </button>
        </div>
      </motion.div>

      <div className="compare-content">
        <div className="selection-panel glass-panel">
          <div className="selector-group">
            <h3>Entity 1</h3>
            <select 
              value={compareType === 'drivers' ? driver1 : team1}
              onChange={(e) => compareType === 'drivers' ? setDriver1(e.target.value) : setTeam1(e.target.value)}
            >
              {compareType === 'drivers' 
                ? drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)
                : constructors.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
              }
            </select>
            {compareType === 'drivers' ? (
              <div className="entity-preview">
                <img src={currentD1.image} alt={currentD1.name} />
                <h4>{currentD1.team}</h4>
              </div>
            ) : (
              <div className="entity-preview">
                <div className="team-color-bar" style={{ backgroundColor: currentT1.color }}></div>
                <img src={currentT1.carImage} alt={currentT1.name} className="team-car-img" />
              </div>
            )}
          </div>
          
          <div className="vs-badge">VS</div>
          
          <div className="selector-group">
            <h3>Entity 2</h3>
            <select 
              value={compareType === 'drivers' ? driver2 : team2}
              onChange={(e) => compareType === 'drivers' ? setDriver2(e.target.value) : setTeam2(e.target.value)}
            >
              {compareType === 'drivers' 
                ? drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)
                : constructors.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
              }
            </select>
            {compareType === 'drivers' ? (
              <div className="entity-preview">
                <img src={currentD2.image} alt={currentD2.name} />
                <h4>{currentD2.team}</h4>
              </div>
            ) : (
              <div className="entity-preview">
                 <div className="team-color-bar" style={{ backgroundColor: currentT2.color }}></div>
                 <img src={currentT2.carImage} alt={currentT2.name} className="team-car-img" />
              </div>
            )}
          </div>
        </div>

        <motion.div 
          className="chart-container glass-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={compareType === 'drivers' ? getDriverData() : getTeamData()}>
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#fff', fontSize: 14 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              
              <Radar 
                name={compareType === 'drivers' ? currentD1.name : currentT1.name} 
                dataKey={compareType === 'drivers' ? currentD1.name : currentT1.name} 
                stroke={compareType === 'teams' ? currentT1.color : "#E10600"} 
                fill={compareType === 'teams' ? currentT1.color : "#E10600"} 
                fillOpacity={0.5} 
              />
              <Radar 
                name={compareType === 'drivers' ? currentD2.name : currentT2.name} 
                dataKey={compareType === 'drivers' ? currentD2.name : currentT2.name} 
                stroke={compareType === 'teams' ? currentT2.color : "#00d2be"} 
                fill={compareType === 'teams' ? currentT2.color : "#00d2be"} 
                fillOpacity={0.5} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(5,5,5,0.9)', border: '1px solid #333', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Compare;
