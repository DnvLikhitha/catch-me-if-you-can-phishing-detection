/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        safe: {
          light: '#10b981',
          dark: '#059669'
        },
        suspicious: {
          light: '#f59e0b',
          dark: '#d97706'
        },
        dangerous: {
          light: '#f97316',
          dark: '#ea580c'
        },
        critical: {
          light: '#ef4444',
          dark: '#dc2626'
        }
      }
    },
  },
  plugins: [],
}
