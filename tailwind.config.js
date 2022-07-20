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
        shake: {
          "0%": { transform: "translateX(0px)" },
          "10%": { transform: "translateX(-1px)" },
          "20%": { transform: "translateX(2px)" },
          "30%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "50%": { transform: "translateX(-4px)" },
          "60%": { transform: "translateX(4px)" },
          "70%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(2px)" },
          "90%": { transform: "translateX(-1px)" },
          "100%": { transform: "translateX(0px)" },
        },
      },
      animation: {
        flipOut: "flipOut 0.2s linear forwards",
        flipIn: "flipIn 0.2s linear forwards",
        popIn: "popIn 0.1s linear",
        shake: "shake 0.6s linear",
      },
    },
  },
  plugins: [require("daisyui")],
};
