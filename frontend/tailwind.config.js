/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      fontFamily: {
        display: ['"Trebuchet MS"', '"Segoe UI"', "sans-serif"],
        body: ['"Segoe UI"', "Tahoma", "Geneva", "sans-serif"]
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(22px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.75s ease-out forwards",
        "fade-up": "fade-up 0.7s ease-out forwards",
        float: "float 8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
