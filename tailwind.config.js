const colors = require("tailwindcss/colors");
const {
  "[data-theme=light]": light,
  "[data-theme=dark]": dark,
} = require("daisyui/src/colors/themes");

const green = {
  50: "#e8f9e8",
  100: "#cce5cb",
  200: "#aed3ab",
  300: "#8fbf8b",
  400: "#70ad6b",
  500: "#579452",
  600: "#43733f",
  700: "#2e522b",
  800: "#1a3218",
  900: "#021200",
};

const yellow = {
  50: "#fcf6e1",
  100: "#ede5c0",
  200: "#e0d49c",
  300: "#d3c277",
  400: "#c7b152",
  500: "#ad9838",
  600: "#87762a",
  700: "#60541c",
  800: "#3a330e",
  900: "#151100",
};

const gray = colors.neutral;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray,
        yellow,
        green,
      },
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
        fadeOut: {
          "0%": { opacity: 1, transform: "scale(1)" },
          "100%": { opacity: 0, transform: "scale(0.9)" },
        }
      },
      animation: {
        flipOut: "flipOut 0.2s linear forwards",
        flipIn: "flipIn 0.2s linear forwards",
        popIn: "popIn 0.1s linear",
        shake: "shake 0.25s linear",
        fadeOut: "fadeOut 0.15s ease-out forwards"
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      // The green 'success' color should match the green letter boxes:
      {
        light: {
          ...light,
          // Green 'success' button bg color:
          success: green[500],
          // Default 'btn' button bg color:
          neutral: gray[300],
          "neutral-content": colors.black,
        },
        dark: {
          ...dark,
          // Green 'success' button bg color:
          success: green[500],
          // Default 'btn' button bg color:
          neutral: gray[800],
          // Button hover bg color:
          "neutral-focus": gray[700],
          // Button text color:
          "neutral-content": colors.white,
          // Text color:
          "base-content": gray[100],
          // Background color:
          "base-100": gray[900],
        },
      },
    ],
  },
};
