/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0D0D0D',
        card: '#151515',
        accent: '#00D4AA',
        warning: '#FFB020',
        danger: '#FF4D4D',
        text2: '#A0A0A0',
      },
    },
  },
  plugins: [],
}
