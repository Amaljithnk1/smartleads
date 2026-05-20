/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cyan: {
          DEFAULT: '#00d4ff',
          dim: 'rgba(0,212,255,0.15)',
          glow: 'rgba(0,212,255,0.08)',
        },
        surface: {
          dark: 'rgba(5,12,25,0.8)',
          darker: 'rgba(2,8,20,0.9)',
          light: 'rgba(255,255,255,0.65)',
          lighter: 'rgba(255,255,255,0.8)',
        },
      },
      backgroundImage: {
        'bg-dark': "url('/src/assets/bg-dark.jpg')",
        'bg-light': "url('/src/assets/bg-light.jpg')",
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        scan: { '0%': { top: '0' }, '100%': { top: '100vh' } },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0,212,255,0.3)',
        'cyan-glow-lg': '0 0 40px rgba(0,212,255,0.4)',
        'violet-glow': '0 0 20px rgba(192,132,252,0.3)',
      },
    },
  },
  plugins: [],
};
