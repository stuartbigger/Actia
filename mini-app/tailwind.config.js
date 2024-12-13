/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Modify based on your file structure
    './pages/**/*.{js,ts,jsx,tsx}', // Modify based on your file structure
    './components/**/*.{js,ts,jsx,tsx}', // Modify based on your file structure
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
