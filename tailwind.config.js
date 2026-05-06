/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      colors: {
        hestia: {
          primary: '#1a5f4a',
          'primary-light': '#2d8a6e',
          'primary-dark': '#124a3a',
          accent: '#e8b931',
          rent: '#c78d1a',
        },
      },
    },
  },
  plugins: [],
}
