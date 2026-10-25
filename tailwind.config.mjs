/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        onyx: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#141724',
          850: '#0f111c',
          900: '#0a0c14',
          950: '#06070b',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1', boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.5)' },
          '50%': { transform: 'scale(1.04)', opacity: '0.9', boxShadow: '0 0 0 8px rgba(99, 102, 241, 0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite linear',
        pulseGlow: 'pulseGlow 2.5s infinite ease-in-out',
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'luxury': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.07), 0 8px 30px -4px rgba(0, 0, 0, 0.6)',
        'glow': '0 0 35px -5px rgba(99, 102, 241, 0.3)',
      },
    },
  },
  plugins: [],
}
