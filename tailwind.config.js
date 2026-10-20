/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        og: {
          dark: '#0a1a14',
          forest: '#123c30',
          emerald: '#1d9e75',
          mint: '#5dcaa5',
          lightBg: '#f2f2f7',
          card: '#ffffff',
          gold: '#c8860a',
          purple: '#6d28d9',
          danger: '#e24b4a'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      }
    },
  },
  plugins: [],
}
