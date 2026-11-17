import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF3E6",
        surface: "#FFFCF6",
        "surface-raised": "#F3E8D6",
        border: "#E8DBC4",
        foreground: "#22261E",
        muted: "#6E665A",
        accent: "#C4501E",
        "accent-2": "#6B7A2E",
        "accent-3": "#E3A23B",
        success: "#5E7F3A",
        danger: "#B42318",
        sand: "#EFE0C6",
        "brand-green": "#1E3A2A",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        script: ["var(--font-script)", "cursive"],
      },
      boxShadow: {
        glow: "0 8px 24px rgba(196, 80, 30, 0.22)",
        card: "0 2px 12px rgba(60, 40, 20, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
