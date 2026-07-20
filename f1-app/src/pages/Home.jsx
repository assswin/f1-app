import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Flag, Users, Award } from 'lucide-react';
import { constructors, drivers, schedule } from '../data/f1Data';
import CountdownTimer from '../components/CountdownTimer';
import './Home.css';

/* ── reusable scroll-reveal wrapper ── */
const ScrollReveal = ({ children, delay = 0, direction = 'up' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const dirs = {
    up:    { hidden: { y: 80, opacity: 0 },  visible: { y: 0, opacity: 1 } },
    down:  { hidden: { y: -80, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    left:  { hidden: { x: -80, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    right: { hidden: { x: 80, opacity: 0 },  visible: { x: 0, opacity: 1 } },
    scale: { hidden: { scale: 0.7, opacity: 0 }, visible: { scale: 1, opacity: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      variants={dirs[direction]}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
};

/* ── stagger container variants ── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const staggerItem = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ── floating particle component ── */
const FloatingParticle = ({ size, left, duration, delay: d }) => (
  <motion.div
    className="particle"
    style={{ width: size, height: size, left, top: '100%' }}
    animate={{ y: [0, -1200], opacity: [0, 1, 1, 0], rotate: [0, 360] }}
    transition={{ duration, delay: d, repeat: Infinity, ease: 'linear' }}
  />
);

const Home = () => {
  // Find the first upcoming race, or fallback to the last race if all are finished
  const nextRace = schedule.find(race => new Date(race.dateObj) > new Date()) || schedule[schedule.length - 1];

  /* ── parallax refs ── */
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY        = useTransform(heroProgress, [0, 1], ['0%', '40%']);
  const contentY   = useTransform(heroProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);
  const bgScale    = useTransform(heroProgress, [0, 1], [1, 1.15]);

  const statsRef = useRef(null);
  const { scrollYProgress: statsProgress } = useScroll({ target: statsRef, offset: ['start end', 'end start'] });
  const statsY = useTransform(statsProgress, [0, 1], [60, -60]);

  const ctaRef = useRef(null);
  const { scrollYProgress: ctaProgress } = useScroll({ target: ctaRef, offset: ['start end', 'end start'] });
  const ctaBgY = useTransform(ctaProgress, [0, 1], ['0%', '30%']);

  /* ── text character reveal animation ── */
  const titleText = 'THE PINNACLE OF';
  const subtitleText = 'MOTORSPORT';

  const charVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, delay: i * 0.03, ease: 'easeOut' },
    }),
  };

  return (
    <div className="home-container">
      {/* ═══ HERO with multi-layer parallax ═══ */}
      <section className="hero" ref={heroRef}>
        {/* Particles */}
        <div className="particles-layer">
          <FloatingParticle size={4}  left="10%" duration={8}  delay={0} />
          <FloatingParticle size={3}  left="25%" duration={10} delay={2} />
          <FloatingParticle size={5}  left="40%" duration={7}  delay={1} />
          <FloatingParticle size={3}  left="55%" duration={9}  delay={3} />
          <FloatingParticle size={4}  left="70%" duration={11} delay={0.5} />
          <FloatingParticle size={6}  left="85%" duration={8}  delay={2.5} />
          <FloatingParticle size={3}  left="92%" duration={12} delay={1.5} />
        </div>

        {/* Background layer */}
        <motion.div
          className="hero-bg"
          style={{
            y: bgY,
            scale: bgScale
          }}
        />

        {/* Grid overlay */}
        <div className="hero-grid-overlay" />

        {/* Content */}
        <motion.div className="hero-content container" style={{ y: contentY, opacity: heroOpacity }}>
          <motion.div className="hero-badge"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <Flag size={16} /> FORMULA 1 — 2026 SEASON
          </motion.div>

          <div className="hero-title">
            <div className="title-line">
              {titleText.split('').map((char, i) => (
                <motion.span key={i} custom={i} variants={charVariants} initial="hidden" animate="visible" className="hero-char">
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>
            <div className="title-line accent">
              {subtitleText.split('').map((char, i) => (
                <motion.span key={i} custom={i + titleText.length} variants={charVariants} initial="hidden" animate="visible" className="hero-char">
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>
          </div>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
          >
            Experience the thrill, the speed, and the engineering marvels of Formula 1.
          </motion.p>

          <CountdownTimer 
            targetDate={nextRace.dateObj} 
            eventName={nextRace.grandPrix} 
          />

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
            className="hero-actions"
          >
            <Link to="/schedule" className="primary-btn">
              Race Calendar <ChevronRight size={20} />
            </Link>
            <Link to="/drivers" className="secondary-btn">
              Explore Drivers
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="scroll-dot"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span>Scroll to explore</span>
        </motion.div>
      </section>

      {/* ═══ NEWS TICKER ═══ */}
      <div className="news-ticker">
        <div className="news-label">BREAKING</div>
        <div className="news-track-wrapper">
          <motion.div className="news-track" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
            <span>🏁 Cadillac officially joins 2026 grid</span>
            <span>⚡ New Engine Regulations Shake Up Team Strategies</span>
            <span>🚀 Audi prepares for powertrain reveal</span>
            <span>🏎️ Verstappen sets lap record in pre-season simulator</span>
            <span>🏁 Cadillac officially joins 2026 grid</span>
            <span>⚡ New Engine Regulations Shake Up Team Strategies</span>
            <span>🚀 Audi prepares for powertrain reveal</span>
            <span>🏎️ Verstappen sets lap record in pre-season simulator</span>
          </motion.div>
        </div>
      </div>

      {/* ═══ STATS COUNTER SECTION with parallax ═══ */}
      <section className="stats-section" ref={statsRef}>
        <motion.div className="stats-bg-text" style={{ y: statsY }}>
          F1 APEX
        </motion.div>
        <motion.div
          className="stats-grid container"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {[
            { icon: <Users size={32} />, value: `${drivers.length}`, label: 'Drivers' },
            { icon: <Zap size={32} />,   value: `${constructors.length}`, label: 'Constructors' },
            { icon: <Award size={32} />, value: '24', label: 'Races' },
            { icon: <Flag size={32} />,  value: '75+', label: 'Years of Racing' },
          ].map((stat, i) => (
            <motion.div key={i} className="stat-card glass-panel" variants={staggerItem}
              whileHover={{ scale: 1.08, boxShadow: '0 0 30px var(--accent-red-glow)' }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ TEAM LOGOS MARQUEE ═══ */}
      <section className="marquee-section">
        <ScrollReveal>
          <h2 className="section-title" style={{ textAlign: 'center', display: 'block' }}>The Constructors</h2>
        </ScrollReveal>
        <div className="marquee-track">
          <motion.div
            className="marquee-inner"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[...constructors, ...constructors].map((team, i) => (
              <div key={i} className="marquee-item glass-panel" style={{ borderColor: team.color }}>
                <div className="marquee-color-dot" style={{ background: team.color }} />
                <span>{team.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURED DRIVERS with horizontal scroll-parallax ═══ */}
      <section className="featured-drivers container">
        <ScrollReveal direction="left">
          <h2 className="section-title">Top Drivers</h2>
        </ScrollReveal>
        <motion.div
          className="featured-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {drivers.slice(0, 6).map((driver, i) => (
            <motion.div key={driver.id} className="featured-driver-card glass-panel" variants={staggerItem}
              whileHover={{ y: -15, boxShadow: '0 20px 40px rgba(225,6,0,0.25)' }}
            >
              <div className="fd-img-wrap">
                <motion.img
                  src={driver.image} alt={driver.name}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
              </div>
              <div className="fd-number">{driver.number}</div>
              <h4>{driver.name}</h4>
              <p>{driver.team}</p>
            </motion.div>
          ))}
        </motion.div>
        <ScrollReveal delay={0.3}>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/drivers" className="primary-btn">See All Drivers <ChevronRight size={20} /></Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══ CTA SECTION with parallax bg ═══ */}
      <section className="cta-section" ref={ctaRef}>
        <motion.div className="cta-bg" style={{ y: ctaBgY }} />
        <div className="cta-content container">
          <ScrollReveal direction="scale">
            <div className="glass-panel cta-card">
              <Zap size={48} color="var(--accent-red)" />
              <h2>Cutting Edge Technology</h2>
              <p>Discover the machines that push the boundaries of physics on circuits across the globe.</p>
              <Link to="/car" className="primary-btn">View Cars & Teams <ChevronRight size={20} /></Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
