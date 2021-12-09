/* eslint-disable global-require */
module.exports = {
  darkMode: false,
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      minWidth: {
        40: "400px",
      },
      borderRadius: {
        5: "5px",
        8: "8px",
      },
    },
    colors: {
      black: "#000",
      white: "#FFF",
      transparent: "transparent",
      gray: {
        50: "var(--color-gray-50)",
        100: "var(--color-gray-100)",
        200: "var(--color-gray-200)",
        300: "var(--color-gray-300)",
        400: "var(--color-gray-400)",
        500: "var(--color-gray-500)",
        600: "var(--color-gray-600)",
        700: "var(--color-gray-700)",
        800: "var(--color-gray-800)",
        900: "var(--color-gray-900)",
      },
      accent: "#E6343F",
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
      0: "0rem",
      0.1: "0.063rem",
      0.25: "0.22rem",
      0.5: "0.313rem",
      1: "0.625rem",
      1.5: "0.938rem",
      2: "1.25rem",
      2.5: "1.563rem",
      3: "1.875rem",
      4: "2.5rem",
      5: "3.125rem",
      6: "3.75rem",
      7: "4.375rem",
      8: "5rem",
      9: "5.625rem",
      10: "6.25rem",
      15: "9.375rem",
      20: "12.5rem",
      25: "15.625rem",
      30: "18.75rem",
      35: "21.875rem",
    },
    borderWidth: {
      DEFAULT: "1px",
      0: "0px",
    },
  },
  variants: {
    extend: {},
  },
};
