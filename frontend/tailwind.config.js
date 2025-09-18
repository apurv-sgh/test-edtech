/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // This enables class-based dark mode
  theme: {
    extend: {
      colors: {
        'primary': '#6D28D9', // A vibrant violet
        'primary-focus': '#5B21B6', // A darker shade for hover/focus
        'primary-light': '#F5F3FF', // A light lavender for backgrounds
        'dark-bg': '#111827', // A deep, dark background for dark mode
        'dark-card': '#1F2937', // A slightly lighter card background for dark mode
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.2s ease-out forwards',
      }
    },
    plugins: [
      require('@tailwindcss/typography'),
      require('tailwind-scrollbar'),
    ],
  }
}