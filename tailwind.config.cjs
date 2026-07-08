/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'monument': ['"ABC Monument Grotesk"', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: {
            50: '#ffefea',
            100: '#ffccbd',
            200: '#ffb49d',
            300: '#fe9170',
            400: '#fe7c55',
            500: '#fe5b2a',
            600: '#e75326',
            700: '#b4411e',
            800: '#8c3217',
            900: '#6b2612',
          },
          grey: {
            100: '#eff0f1',
            150: '#e0e1e3',
            200: '#c3c4c8',
            250: '#b5b5b5',
            300: '#a3a3a4',
            400: '#8b8c8d',
            500: '#747576',
            600: '#464749',
            700: '#2f3032',
            750: '#222326',
            800: '#18191b',
            850: '#141415',
            900: '#0c0c0c',
          },
        },
      },
      spacing: {
        0.25: '0.0625em',
        0.5: '0.125em',
        1: '0.25em',
        2: '0.5em',
        3: '0.75em',
        4: '1em',
        5: '1.25em',
        6: '1.5em',
        7: '1.75em',
        8: '2em',
        9: '2.5em',
        10: '3em',
        11: '4em',
        12: '5em',
        13: '6.25em',
        14: '8.25em',
        15: '10.25em',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
  corePlugins: {
    container: false,
  },
};