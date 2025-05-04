/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
      "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        abril: ["var(--font-abril)"],
        roboto: ['var(--font-roboto)']
      }
    },
  },
  plugins: [
   nextui({
        prefix: "nextui", // prefix for themes variables
        addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
        defaultTheme: "light", // default theme from the themes object
        defaultExtendTheme: "light", // default theme to extend on custom themes
        layout: {}, // common layout tokens (applied to all themes)
        themes: {
          light: {
              layout: {}, // light theme layout tokens
              colors: {
                writeup: "#000000"
            }, // light theme colors
          },

          dark: {
              layout: {}, // dark theme layout tokens
              colors: {
                writeup: "white"
            }, // dark theme colors
          },

        
          // kindle like theme
          ebookLight: {
            colors: {
          },

          ebookMid: {

          },

          ebookWarm: {

          }
        }
        }
    }),
  ],
}

