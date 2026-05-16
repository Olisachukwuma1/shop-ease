/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
      },
      colors: {
        gold: '#c9a84c',
        'gold-light': '#e8d5a3',
        cream: '#f5f0e8',
        charcoal: '#1e1e1e',
        muted: '#6b6b6b',
      },
    },
  },
  plugins: [],
}