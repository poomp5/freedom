import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /(bg|text)-(pink|blue|green|red|purple)-(100|600)/,
    },
    {
      pattern: /(from|to)-(emerald|teal|sky|blue|fuchsia|purple|rose|red|amber|orange|indigo|violet|cyan|lime|green)-(400|500)/,
    },
    {
      pattern: /(bg|text)-(emerald|blue|purple|rose|amber|indigo|cyan|lime)-(50|700)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
