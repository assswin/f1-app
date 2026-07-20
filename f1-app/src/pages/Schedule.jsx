import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { MapPin, Calendar, CheckCircle } from 'lucide-react';
import { schedule } from '../data/f1Data';
import CountdownTimer from '../components/CountdownTimer';
import './Schedule.css';

/* ── animation variants ── */
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
  const pageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end start'] });
  const bgTextY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div className="page-wrapper container schedule-page" ref={pageRef}>
      {/* Background text */}
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
        2026 Race Calendar
      </motion.h1>

      <div className="schedule-next-race-wrapper">
        <CountdownTimer targetDate={schedule[0].dateObj} eventName={schedule[0].grandPrix} />
      </div>

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
              <img src={race.image} alt={race.grandPrix} />
            </div>

            <div className="race-details">
              <h2>{race.grandPrix}</h2>
              <div className="race-location">
                <MapPin size={16} /> {race.circuit}
              </div>
            </div>
            
            <div className="race-date">
              <Calendar size={18} />
              <span>{race.date}</span>
            </div>
            <div className="race-status">
              {race.status === 'upcoming' ? (
                <div className="status-badge upcoming">Upcoming</div>
              ) : (
                <div className="status-badge finished" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span><CheckCircle size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Finished</span>
                  {race.winner && <span style={{ fontSize: '0.85em', fontWeight: 'bold' }}>{race.winner}</span>}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Schedule;
