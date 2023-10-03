/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      mobile: { min: "300px", max: "767px" },
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        bc: "#00a8ff",
        bcd: "#0086cc",
        bcvl: "#f0f9ff",
        bs: "#7f8fa6",
      },
      boxShadow: {
        basic: "0px 3px 10px 0px rgba(0, 0, 0, 0.3)",
        underblue: "0px 25px 20px -15px #00a8ff, 0px 0px 10px 0px rgb(0 0 0 / 0.1)",
      },
      keyframes: {
        appearSidebar: {
          "0%": {
            transform: "translate(-20px, 0px)",
          },
          "100%": {
            transform: "translate(0px, 0px)",
          },
        },
      },
      animation: {
        appearSidebar: "appearSidebar 0.3s forwards",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
