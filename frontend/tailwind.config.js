/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: { colors: { ink: '#1e2722', paper: '#f7f7f2', moss: '#c8f169', muted: '#727b73' }, fontFamily: { sans: ['DM Sans', 'sans-serif'], display: ['Manrope', 'sans-serif'] }, boxShadow: { soft: '0 14px 45px rgba(28, 40, 31, .07)' } } },
  plugins: [],
}
