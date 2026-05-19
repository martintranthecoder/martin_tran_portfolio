import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'selector',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        sans: "var(--font-sans)",
        serif: "var(--font-serif)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "jellyfish-glow": {
          "0%, 100%": {
            textShadow: "0 0 4px rgba(96, 165, 250, 0.4), 0 0 8px rgba(96, 165, 250, 0.3), 0 0 12px rgba(96, 165, 250, 0.2)",
          },
          "50%": {
            textShadow: "0 0 8px rgba(96, 165, 250, 0.8), 0 0 16px rgba(96, 165, 250, 0.6), 0 0 24px rgba(96, 165, 250, 0.4), 0 0 32px rgba(147, 197, 253, 0.3)",
          },
        },
        "float-away": {
          "0%": {
            transform: "translateX(-50%) translateY(0) scale(1) rotate(0deg)",
            opacity: "1",
            filter: "drop-shadow(0 0 6px rgba(96, 165, 250, 0.55))",
          },
          "20%": {
            transform:
              "translateX(-38%) translateY(-26px) scale(1.12) rotate(-9deg)",
            opacity: "1",
            filter: "drop-shadow(0 0 10px rgba(96, 165, 250, 0.6))",
          },
          "45%": {
            transform:
              "translateX(-66%) translateY(-58px) scale(1.26) rotate(7deg)",
            opacity: "1",
            filter: "drop-shadow(0 0 12px rgba(147, 197, 253, 0.55))",
          },
          "70%": {
            transform:
              "translateX(-42%) translateY(-94px) scale(1.4) rotate(-4deg)",
            opacity: "0.8",
            filter: "drop-shadow(0 0 14px rgba(147, 197, 253, 0.4))",
          },
          "100%": {
            transform:
              "translateX(-58%) translateY(-140px) scale(1.55) rotate(2deg)",
            opacity: "0",
            filter: "drop-shadow(0 0 16px rgba(147, 197, 253, 0))",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "jellyfish-glow": "jellyfish-glow 10s ease-in-out infinite",
        "float-away": "float-away 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;
