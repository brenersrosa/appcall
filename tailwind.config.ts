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
      gridTemplateColumns: {
        custom: '1fr 320px',
      },
      keyframes: {
        hide: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        slideIn: {
          from: {
            transform: 'translateX(calc(100% + var(--viewport-padding)))',
          },
          to: { transform: 'translateX(0)' },
        },
        swipeOut: {
          from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
          to: { transform: 'translateX(calc(100% + var(--viewport-padding)))' },
        },
      },
      animation: {
        hide: 'hide 100ms ease-in',
        slideIn: 'slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        swipeOut: 'swipeOut 100ms ease-out',
        neonPulse: 'neon-pulse 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
