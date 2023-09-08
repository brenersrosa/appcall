import { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config: Config = {
  darkMode: ['class', '[data-mode="dark"]'],
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
        light: {
          background: colors.zinc[100],

          light: colors.zinc[600],
          medium: colors.zinc[700],
          black: colors.zinc[900],
        },
        dark: {
          background: colors.zinc[900],

          light: colors.zinc[400],
          medium: colors.zinc[200],
          black: colors.zinc[50],
        },
        primary: {
          light: colors.violet[400],
          medium: colors.violet[500],
          black: colors.violet[600],
        },
        secondary: {
          light: colors.zinc[400],
          medium: colors.zinc[600],
          black: colors.zinc[800],
        },
        success: colors.green[500],
        error: colors.red[500],
        warning: colors.yellow[500],
      },
      boxShadow: {
        violet: '0px 0px 10px 0px rgba(139, 92, 246, 0.75)',
        zinc: '0px 0px 10px 0px rgba(113, 113, 122, 0.75)',
        red: '0px 0px 10px 0px rgba(239, 68, 68, 0.75)',
      },
      backgroundImage: {
        home: "url('../assets/background/home.svg')",
      },
    },
  },
  plugins: [],
}
export default config
