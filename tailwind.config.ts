import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9dffe",
          300: "#7cc4fd",
          400: "#36a4fa",
          500: "#0c87eb",
          600: "#026ac8",
          700: "#0354a2",
          800: "#074785",
          900: "#0c3c6e",
          950: "#092648", // Primary Deep Navy
        },
        accent: {
          50: "#fff8eb",
          100: "#feefc7",
          200: "#fedb89",
          300: "#fcc144",
          400: "#f9a413",
          500: "#ea8507",
          600: "#cc6603",
          700: "#a24706",
          800: "#83380c",
          900: "#6d300e",
          950: "#3e1704", // Accent Amber/Orange
        },
        emerald: {
          600: "#059669",
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
