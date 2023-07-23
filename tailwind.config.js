/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
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
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
