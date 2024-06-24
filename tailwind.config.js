// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         primary: "#161622",
//         secondary: {
//           DEFAULT: "#FF9C01",
//           100: "#FF9001",
//           200: "#FF8E01",
//         },
//         black: {
//           DEFAULT: "#000",
//           100: "#1E1E2D",
//           200: "#232533",
//         },
//         gray: {
//           100: "#CDCDE0",
//         },
//       },
//       fontFamily: {
//         pthin: ["Poppins-Thin", "sans-serif"],
//         pextralight: ["Poppins-ExtraLight", "sans-serif"],
//         plight: ["Poppins-Light", "sans-serif"],
//         pregular: ["Poppins-Regular", "sans-serif"],
//         pmedium: ["Poppins-Medium", "sans-serif"],
//         psemibold: ["Poppins-SemiBold", "sans-serif"],
//         pbold: ["Poppins-Bold", "sans-serif"],
//         pextrabold: ["Poppins-ExtraBold", "sans-serif"],
//         pblack: ["Poppins-Black", "sans-serif"],
//       },
//     },
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5E60CE", // A deep, electric blue
        secondary: {
          DEFAULT: "#64DFDF", // A bright, cyan teal
          100: "#80FFDB", // A lighter, pastel teal
          200: "#A0F8EA", // An even lighter, pastel teal
        },
        black: {
          DEFAULT: "#0F044C", // A very dark blue, almost black
          100: "#1B1B2F", // A dark blue-gray
          200: "#252945", // A medium blue-gray
        },
        gray: {
          100: "#D0D0D0", // A light gray for subtle contrast
        },
        accent: {
          DEFAULT: "#7400B8", // A vibrant purple for accents
          100: "#6930C3", // A slightly lighter purple
          200: "#5E60CE", // A soft electric blue-purple
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};

