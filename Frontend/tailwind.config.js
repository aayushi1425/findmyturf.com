export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: "#EAEFEF",
        muted: "#BFC9D1",
        dark: "#25343F",
        accent: "#FF9B51",
        // Brand palette for FindMyTurf – soft sport green primary
        brand: {
          50: "#ECFDF3",
          100: "#D1FADF",
          200: "#A6F4C5",
          500: "#22C55E", // primary
          600: "#16A34A",
          700: "#15803D",
        },
      },
    },
  },
  plugins: [],
}
