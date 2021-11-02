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
    fontSize: {
      sm: "13px",
      base: "15px",
      md: "17px",
      lg: "20px",
      xl: "25px",
      "2xl": "30px",
      "3xl": "35px",
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
      accent: {
        DEFAULT: "var(--color-accent)",
        light: "var(--color-accent-light)",
        lighter: "var(--color-accent-lighter)",
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
      0: "0px",
      0.1: "1px",
      0.5: "5px",
      1: "10px",
      1.5: "15px",
      2: "20px",
      2.5: "25px",
      3: "30px",
      4: "40px",
      5: "50px",
      6: "60px",
      7: "70px",
      8: "80px",
      9: "90px",
      10: "100px",
      15: "150px",
      20: "200px",
      25: "250px",
      30: "300px",
      35: "350px",
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
