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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      animation: {
        tilt: 'tilt 10s infinite linear',
        'spin-slow': 'spin 8s linear infinite',
        'toxic-pulse': 'toxic-pulse 2.8s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
      },
      keyframes: {
        tilt: {
          '0%, 50%, 100%': {
            transform: 'rotate(0deg)',
          },
          '25%': {
            transform: 'rotate(0.5deg)',
          },
          '75%': {
            transform: 'rotate(-0.5deg)',
          },
        },
        'toxic-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0px rgba(168,85,247,0.0)',
          },
          '50%': {
            transform: 'scale(1.04)',
            boxShadow: '0 0 28px rgba(168,85,247,0.35)',
          },
        },
        'float-slow': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
