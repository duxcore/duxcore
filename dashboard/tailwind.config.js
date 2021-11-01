/* eslint-disable global-require */
module.exports = {
  darkMode: "class",
  purge: {
    content: ["./src/**/*.tsx", "./public/index.html"],
  },
  theme: {
    extend: {
      fontSize: {
        tiny: "0.625rem",
        "6xl": "4rem",
        "7xl": "5rem",
      },

      colors: {
        primary: {
          50: "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
        },
        secondary: {},
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          disabled: "var(--color-accent-disabled)",
        },
        error: {
          DEFAULT: "var(--color-error)",
        },
        success: {
          DEFAULT: "var(--color-success)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      spacing: {
        100: "100px",
        110: "110px",
        200: "200px",
      },
      borderRadius: {
        5: "5px",
        8: "8px",
      },
    },
  },
  variants: {
    extend: {},
  },
};
