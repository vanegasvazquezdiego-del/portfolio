/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      },
      colors: {
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
          glow: 'var(--accent-glow)'
        }
      },
      boxShadow: {
        glow: '0 0 24px var(--accent-glow), 0 0 48px var(--accent-glow)',
        card: '0 8px 32px rgba(0,0,0,0.35)'
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 12px var(--accent-glow)' },
          '50%': { boxShadow: '0 0 32px var(--accent-glow)' }
        }
      }
    }
  },
  plugins: []
}
