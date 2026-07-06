# 🏎️ F1 Live Circuit Tracker

A high-performance, real-time Formula 1 dashboard and circuit visualization tool. This application leverages the **OpenF1 API** to provide live telemetry, track positions, and race standings in a premium, dark-themed interface.

![F1 Dashboard Concept](https://images.unsplash.com/photo-1500021804447-2ca2eaaaabeb?q=80&w=2070&auto=format&fit=crop)

## ✨ Features

- **Live Circuit Map**: A high-performance 2D track visualization built with **PixiJS (v7)**. Watch driver "dots" move in real-time or during replays.
- **Dynamic Standings**: Real-time leaderboard showing positions, gaps to the leader, and intervals between drivers.
- **Deep Telemetry**: Select any driver to view live car data including:
  - Speed (km/h)
  - Engine RPM
  - Current Gear
  - Throttle & Brake input percentages
  - DRS status
- **Replay System**: Access historical sessions (2023 season) and relive the race with adjustable playback speeds (1x, 5x, 10x).
- **Track Conditions**: Live monitoring of air temperature, track temperature, humidity, and rainfall status.
- **Responsive Design**: Optimized for desktop monitoring with a multi-pane dashboard layout.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) (v18)
- **Rendering Engine**: [PixiJS](https://pixijs.com/) (High-performance WebGL/Canvas graphics)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Source**: [OpenF1 API](https://openf1.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)

## 🚀 Getting Started

### Prerequisites

- A modern web browser with WebGL support.
- Node.js (if running locally via a development server).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/f1-circuit-tracker.git
   cd f1-circuit-tracker
   ```

2. Since this project uses ESM imports and a browser-native import map, you can serve it using any static file server:
   ```bash
   # Using npx (serve)
   npx serve .
   
   # Or using Python
   python -m http.server 8000
   ```

3. Open your browser and navigate to `http://localhost:8000`.

## 📡 API Usage & Rate Limiting

This project uses the free [OpenF1 API](https://openf1.org/). To ensure stability and respect the community-run service:
- **Staggered Polling**: Telemetry is fetched in cycles (Positions every 3s, Intervals every 10s, Weather every 60s).
- **Request Deduplication**: In-flight requests are cached to prevent redundant network calls.
- **Backoff Logic**: Simple exponential backoff is implemented to handle `429 Too Many Requests` errors.

## 🗺️ Roadmap

- [ ] Sector-by-sector timing colors (Purple/Green/Yellow).
- [ ] Historical lap time comparison charts using Recharts.
- [ ] Strategy view (Tyre age and compound visualization).
- [ ] Team Radio / Race Control message feed integration.
- [ ] Support for the 2024 and 2025 seasons.

## ⚖️ Disclaimer

This is an **unofficial fan project**. It is not affiliated with, sponsored by, or endorsed by the Formula 1 group of companies. "F1", "FORMULA 1", "FIA FORMULA ONE WORLD CHAMPIONSHIP", and related marks are trademarks of Formula One Licensing B.V.

Data provided by the incredible [OpenF1](https://openf1.org/) project.

---
Built with ❤️ by a racing fan.