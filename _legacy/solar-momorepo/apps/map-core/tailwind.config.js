/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Price scale colors
        price: {
          budget: '#3b82f6',
          average: '#22c55e',
          above: '#eab308',
          premium: '#f97316',
          luxury: '#ef4444',
        },
      },
    },
  },
  plugins: [],
};