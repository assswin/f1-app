import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { constructors } from '../data/f1Data';
import './Cars.css';

/* ── animation variants ── */
const titleVariants = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardLeftVariants = {
  hidden: { opacity: 0, x: -120, rotateY: 8 },
  visible: { opacity: 1, x: 0, rotateY: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const cardRightVariants = {
  hidden: { opacity: 0, x: 120, rotateY: -8 },
  visible: { opacity: 1, x: 0, rotateY: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 20 } },
};

const detailsStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const detailItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Cars = () => {
  const pageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end start'] });
  const bgTextY = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <div className="page-wrapper container cars-page" ref={pageRef}>
      {/* Parallax bg text */}
      <motion.div className="cars-bg-text" style={{ y: bgTextY }}>TEAMS</motion.div>

      <motion.h1
        className="section-title"
        variants={titleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        Constructors
      </motion.h1>

      <div className="cars-container">
        {constructors.map((team, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={team.id}
              className={`car-card glass-panel ${isEven ? '' : 'reversed'}`}
              variants={isEven ? cardLeftVariants : cardRightVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              whileHover="hover"
            >
              <motion.div className="car-image-wrapper" variants={imageVariants} initial="rest" whileHover="hover">
                <img src={team.carImage} alt={`${team.name} Car`} />
                <div className="image-overlay" />
                <div className="team-color-bar" style={{ backgroundColor: team.color }} />
                <div className="team-color-glow" style={{ background: team.color, boxShadow: `0 0 40px ${team.color}` }} />
              </motion.div>

              <motion.div className="car-details" variants={detailsStagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.div className="team-badge" variants={detailItem} style={{ borderColor: team.color, color: team.color }}>
                  <div className="team-color-circle" style={{ background: team.color }} />
                  {team.id.toUpperCase().replace('-', ' ')}
                </motion.div>
                <motion.h2 variants={detailItem}>{team.name}</motion.h2>
                <motion.div className="car-specs" variants={detailItem}>
                  <span><strong>Origin:</strong> {team.origin}</span>
                  <span><strong>Engine:</strong> {team.engine}</span>
                </motion.div>
                <motion.div className="telemetry" variants={detailItem}>
                  <div className="tele-row">
                    <label>Top Speed <span>{team.specs?.topSpeed}</span></label>
                    <div className="tele-bar"><motion.div className="tele-fill" style={{ backgroundColor: team.color }} initial={{ width: 0 }} whileInView={{ width: `${team.specs?.topSpeed || 0}%` }} transition={{ duration: 1, delay: 0.2 }} viewport={{ once: true }} /></div>
                  </div>
                  <div className="tele-row">
                    <label>Acceleration <span>{team.specs?.acceleration}</span></label>
                    <div className="tele-bar"><motion.div className="tele-fill" style={{ backgroundColor: team.color }} initial={{ width: 0 }} whileInView={{ width: `${team.specs?.acceleration || 0}%` }} transition={{ duration: 1, delay: 0.3 }} viewport={{ once: true }} /></div>
                  </div>
                  <div className="tele-row">
                    <label>Downforce <span>{team.specs?.downforce}</span></label>
                    <div className="tele-bar"><motion.div className="tele-fill" style={{ backgroundColor: team.color }} initial={{ width: 0 }} whileInView={{ width: `${team.specs?.downforce || 0}%` }} transition={{ duration: 1, delay: 0.4 }} viewport={{ once: true }} /></div>
                  </div>
                  <div className="tele-row">
                    <label>Reliability <span>{team.specs?.reliability}</span></label>
                    <div className="tele-bar"><motion.div className="tele-fill" style={{ backgroundColor: team.color }} initial={{ width: 0 }} whileInView={{ width: `${team.specs?.reliability || 0}%` }} transition={{ duration: 1, delay: 0.5 }} viewport={{ once: true }} /></div>
                  </div>
                </motion.div>
                <motion.p variants={detailItem}>{team.description}</motion.p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Cars;
