/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
        dark: {
          700: '#1f2937',
          800: '#111827',
          900: '#030712',
        }
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('autofill', '&:-webkit-autofill');
      addVariant('autofill-focus', '&:-webkit-autofill:focus');
    },
  ],
};