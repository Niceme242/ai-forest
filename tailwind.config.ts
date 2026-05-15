import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 60px rgba(34, 197, 94, 0.25)',
      },
      backgroundImage: {
        'hero-agri': 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.15)), url("https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1920&h=1080&fit=crop")',
        'field-pattern': 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop")',
        'crop-bg': 'url("https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&h=1080&fit=crop")',
        'farm-bg': 'url("https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1920&h=1080&fit=crop")',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        shimmer: {
          '0%': { opacity: '0.15' },
          '50%': { opacity: '0.5' },
          '100%': { opacity: '0.15' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        drift: 'drift 12s ease-in-out infinite',
        shimmer: 'shimmer 4s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
