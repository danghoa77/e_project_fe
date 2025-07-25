/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        mono: ['Overpass Mono', 'monospace'],
      },
      colors: {
        'primary-brand': '#f6f1eb',
        'secondary-brand': '#ffffff',
        'accent-color': '#fffcf7',
      },
    },
  },
  plugins: [],
}