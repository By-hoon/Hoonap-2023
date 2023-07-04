/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bc: "#00a8ff",
        bs: "#7f8fa6",
      },
      boxShadow: {
        basic: "0px 3px 10px 0px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
