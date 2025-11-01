/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFFBEA", // define your bg-cream color here
        dark: "#1A1A1A",  // define your text-dark color here
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // optional, just for consistency
      },
    },
  },
  plugins: [],
};
