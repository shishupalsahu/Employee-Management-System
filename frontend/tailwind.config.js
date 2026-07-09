/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Stylish Indigo color for buttons/links
        secondary: "#0F172A", // Dark Slate for modern headers/sidebars
      }
    },
  },
  plugins: [],
}