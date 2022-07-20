/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        flipOut: {
          "0%": { transform: "rotateX(0deg)" },
          "100%": { transform: "rotateX(-180deg)" },
        },
        flipIn: {
          "0%": { transform: "rotateX(-180deg)" },
          "100%": { transform: "rotateX(0deg)" },
        },
        popIn: {
          "0%": { transform: "scale(0.8)" },
          "40%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        flipOut: "flipOut 0.2s linear forwards",
        flipIn: "flipIn 0.2s linear forwards",
        popIn: "popIn 0.1s linear"
      },
    },
  },
  plugins: [],
};
