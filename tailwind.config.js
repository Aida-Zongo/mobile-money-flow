/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A7B5E',
        'primary-light': '#E8F5F1',
        accent: '#F5A623',
        success: '#16A34A',
        danger: '#F04438',
        warning: '#F59E0B',
        background: '#F5F7F5',
        'text-main': '#1A1D23',
        'text-muted': '#8A94A6',
        border: '#E2EAE7',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
