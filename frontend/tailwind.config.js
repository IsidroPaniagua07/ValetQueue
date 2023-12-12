/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fade: 'fadeOut 5s ease-in-out infinite',
      },
      keyframes: theme => ({
        fadeOut: {
          '0%': { backgroundColor: theme('colors.transparent') },
          '50%': { backgroundColor: theme('colors.red.300') },
          '100%': { backgroundColor: theme('colors.transparent') },
        },
      }
      ),
    },
  },
  plugins: [],
}