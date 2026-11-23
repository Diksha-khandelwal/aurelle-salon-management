/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#162E25',
          dark: '#0F221B',
          light: '#2D5240',
          subtle: '#E8EFEA',
        },
        champagne: {
          DEFAULT: '#C5A880',
          light: '#E5D5B8',
          dark: '#A88B65',
          subtle: '#FAF6EF',
        },
        linen: {
          DEFAULT: '#FBF9F5',
          card: '#FFFFFF',
          subtle: '#F5F2EB',
          border: '#E7E2D8',
        },
        charcoal: {
          DEFAULT: '#1C1917',
          muted: '#78716C',
          light: '#A8A29E',
        },
        slateDark: '#0D1512',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(22, 46, 37, 0.04)',
        'elevated': '0 12px 32px rgba(22, 46, 37, 0.08)',
        'modal': '0 24px 48px -12px rgba(15, 34, 27, 0.25)',
      },
    },
  },
  plugins: [],
}
