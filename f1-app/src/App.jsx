import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Drivers from './pages/Drivers';
import Cars from './pages/Cars';
import About from './pages/About';
import Schedule from './pages/Schedule';
import Standings from './pages/Standings';
import HistoricalStandings from './pages/HistoricalStandings';
import LiveSessionPicker from './pages/LiveSessionPicker';
import LiveTimingPage from './pages/LiveTimingPage';
import { useSearchParams } from 'react-router-dom';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
};

function LiveRouteHandler() {
  const [searchParams] = useSearchParams();
  if (searchParams.has('year')) {
    return <LiveTimingPage />;
  }
  return <LiveSessionPicker />;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div {...pageTransition}><Home /></motion.div>} />
        <Route path="/drivers" element={<motion.div {...pageTransition}><Drivers /></motion.div>} />
        <Route path="/car" element={<motion.div {...pageTransition}><Cars /></motion.div>} />
        <Route path="/schedule" element={<motion.div {...pageTransition}><Schedule /></motion.div>} />
        <Route path="/standings" element={<motion.div {...pageTransition}><Standings /></motion.div>} />
        <Route path="/standings/history" element={<motion.div {...pageTransition}><HistoricalStandings /></motion.div>} />
        <Route path="/live" element={<motion.div {...pageTransition}><LiveRouteHandler /></motion.div>} />
        <Route path="/replay" element={<motion.div {...pageTransition}><LiveTimingPage /></motion.div>} />
        <Route path="/about" element={<motion.div {...pageTransition}><About /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  return (
    <Router>
      <div className="global-video-bg">
        <video autoPlay loop muted={isVideoMuted} playsInline>
          <source src="/assets/video/background.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay" />
      </div>
      
      <div className="app-content-wrapper">
        <Navbar isVideoMuted={isVideoMuted} setIsVideoMuted={setIsVideoMuted} />
        <AnimatedRoutes />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
