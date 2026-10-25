import tailwindcssAnimate from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Satoshi Variable", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // ── Semantiskt chrome (CSS-variabler, tema-reaktivt) ──────────────────
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
          // Återhållen blå accent (länkar, AI-markörer, info-pills)
          subtle: "hsl(var(--accent-subtle))",
          strong: "hsl(var(--accent-strong))",
          border: "hsl(var(--accent-border))",
          surface: "hsl(var(--accent-surface))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        // ── Domän: konfidens (mjuka tinter) ───────────────────────────────────
        conf: {
          high: {
            bg: "hsl(var(--conf-high-bg))",
            fg: "hsl(var(--conf-high-fg))",
            border: "hsl(var(--conf-high-border))",
            solid: "hsl(var(--conf-high-solid))",
            surface: "hsl(var(--conf-high-surface))",
          },
          medium: {
            bg: "hsl(var(--conf-medium-bg))",
            fg: "hsl(var(--conf-medium-fg))",
            border: "hsl(var(--conf-medium-border))",
            solid: "hsl(var(--conf-medium-solid))",
            surface: "hsl(var(--conf-medium-surface))",
          },
          low: {
            bg: "hsl(var(--conf-low-bg))",
            fg: "hsl(var(--conf-low-fg))",
            border: "hsl(var(--conf-low-border))",
            solid: "hsl(var(--conf-low-solid))",
            surface: "hsl(var(--conf-low-surface))",
          },
        },

        // ── Domän: datakvalitet ───────────────────────────────────────────────
        dq: {
          ok: {
            bg: "hsl(var(--dq-ok-bg))",
            fg: "hsl(var(--dq-ok-fg))",
            border: "hsl(var(--dq-ok-border))",
            solid: "hsl(var(--dq-ok-solid))",
          },
          stale: {
            bg: "hsl(var(--dq-stale-bg))",
            fg: "hsl(var(--dq-stale-fg))",
            border: "hsl(var(--dq-stale-border))",
            solid: "hsl(var(--dq-stale-solid))",
          },
          missing: {
            bg: "hsl(var(--dq-missing-bg))",
            fg: "hsl(var(--dq-missing-fg))",
            border: "hsl(var(--dq-missing-border))",
            solid: "hsl(var(--dq-missing-solid))",
          },
          conflict: {
            bg: "hsl(var(--dq-conflict-bg))",
            fg: "hsl(var(--dq-conflict-fg))",
            border: "hsl(var(--dq-conflict-border))",
            solid: "hsl(var(--dq-conflict-solid))",
          },
        },

        // ── Legacy Figma-paletter (kvar tills steg 2 är klart) ────────────────
        green: {
          50:  "#EDF8EC", 100: "#CEEDCA", 200: "#AEE1A8", 300: "#8FD585",
          400: "#6FC963", 500: "#50BE41", 600: "#419E34", 700: "#38852D",
          800: "#255717", 900: "#163611",
        },
        orange: {
          25:  "#FFF7EE", 50:  "#FEF3E6", 100: "#FDDEB9", 200: "#FBBD60",
          300: "#FA9D33", 400: "#FA9D33", 500: "#F98806", 600: "#D97706",
          700: "#9F5704", 800: "#723D03", 900: "#462602",
        },
        red: {
          50:  "#FBE9E9", 100: "#F5C2C2", 200: "#EF9B9B", 300: "#E97474",
          400: "#E24B4B", 500: "#DC2626", 600: "#B41D1D", 700: "#8C1717",
          800: "#650F0F", 900: "#3D0A0A",
        },
        blue: {
          25:  "#F7F9FF", 50:  "#E9EFFB", 100: "#C2D2F5", 200: "#9AB5EE",
          300: "#7398E8", 400: "#4C7BE1", 500: "#245BD1", 600: "#1E4DB3",
          700: "#183C8C", 800: "#112B64", 900: "#0A1A3C",
        },
        purple: {
          50:  "#F0EAFB", 100: "#D6C2F4", 200: "#BC9AED", 300: "#A172E6",
          400: "#874ADF", 500: "#7233D6", 600: "#5B27AE", 700: "#451B88",
          800: "#2E1261", 900: "#180939",
        },
        grey: {
          25:  "#F9F9F9", 50:  "#F2F2F2", 100: "#DBDBDB", 200: "#C4C4C4",
          300: "#ADADAD", 400: "#969696", 500: "#808080", 600: "#696969",
          700: "#525252", 800: "#3B3B3B", 900: "#242424",
        },
        yellow: {
          50:  "#FEFDE6", 100: "#FEF8B9", 200: "#FDF48C", 300: "#FCED5F",
          400: "#FBEA32", 500: "#FAE705", 600: "#CEBE04", 700: "#A09603",
          800: "#736A02", 900: "#454001",
        },
      },
      borderRadius: {
        // Figma Radius-tokens (oförändrade – shadcn-komponenter använder dessa)
        xsm:    "2px",
        sm:     "4px",
        "md-sm":"6px",
        md:     "8px",
        lg:     "12px",
        xlg:    "16px",
        "2xlg": "20px",
      },
      fontSize: {
        xsm:  ["12px", { lineHeight: "16px" }],
        sm:   ["14px", { lineHeight: "20px" }],
        md:   ["16px", { lineHeight: "24px" }],
        lg:   ["20px", { lineHeight: "28px" }],
        xlg:  ["24px", { lineHeight: "32px" }],
        "2xlg": ["32px", { lineHeight: "40px" }],
        "3xlg": ["40px", { lineHeight: "48px" }],
        "4xlg": ["48px", { lineHeight: "56px" }],
      },
      spacing: {
        "0.5": "2px",
        1:  "4px", 2:  "8px", 3:  "12px", 4:  "16px", 5:  "20px",
        6:  "24px", 8:  "32px", 10: "36px", 12: "48px", 16: "64px", 18: "80px",
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
