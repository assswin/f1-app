const Footer = () => {
  return (
    <footer>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <p>&copy; {new Date().getFullYear()} F1 Apex. This website is unofficial and is not associated in any way with the Formula 1 companies.</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Data Source: <a href="https://www.formula1.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-red)', textDecoration: 'none' }}>Formula1.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
