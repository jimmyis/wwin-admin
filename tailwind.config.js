/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  important: true,
  theme: {
    screens: {
      xl: { max: '1280px' },
      lg: { max: '1024px' },
      md: { max: '768px' },
      sm: { max: '640px' },
      xs: { max: '376px' },
    },

    colors: {
      primary: {
        50: '#f6f5fa',
        100: '#eeebf4',
        200: '#d3cce4',
        300: '#b9add3',
        400: '#8570b2',
        500: '#503291',
        600: '#482d83',
        700: '#3c266d',
        800: '#301e57',
        900: '#271947',
      },
      secondary: {
        50: '#f6fbf6',
        100: '#eef8ed',
        200: '#d3edd2',
        300: '#b9e2b7',
        400: '#85cd80',
        500: '#50b74a',
        600: '#48a543',
        700: '#3c8938',
        800: '#306e2c',
        900: '#275a24',
      },
      black: {
        50: '#e8e8ea',
        100: '#d1d2d4',
        200: '#b9bbbf',
        300: '#8b8e95',
        400: '#5d616a',
        500: '#454a55',
        600: '#2e343f',
        700: '#171d2a',
        800: '#121722',
        900: '#0e1119',
      },
      success: {
        50: '#f3fcf7',
        100: '#e6f9ef',
        200: '#c1efd6',
        300: '#9ce5bd',
        400: '#52d28c',
        500: '#08bf5b',
        600: '#07ac52',
        700: '#068f44',
        800: '#057337',
        900: '#045e2d',
      },
      error: {
        50: '#fef7f7',
        100: '#fdeeee',
        200: '#fad5d5',
        300: '#f7bcbc',
        400: '#f18989',
        500: '#eb5757',
        600: '#d44e4e',
        700: '#b04141',
        800: '#8d3434',
        900: '#732b2b',
      },
      green: {
        50: '#f3fcf9',
        100: '#e7f8f2',
        200: '#c3eee0',
        300: '#9fe3cd',
        400: '#58cea7',
        500: '#10b981',
        600: '#0ea774',
        700: '#0c8b61',
        800: '#0a6f4d',
        900: '#085b3f',
      },
      blue: {
        50: '#f5f9ff',
        100: '#ebf3fe',
        200: '#cee0fd',
        300: '#b1cdfb',
        400: '#76a8f9',
        500: '#3b82f6',
        600: '#3575dd',
        700: '#2c62b9',
        800: '#234e94',
        900: '#1d4079',
      },
      warning: {
        50: '#fffaf3',
        100: '#fef5e7',
        200: '#fde7c2',
        300: '#fbd89d',
        400: '#f8bb54',
        500: '#f59e0b',
        600: '#dd8e0a',
        700: '#b87708',
        800: '#935f07',
        900: '#784d05',
      },
      white: '#ffffff',
      backdrop: '#F5F7F9',
      disabled: '#EFF1F3',
      transparent: '#FFFFFF00',
    },

    fontFamily: {
      ...defaultTheme.fontFamily,
      roboto: [`'Roboto', sans-serif`],
    },

    minWidth: {
      ...defaultTheme.minWidth,
      ...defaultTheme.spacing,
    },

    minHeight: {
      ...defaultTheme.minHeight,
      ...defaultTheme.spacing,
    },

    boxShadow: {
      ...defaultTheme.boxShadow,
      soft: '0px 0px 16px rgba(52, 73, 85, 0.08)',
      medium: '0px 0px 8px rgba(52, 73, 85, 0.08), 0px 8px 16px rgba(52, 73, 85, 0.08)',
      hard: '0px 0px 4px rgba(0, 0, 0, 0.16), 0px 4px 8px rgba(52, 73, 85, 0.36)',
    },

    extend: {
      maxWidth: {
        ...defaultTheme.spacing,
        '7xl': '80rem',
      },

      maxHeight: {
        ...defaultTheme.spacing,
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['checked'],
      borderColor: ['checked'],
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const utilities = Object.keys(defaultTheme.spacing)
        .filter((key) => key === 'px' || (key >= 1 && key % 1 === 0))
        .reduce(
          (temp, key) => ({
            ...temp,
            [`.square-${key}`]: {
              width: defaultTheme.spacing[key],
              height: defaultTheme.spacing[key],
            },
          }),
          {},
        )

      addUtilities(utilities)
    }),
  ],
  corePlugins: {
    container: false,
  },
}
