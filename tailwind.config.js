/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        passed: '#38a169',
        failed: '#e53e3e',
        inprogress: '#3182ce',
      }
    },
  },
  plugins: [],
}
