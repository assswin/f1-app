import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { Search, X, Flag, MapPin, Trophy, Medal, Award } from 'lucide-react';
import { drivers } from '../data/f1Data';
import './Drivers.css';

/* ── animation variants ── */
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const titleVariants = {
  initial: { opacity: 0, x: -60, rotateY: 15 },
  animate: { opacity: 1, x: 0, rotateY: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const searchVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, delay: 0.15 } },
};

const gridContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.85 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  hover: { y: -12, boxShadow: '0 20px 40px rgba(225,6,0,0.3)', transition: { type: 'spring', stiffness: 400 } },
};

const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalContentVariants = {
  hidden: { y: 120, opacity: 0, scale: 0.9 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { y: 80, opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const Drivers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* parallax background text */
  const pageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end start'] });
  const bgTextY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <motion.div className="page-wrapper container drivers-page" ref={pageRef}
      variants={pageVariants} initial="initial" animate="animate"
    >
      {/* Large parallax background text */}
      <motion.div className="drivers-bg-text" style={{ y: bgTextY }}>DRIVERS</motion.div>

      <motion.h1 className="section-title" variants={titleVariants}>
        The Grid
      </motion.h1>

      <motion.div className="search-bar glass-panel" variants={searchVariants}>
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search by driver name or team..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <motion.button className="clear-search" onClick={() => setSearchTerm('')}
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
          >
            <X size={16} />
          </motion.button>
        )}
      </motion.div>

      <motion.p className="results-count"
        key={filteredDrivers.length}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        Showing {filteredDrivers.length} of {drivers.length} drivers
      </motion.p>

      <motion.div className="drivers-grid"
        variants={gridContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredDrivers.map((driver) => (
            <motion.div
              key={driver.id}
              className="driver-card glass-panel"
              variants={cardVariants}
              layout
              exit="exit"
              whileHover="hover"
              onClick={() => setSelectedDriver(driver)}
            >
              <div className="driver-number">{driver.number}</div>
              <div className="driver-image-container">
                <motion.img
                  src={driver.image} alt={driver.name} className="driver-image"
                  layoutId={`driver-img-${driver.id}`}
                />
              </div>
              <div className="driver-info">
                <h3>{driver.name}</h3>
                <p className="team">{driver.team}</p>
              </div>
              {/* Bottom glow bar per team */}
              <div className="card-glow-bar" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {selectedDriver && (
          <motion.div className="modal-backdrop"
            variants={modalOverlayVariants} initial="hidden" animate="visible" exit="exit"
            onClick={() => setSelectedDriver(null)}
          >
            <motion.div className="modal-content glass-panel"
              variants={modalContentVariants} initial="hidden" animate="visible" exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setSelectedDriver(null)}>
                <X size={24} />
              </button>

              <div className="modal-header">
                <motion.img
                  src={selectedDriver.image} alt={selectedDriver.name}
                  layoutId={`driver-img-${selectedDriver.id}`}
                />
                <div>
                  <motion.h2
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    {selectedDriver.name} <span>#{selectedDriver.number}</span>
                  </motion.h2>
                  <motion.h4
                    style={{ color: 'var(--accent-red)' }}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    {selectedDriver.team}
                  </motion.h4>
                </div>
              </div>

              <motion.div className="modal-body"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="modal-stats-row">
                  <div className="modal-stat">
                    <MapPin size={16} />
                    <span>{selectedDriver.country}</span>
                  </div>
                  <div className="modal-stat">
                    <Trophy size={16} color="var(--accent-red)" />
                    <span>P{selectedDriver.position} (2026)</span>
                  </div>
                  <div className="modal-stat">
                    <Flag size={16} />
                    <span>{selectedDriver.points} Pts</span>
                  </div>
                </div>
                
                {selectedDriver.stats && (
                  <motion.div 
                    className="modal-advanced-stats"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="stat-box">
                      <Trophy size={20} color="#e6b800" />
                      <h4>{selectedDriver.stats.wins}</h4>
                      <span>Wins</span>
                    </div>
                    <div className="stat-box">
                      <Medal size={20} color="#c0c0c0" />
                      <h4>{selectedDriver.stats.podiums}</h4>
                      <span>Podiums</span>
                    </div>
                    <div className="stat-box">
                      <Award size={20} color="#ff3366" />
                      <h4>{selectedDriver.stats.championships}</h4>
                      <span>WDC</span>
                    </div>
                    <div className="stat-box">
                      <Flag size={20} color="#ffaa00" />
                      <h4>{selectedDriver.stats.poles || 0}</h4>
                      <span>Poles</span>
                    </div>
                  </motion.div>
                )}
                <div className="bio">
                  <strong>Biography:</strong>
                  <p>{selectedDriver.bio}</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Drivers;
