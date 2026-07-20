import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Calendar, CheckCircle, Award, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { getF1Calendar, getRaceResults } from '../services/api';
import { schedule as localSchedule } from '../data/f1Data';
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

  const currentYear = 2026;

  useEffect(() => {
    let isMounted = true;
    let intervalId;

    const fetchAPI = async (isInitial = false) => {
      if (isInitial) setLoading(true);

      try {
        const [calendarData, resultsData] = await Promise.all([
          getF1Calendar(currentYear),
          getRaceResults(currentYear)
        ]);

        const mappedSchedule = calendarData.map((race) => {
          const roundStr = race.round.toString();
          const localRace = localSchedule.find(lr => lr.round === race.round);
          // Find if there are results for this round
          const raceResult = resultsData.find(r => r.round === roundStr);
          
          const raceDateStr = race.sessions && race.sessions.gp ? race.sessions.gp : null;
          const raceDateObj = raceDateStr ? new Date(raceDateStr) : new Date();
          const isPast = raceDateObj < new Date();

          let winner = null;
          let podium = [];
          let status = isPast ? 'finished' : 'upcoming';

          if (raceResult && raceResult.Results && raceResult.Results.length > 0) {
            winner = `${raceResult.Results[0].Driver.givenName} ${raceResult.Results[0].Driver.familyName}`;
            podium = raceResult.Results.slice(0, 3).map(r => ({
              pos: r.position,
              name: `${r.Driver.givenName} ${r.Driver.familyName}`,
              team: r.Constructor.name
            }));
          } else if (isPast && localRace && localRace.podium) {
            winner = localRace.podium[0];
            podium = localRace.podium.map((name, i) => ({
              pos: (i + 1).toString(),
              name: name,
              team: 'Processing API Results...'
            }));
          }

          return {
            id: race.slug,
            round: race.round,
            grandPrix: localRace ? localRace.grandPrix : race.name,
            circuit: localRace ? localRace.circuit : race.location,
            date: raceDateStr,
            dateObj: raceDateObj,
            status: status,
            winner: winner,
            podium: podium,
            image: localRace && localRace.image ? localRace.image : `/assets/tracks/${race.slug}.png`,
            sessions: race.sessions ? {
              p1: race.sessions.fp1 ? new Date(race.sessions.fp1) : null,
              p2: race.sessions.fp2 ? new Date(race.sessions.fp2) : null,
              p3: race.sessions.fp3 ? new Date(race.sessions.fp3) : null,
              qualifying: race.sessions.qualifying ? new Date(race.sessions.qualifying) : null,
              sprintQualifying: race.sessions.sprintQualifying ? new Date(race.sessions.sprintQualifying) : null,
              sprint: race.sessions.sprint ? new Date(race.sessions.sprint) : null,
              race: raceDateObj
            } : null
          };
        });

        if (isMounted) setSchedule(mappedSchedule);
      } catch (error) {
        console.error("Failed to fetch schedule updates:", error);
      } finally {
        if (isMounted && isInitial) setLoading(false);
      }
    };

    fetchAPI(true);
    intervalId = setInterval(() => fetchAPI(false), 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
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
    return <div className="schedule-page" style={{ display: 'flex', justifyContent: 'center', paddingTop: '20vh' }}><div className="spinner"></div></div>;
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
        LIVE API RACE CALENDAR ({currentYear})
      </motion.h1>

      {nextRace && nextRace.status === 'upcoming' && (
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
            <div className="race-round">RND<br /><span>{race.round}</span></div>

            <div className="race-image">
              <img src={race.image} alt={race.grandPrix} onError={(e) => { e.target.onerror = null; e.target.src = '/assets/placeholder-track.png' }} />
            </div>

            <div className="race-details">
              <h2>{race.grandPrix}</h2>
              <div className="race-location">
                <MapPin size={16} /> {race.circuit}
              </div>

              {race.status === 'finished' && race.podium && race.podium.length > 0 && (
                <div className="race-podium" style={{ marginTop: '15px', background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-red)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>
                    <Award size={18} color="var(--accent-red)" /> Podium Results
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {race.podium.map(p => (
                      <div key={p.pos} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ 
                            display: 'inline-block', width: '22px', height: '22px', textAlign: 'center', lineHeight: '22px', borderRadius: '50%', fontSize: '0.8rem', fontWeight: 'bold',
                            backgroundColor: p.pos === '1' ? '#FFD700' : p.pos === '2' ? '#C0C0C0' : '#CD7F32',
                            color: '#000'
                          }}>{p.pos}</span>
                          <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{p.name}</span>
                        </div>
                        <span style={{ color: '#aaa', fontSize: '0.8rem', textTransform: 'uppercase' }}>{p.team}</span>
                      </div>
                    ))}
                  </div>
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
                      {race.sessions.sprintQualifying ? (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}>
                            <span>Sprint Qualifying</span> <span>{formatDate(race.sessions.sprintQualifying)}</span>
                          </div>
                          {race.sessions.sprint && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}>
                              <span>Sprint</span> <span>{formatDate(race.sessions.sprint)}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {race.sessions.p2 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}>
                              <span>Practice 2</span> <span>{formatDate(race.sessions.p2)}</span>
                            </div>
                          )}
                          {race.sessions.p3 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}>
                              <span>Practice 3</span> <span>{formatDate(race.sessions.p3)}</span>
                            </div>
                          )}
                        </>
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
              <span>{race.dateObj ? race.dateObj.toLocaleDateString() : 'TBA'}</span>
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

