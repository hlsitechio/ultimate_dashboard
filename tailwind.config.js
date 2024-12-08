const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          dark: '#3730A3'
        },
        secondary: {
          DEFAULT: '#7E22CE',
          dark: '#581C87'
        },
        background: {
          DEFAULT: '#0A0A0F',
          light: '#1A1A2E'
        }
      }
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      dark: {
        colors: {
          default: {
            foreground: "#FFFFFF"
          }
        }
      }
    }
  })],
}