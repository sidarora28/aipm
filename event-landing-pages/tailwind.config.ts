import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Matches the reference page: deep navy background, white card, blue + orange accents.
        navy: {
          DEFAULT: "#0d1b3e",
          deep: "#0a1530",
        },
        brandblue: "#2563eb",
        brandorange: "#f15a24",
      },
      maxWidth: {
        card: "640px",
      },
    },
  },
  plugins: [],
};

export default config;
