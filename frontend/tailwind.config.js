const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2f2',
          100: '#b3d9d9',
          200: '#80bfbf',
          300: '#4da6a6',
          400: '#268c8c',
          500: '#007373',
          600: '#006060',
          700: '#004d4d',
          800: '#003939',
          900: '#002626',
        },
        secondary: {
          50: '#fff5e6',
          100: '#ffe0b3',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#ff9800',
          600: '#f57c00',
          700: '#e65100',
          800: '#d84315',
          900: '#bf360c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '70ch',
            color: '#333',
            a: {
              color: '#007373',
              '&:hover': {
                color: '#006060',
              },
            },
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#007373',
              foreground: '#ffffff',
            },
            secondary: {
              DEFAULT: '#ff9800',
              foreground: '#ffffff',
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: '#4da6a6',
              foreground: '#000000',
            },
            secondary: {
              DEFAULT: '#ffa726',
              foreground: '#000000',
            },
          },
        },
      },
    }),
    require('@tailwindcss/typography'),
  ],
};
