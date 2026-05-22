import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'xj-earth': '#8B6F47',
        'xj-earth-dark': '#6B5637',
        'xj-rice': '#7A9E7E',
        'xj-rice-dark': '#5A7E5E',
        'xj-sunset': '#E07A5F',
        'xj-sunset-dark': '#C05A3F',
        'xj-paper': '#F7F5F0',
        'xj-amber': '#D97706',
        'xj-amber-dark': '#92400E',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
