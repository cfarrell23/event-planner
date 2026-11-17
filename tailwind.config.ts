import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0a10",
        surface: "#14121d",
        "surface-raised": "#1d1a29",
        border: "#2b2838",
        foreground: "#f4f2f9",
        muted: "#9893a8",
        accent: "#ff3fa4",
        "accent-2": "#7c5cff",
        "accent-3": "#2ee6d6",
        success: "#34d399",
        danger: "#f87171",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(255, 63, 164, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
