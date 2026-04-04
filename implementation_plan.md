# F1 Racing Website Implementation Plan

This plan outlines the approach to building a structured, responsive, and animated F1 racing React application. The website will incorporate modern aesthetics, parallax effects, scroll animations, and include data for drivers, constructors, cars, and racing locations.

## User Review Required

> [!IMPORTANT]
> - Since the `website` directory already contains folders (`background`, `car`, `driver`), creating a Vite project directly in it might cause conflicts. I plan to initialize the React app in a new folder called `c:\Users\aswin\Desktop\website\f1-app`, and then move your provided image assets into `f1-app/public/assets/`. Is this acceptable?
> - Can you confirm that you don't mind using **Vanilla CSS mixed with Framer Motion** for styling rather than Tailwind CSS (in accordance with my best practices unless you explicitly request Tailwind)?

## Proposed Changes

### 1. Framework Setup
- **Tooling**: React via Vite (`npx -y create-vite@latest f1-app --template react`)
- **Dependencies**: `framer-motion` (for parallax and scroll animations), `react-router-dom` (for structured navigation), and `lucide-react` (for UI icons).
- **Asset Migration**: Move the `background`, `car`, and `driver` directories into `f1-app/public/assets/` so they are accessible from the web root.

### 2. Website Structure & Routes
- **Home (`/`)**: A dynamic landing page with a parallax background using your background image. It will feature an animated hero section and quick links to other sections.
- **Drivers (`/drivers`)**: A responsive grid showcasing the 22 drivers using their provided profile pictures. A search bar will be included so users can filter drivers by name. Clicking a driver will open a modal or dedicated page with their bio, team, and stats.
- **Cars (`/car`)**: Details about the 10 teams (Ferrari, Mercedes, Red Bull Racing, McLaren, Aston Martin, Alpine, Williams, Racing Bulls, Audi, Cadillac) mapping to the 11 car images.
- **About Us (`/about`)**: A simple animated page about the website.

### 3. Design & Aesthetics
- **Theme**: Premium dark mode with sleek glassmorphism panels, vibrant racing colors (neon red, bright cyan accents for different teams), and clean modern typography.
- **Animations**: Using `framer-motion` for smooth page transitions, stagger animations for grids, scroll-triggered fade-ins, and a prominent parallax hero.

### 4. Mock Data Generation
- **[NEW] `src/data/f1Data.js`**: I will craft a javascript object encompassing driver bio data, constructors, and car mappings. This will serve as our structured "database".

## Open Questions

> [!WARNING]
> - There are 11 car images but 10 constructors. I will map them as logically as possible and assign generic/placeholder data for the cars if I miss a 1-to-1 visual match.
> - What specific information would you like in the "About Us" section, or should I generate a generic placeholder text for now?

## Verification Plan

### Automated/Code Verification
- Start the Vite development server (`npm run dev`).
- Check that all routes (`/`, `/drivers`, `/car`, `/about`) render without errors.
- Ensure no missing image paths (404s) for drivers and background.

### Manual Verification
- Ask you to open the local development server URL.
- Test the parallax scroll effect on the Home page.
- Test the driver search functionality.
- Confirm responsive layout on varying window sizes.
