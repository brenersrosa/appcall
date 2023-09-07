import { Config } from 'tailwindcss'
import { zinc } from 'tailwindcss/colors'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ['var(--font-exo)'],
        sans: ['var(--font-nunito)'],
      },
      colors: {
        background: zinc[900],
      },
      boxShadow: {
        violet: '0px 0px 10px 0px rgba(139, 92, 246, 0.75)',
        zinc: '0px 0px 10px 0px rgba(113, 113, 122, 0.75)',
        red: '0px 0px 10px 0px rgba(239, 68, 68, 0.75)',
      },
    },
  },
  plugins: [],
}
export default config
