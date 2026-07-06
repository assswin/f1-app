import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Calendar, CheckCircle, Award, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { getSchedule, getRaceResults } from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import './Schedule.css';

const titleVariants = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const listStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const listItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRaceId, setExpandedRaceId] = useState(null);

  const pageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end start'] });
  const bgTextY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  useEffect(() => {
    const fetchAPI = async () => {
      setLoading(true);
      
      const [apiData, resultsData] = await Promise.all([
        getSchedule(2026),
        getRaceResults(2026)
      ]);
      
      const mappedSchedule = apiData.map((race) => {
        const raceDateStr = race.time ? `${race.date}T${race.time}` : `${race.date}T00:00:00Z`;
        const raceDateObj = new Date(raceDateStr);
        const isPast = raceDateObj < new Date();
        
        let winner = null;
        if (isPast) {
          const raceResult = resultsData.find(r => r.round === race.round);
          if (raceResult && raceResult.Results && raceResult.Results.length > 0) {
            const firstPlace = raceResult.Results[0].Driver;
            winner = `${firstPlace.givenName} ${firstPlace.familyName}`;
          }
        }
        
        return {
          id: race.round,
          round: race.round,
          grandPrix: race.raceName,
          circuit: race.Circuit.circuitName,
          date: race.date,
          dateObj: raceDateObj,
          status: isPast ? 'finished' : 'upcoming',
          winner: winner,
          image: `https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/${race.Circuit.Location.country.replace(' ', '%20')}.png`,
          sessions: {
            p1: race.FirstPractice ? new Date(race.FirstPractice.time ? `${race.FirstPractice.date}T${race.FirstPractice.time}` : `${race.FirstPractice.date}T00:00:00Z`) : null,
            p2: race.SecondPractice ? new Date(race.SecondPractice.time ? `${race.SecondPractice.date}T${race.SecondPractice.time}` : `${race.SecondPractice.date}T00:00:00Z`) : null,
            p3: race.ThirdPractice ? new Date(race.ThirdPractice.time ? `${race.ThirdPractice.date}T${race.ThirdPractice.time}` : `${race.ThirdPractice.date}T00:00:00Z`) : null,
            qualifying: race.Qualifying ? new Date(race.Qualifying.time ? `${race.Qualifying.date}T${race.Qualifying.time}` : `${race.Qualifying.date}T00:00:00Z`) : null,
            race: raceDateObj
          }
        };
      });

      setSchedule(mappedSchedule);
      setLoading(false);
    };
    fetchAPI();
  }, []);

  const toggleSessions = (id) => {
    if (expandedRaceId === id) setExpandedRaceId(null);
    else setExpandedRaceId(id);
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return 'TBA';
    return dateObj.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="schedule-page" style={{display: 'flex', justifyContent: 'center', paddingTop: '20vh'}}><div className="spinner"></div></div>;
  }

  const nextRace = schedule.find(race => race.dateObj > new Date()) || schedule[schedule.length - 1];

  return (
    <div className="page-wrapper container schedule-page" ref={pageRef}>
      <motion.div className="schedule-bg-text" style={{ y: bgTextY }}>
        CALENDAR
      </motion.div>

      <motion.h1 
        className="section-title"
        variants={titleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        LIVE API RACE CALENDAR
      </motion.h1>

      {nextRace && (
        <div className="schedule-next-race-wrapper">
          <CountdownTimer targetDate={nextRace.dateObj.toISOString()} eventName={nextRace.grandPrix} />
        </div>
      )}

      <motion.div 
        className="schedule-list"
        variants={listStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {schedule.map((race) => (
          <motion.div key={race.id} className="race-card glass-panel" variants={listItem} whileHover={{ scale: 1.02, x: 10 }}>
            <div className="race-round">RND<br/><span>{race.round}</span></div>
            
            <div className="race-image">
              <img src={race.image} alt={race.grandPrix} onError={(e) => { e.target.onerror = null; e.target.src = '/assets/placeholder-track.png' }} />
            </div>

            <div className="race-details">
              <h2>{race.grandPrix}</h2>
              <div className="race-location">
                <MapPin size={16} /> {race.circuit}
              </div>

              {race.winner && (
                <div className="race-winner" style={{ marginTop: '10px', color: 'var(--accent-red)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={18} /> Winner: {race.winner}
                </div>
              )}

              {race.sessions && (
                <div className="race-sessions-wrapper" style={{ marginTop: '15px' }}>
                  <button 
                    onClick={() => toggleSessions(race.id)}
                    style={{ background: 'transparent', border: '1px solid #333', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', textTransform: 'uppercase', fontFamily: "'Titillium Web', sans-serif" }}
                  >
                    <Clock size={14} /> Full Weekend Schedule
                    {expandedRaceId === race.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  
                  {expandedRaceId === race.id && (
                    <div style={{ marginTop: '10px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {race.sessions.p1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}>
                          <span>Practice 1</span> <span>{formatDate(race.sessions.p1)}</span>
                        </div>
                      )}
                      {race.sessions.p2 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}>
                          <span>Practice 2 / Sprint Quali</span> <span>{formatDate(race.sessions.p2)}</span>
                        </div>
                      )}
                      {race.sessions.p3 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}>
                          <span>Practice 3 / Sprint</span> <span>{formatDate(race.sessions.p3)}</span>
                        </div>
                      )}
                      {race.sessions.qualifying && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 600 }}>
                          <span>Qualifying</span> <span>{formatDate(race.sessions.qualifying)}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-red)', fontWeight: 700 }}>
                        <span>Grand Prix</span> <span>{formatDate(race.sessions.race)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="race-date">
              <Calendar size={18} />
              <span>{new Date(race.date).toLocaleDateString()}</span>
            </div>
            <div className="race-status">
              {race.status === 'upcoming' ? (
                <div className="status-badge upcoming">Upcoming</div>
              ) : (
                <div className="status-badge finished"><CheckCircle size={16} /> Finished</div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Schedule;
