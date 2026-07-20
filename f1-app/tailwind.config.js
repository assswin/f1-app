/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        background: '#09090b', // neutral-950
        surface: '#18181b',    // neutral-900
        border: '#27272a',     // neutral-800
        primary: '#ef4444',    // red-500 (F1 Red)
        muted: '#a1a1aa',      // neutral-400
        f1: {
          red: "#E10600",
          dark: "#15151E",
          surface: "#1A1A26",
          card: "#1E1E2E",
          border: "#2A2A3C",
          muted: "var(--f1-muted)",
          text: "#E5E7EB",
        },
        tyre: {
          soft: "#FF3333",
          medium: "#FFC906",
          hard: "#FFFFFF",
          inter: "#39B54A",
          wet: "#0067FF",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    }
  },
  plugins: [],
}
