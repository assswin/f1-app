import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Cpu, Flame } from 'lucide-react';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const values = [
    { icon: <Flame size={32} />, title: 'Passion', text: 'Born from an unwavering love for the fastest sport on Earth.' },
    { icon: <Cpu size={32} />, title: 'Technology', text: 'Built with React, Vite, and Framer Motion for a premium experience.' },
    { icon: <Heart size={32} />, title: 'Community', text: 'For the fans, by the fans — celebrating every lap, every heartbeat.' },
  ];

  return (
    <div className="page-wrapper container" ref={ref} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Parallax bg text */}
      <motion.div style={{
        position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)',
        fontSize: '14rem', fontWeight: 900, color: 'rgba(255,255,255,0.015)',
        whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 0, y: bgY,
      }}>
        ABOUT
      </motion.div>

      <motion.div
        style={{ position: 'relative', zIndex: 1 }}
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Main card */}
        <motion.div
          className="glass-panel"
          style={{ padding: '60px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}
          variants={scaleIn}
        >
          <motion.h1
            className="section-title"
            variants={fadeUp}
          >
            About F1 Apex
          </motion.h1>

          <motion.p variants={fadeUp} style={{ fontSize: '1.25rem', color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
            Welcome to F1 Apex, your premier destination for the latest in Formula 1 racing. This fan-made platform was built to celebrate the pinnacle of motorsport, featuring cutting-edge drivers and historic constructors.
          </motion.p>
          <motion.p variants={fadeUp} style={{ fontSize: '1.15rem', color: '#999', lineHeight: 1.8 }}>
            Our goal is to present the grid in a visually stunning and dynamic way, using advanced web technologies to deliver an experience that matches the speed and innovation of F1 itself.
          </motion.p>
        </motion.div>

        {/* Value cards */}
        <motion.div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', maxWidth: '800px', margin: '50px auto 0' }}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {values.map((v, i) => (
            <motion.div
              key={i}
              className="glass-panel"
              style={{ padding: '36px 24px', textAlign: 'center', cursor: 'default' }}
              variants={fadeUp}
              whileHover={{ y: -10, boxShadow: '0 15px 35px rgba(225,6,0,0.2)' }}
            >
              <div style={{ color: 'var(--accent-red)', marginBottom: '16px' }}>{v.icon}</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{v.title}</h3>
              <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: 1.6 }}>{v.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
