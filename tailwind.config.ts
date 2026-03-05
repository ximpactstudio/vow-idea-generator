import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vow: {
          gold: "#C9A227",
          "gold-light": "#E8D48B",
          "gold-dark": "#9A7B1A",
          navy: "#1B365D",
          "navy-light": "#2C4A7C",
          cream: "#F8F6F0",
          charcoal: "#2D2D2D",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
