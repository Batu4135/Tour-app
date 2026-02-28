import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2F7EA1",
        dark: "#4A4A4A",
        light: "#E5E5E5",
        bg: "#F8F9FA"
      },
      boxShadow: {
        nav: "0 -4px 20px rgba(74, 74, 74, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
