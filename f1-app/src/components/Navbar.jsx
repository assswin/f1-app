import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Menu, X, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuVariants = {
  closed: { opacity: 0, x: '100%' },
  open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { opacity: 0, x: '100%', transition: { duration: 0.25 } },
};

const linkVariants = {
  closed: { opacity: 0, x: 30 },
  open: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.3 },
  }),
};

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/drivers', label: 'Drivers' },
  { to: '/car', label: 'Cars & Teams' },
  { to: '/about', label: 'About Us' },
];

const Navbar = ({ isVideoMuted, setIsVideoMuted }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Close mobile menu & scroll top on route change */
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="container">
          <Link to="/" className="logo">
            <Trophy color="var(--accent-red)" size={28} />
            <span>F1</span>Apex
          </Link>

          {/* Desktop links */}
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={location.pathname === link.to ? 'active' : ''}>
                {link.label}
              </Link>
            ))}
            <button className="audio-toggle desk-audio" onClick={() => setIsVideoMuted(!isVideoMuted)} title="Toggle Sound">
              {isVideoMuted ? <VolumeX size={18} /> : <Volume2 size={18} color="var(--accent-red)" />}
            </button>
          </div>

          {/* Mobile toggle & Audio */}
          <div className="mobile-controls">
            <button className="audio-toggle mob-audio" onClick={() => setIsVideoMuted(!isVideoMuted)}>
              {isVideoMuted ? <VolumeX size={22} /> : <Volume2 size={22} color="var(--accent-red)" />}
            </button>
            <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="mobile-menu glass-panel"
            variants={menuVariants} initial="closed" animate="open" exit="exit"
          >
            {navLinks.map((link, i) => (
              <motion.div key={link.to} custom={i} variants={linkVariants} initial="closed" animate="open">
                <Link to={link.to} className={location.pathname === link.to ? 'active' : ''} onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
