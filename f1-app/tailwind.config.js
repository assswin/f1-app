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
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    }
  },
  plugins: [],
}
