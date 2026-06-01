/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        // Eye-soothing engineering palette — deep slate-teal, not harsh black.
        ink: {
          950: "#0a0f1a",
          900: "#0e1626",
          850: "#121d31",
          800: "#16233b",
        },
        paper: {
          50: "#f6f8fb",
          100: "#eef2f7",
          200: "#e3e9f2",
        },
        brand: {
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
        },
        accent: {
          400: "#2dd4bf",
          500: "#14b8a6",
        },
      },
      boxShadow: {
        glow: "0 0 40px -12px rgba(14, 165, 233, 0.45)",
        "glow-lg": "0 0 90px -24px rgba(45, 212, 191, 0.45)",
        soft: "0 1px 2px rgba(16,24,40,0.04), 0 4px 16px -4px rgba(16,24,40,0.08)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
