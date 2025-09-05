// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#38e07b',      // The bright green
        'background': '#111714',  // The darkest page background
        'surface': '#1a231e',      // The lighter card background
        'subtle-text': '#9eb7a8',  // The muted text color
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}