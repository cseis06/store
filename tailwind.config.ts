import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        oswald: ["var(--font-oswald)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          black: "#000000",
          white: "#ffffff",
        },
      },
      maxWidth: {
        container: "1440px",
      },
    },
  },
  plugins: [],
} satisfies Config;