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
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        success: '#10b981', // green for clock in
        danger: '#ef4444',  // red for clock out / alerts
        warning: '#f59e0b', // orange for overtime
        accent: '#8b5cf6',
      }
    },
  },
  plugins: [],
}
