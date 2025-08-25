/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      colors: {
        'empire-green': '#065f46',
        'empire-blue': '#1e40af', 
        'empire-purple': '#7c3aed'
      }
    },
  },
  plugins: [],
}
