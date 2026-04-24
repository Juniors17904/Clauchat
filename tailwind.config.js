/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        claude: {
          bg: '#1a1a1a',
          surface: '#242424',
          border: '#3a3a3a',
          text: '#e8e8e8',
          muted: '#888',
          accent: '#d97757',
          user: '#2a2a2a',
          assistant: '#1e1e1e',
        },
      },
    },
  },
  plugins: [],
}

