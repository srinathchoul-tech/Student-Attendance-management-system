/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./student-dashboard.html",
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#70a4ff',
          500: '#4a8eff',
          600: '#2f70e6'
        }
      }
    }
  },
  plugins: [],
}