import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F6F7F4",
        surface: "#FFFFFF",
        surfaceMuted: "#EFF2EE",
        ink: {
          DEFAULT: "#1E2B29",
          muted: "#5B6B67",
          faint: "#8A9793",
        },
        line: "#E1E6E0",
        primary: {
          DEFAULT: "#2C6E68",
          dark: "#1F4F4B",
          light: "#E4EFED",
        },
        status: {
          low: "#4A6FA5",
          lowBg: "#E9EFF7",
          ideal: "#3F8361",
          idealBg: "#E7F2EB",
          high: "#C1783F",
          highBg: "#F6ECE1",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "10px",
        control: "8px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(30, 43, 41, 0.06)",
        elevated: "0 8px 24px rgba(30, 43, 41, 0.12)",
      },
      maxWidth: {
        app: "1080px",
      },
    },
  },
  plugins: [],
};

export default config;
