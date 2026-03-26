/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Core backgrounds
        'bg':        '#0f1a0e',
        'bg-2':      '#162114',
        'surface':   '#1c2a1b',
        'surface-2': '#243323',

        // Accent colors
        'gold':    '#b8860b',
        'gold-lt': '#d4a017',
        'antler':  '#d4b896',
        'antler-dk': '#a8886a',

        // Typography
        'text':       '#f0ede8',
        'text-muted': '#b8b5ae',
        'text-faint': '#7a7770',

        // Borders
        'border':      '#2e3d2d',
        'border-gold': '#b8860b40',
      },
      fontFamily: {
        serif:  ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:   ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 4vw, 3.5rem)',  { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      backgroundImage: {
        'forest-grain':   "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        'gold-shimmer':   'linear-gradient(135deg, #b8860b 0%, #d4a017 35%, #b8860b 65%, #8b6508 100%)',
        'forest-radial':  'radial-gradient(ellipse at 50% 0%, #243323 0%, #0f1a0e 70%)',
      },
      boxShadow: {
        'gold-glow':    '0 0 20px rgba(184,134,11,0.25)',
        'gold-sm':      '0 0 8px rgba(184,134,11,0.15)',
        'card':         '0 2px 16px rgba(0,0,0,0.5)',
        'card-hover':   '0 8px 32px rgba(0,0,0,0.6)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-up':   'fade-up 0.6s ease both',
        'shimmer':   'shimmer 3s ease infinite',
      },
    },
  },
  plugins: [],
};
