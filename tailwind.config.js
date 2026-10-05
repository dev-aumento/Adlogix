/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#233DFF",
          "blue-hover": "#172edb",
          "blue-light": "#EBF0FF",
          "blue-glow": "rgba(35, 61, 255, 0.15)",
          navy: "#0F1E3D",
          "navy-dark": "#070E1E",
          "navy-light": "#1B2F5B",
          dark: "#111827",
          muted: "#667085",
          border: "#E8ECF4",
          surface: "#FFFFFF",
          "surface-soft": "#F5F7FF",
          "surface-glossy": "rgba(255, 255, 255, 0.85)",
          accent: "#00D2FF",
          emerald: "#10B981",
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Outfit', 'Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glossy': '0 8px 32px 0 rgba(35, 61, 255, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.04)',
        'glossy-hover': '0 20px 48px -8px rgba(35, 61, 255, 0.16), 0 8px 16px -4px rgba(15, 30, 61, 0.06)',
        'card-subtle': '0 4px 20px rgba(15, 30, 61, 0.04), 0 1px 3px rgba(15, 30, 61, 0.02)',
        'blue-glow': '0 0 35px rgba(35, 61, 255, 0.28)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '16px',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'glow-spin': 'spin 12s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
