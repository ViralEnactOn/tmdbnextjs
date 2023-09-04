/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"arial", sans-serif'],
      },
      colors: {
        blue: {
          300: "#01b4e4",
          500: "#032541",
          200: "#7AD7F0",
        },
      },
      height: {
        90: "350px",
      },
      screens: {
        s: "0px",
        xs: "200px",
        lg: "1024px",
        xl: "1240px",
      },
      container: {
        screens: {
          default: "80rem",
        },
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [],
};
