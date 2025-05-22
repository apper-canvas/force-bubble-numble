/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8C52FF',
          light: '#A980FF',
          dark: '#6930C3'
        },
        secondary: {
          DEFAULT: '#FF7E5F',
          light: '#FF9E8F',
          dark: '#E55A3C'
        },
        accent: '#5CE1E6',
        surface: {
          50: '#f8fafc',   // Lightest
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',  // Added
          500: '#64748b',  // Added
          600: '#475569',  // Added
          700: '#334155',  // Added
          800: '#1e293b',  // Added
          900: '#0f172a'   // Darkest
        }
      },
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui'],
        heading: ['Nunito', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
        'bubble': '0 4px 10px rgba(0, 0, 0, 0.1), inset 0 -2px 5px rgba(0, 0, 0, 0.05), inset 0 2px 5px rgba(255, 255, 255, 0.5)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        'full': '9999px'
      },
      animation: {
        'float': 'float 15s linear infinite',
        'float-slow': 'float 20s linear infinite',
        'float-fast': 'float 10s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        'float': {
          '0%': { transform: 'translateY(100vh)' },
          '100%': { transform: 'translateY(-100px)' }
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(-3%)' },
          '50%': { transform: 'translateY(0)' }
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.85 }
        }
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}