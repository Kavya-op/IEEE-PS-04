/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neu: {
          base: '#E0E5EC',
          shadowDark: '#A3B1C6',
          shadowLight: '#FFFFFF',
          text: '#1A253C',
          textMuted: '#52607B',
          accent: '#2563EB',
          accentHover: '#1D4ED8',
          bar: '#B0BAC8'
        },
        cyber: {
          dark: '#070b14',
          card: '#0d1527',
          cardHover: '#131f38',
          border: 'rgba(56, 189, 248, 0.15)',
          neonCyan: '#06b6d4',
          neonBlue: '#3b82f6',
          neonPurple: '#a855f7',
          neonRed: '#f43f5e',
          neonAmber: '#f59e0b',
          neonGreen: '#10b981',
        }
      },
      boxShadow: {
        'neu-outset': '9px 9px 16px #A3B1C6, -9px -9px 16px #FFFFFF',
        'neu-inset': 'inset 6px 6px 12px #A3B1C6, inset -6px -6px 12px #FFFFFF',
        'neu-outset-sm': '4px 4px 8px #A3B1C6, -4px -4px 8px #FFFFFF',
        'neu-inset-sm': 'inset 3px 3px 6px #A3B1C6, inset -3px -3px 6px #FFFFFF',
        'neu-blue': '6px 6px 14px #93A1B6, -6px -6px 14px #FFFFFF',
        'neu-blue-active': 'inset 4px 4px 8px #1E40AF, inset -4px -4px 8px #3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        dyslexic: ['Lexend', 'Comic Sans MS', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 8px rgba(6, 182, 212, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.45)' },
        }
      }
    },
  },
  plugins: [],
}

