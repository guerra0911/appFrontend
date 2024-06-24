// /**
//  * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
//  * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
//  */

// const tintColorLight = '#0a7ea4';
// const tintColorDark = '#fff';

// export const Colors = {
//   light: {
//     text: '#11181C',
//     background: '#fff',
//     tint: tintColorLight,
//     icon: '#687076',
//     tabIconDefault: '#687076',
//     tabIconSelected: tintColorLight,
//   },
//   dark: {
//     text: '#ECEDEE',
//     background: '#151718',
//     tint: tintColorDark,
//     icon: '#9BA1A6',
//     tabIconDefault: '#9BA1A6',
//     tabIconSelected: tintColorDark,
//   },
// };

/**
 * Below are the updated colors for the app, designed to be modern and appealing.
 * The colors are defined for both light and dark modes.
 */

const tintColorLight = '#FF6B6B'; // A vibrant, modern red
const tintColorDark = '#FCD34D'; // A warm, inviting yellow

export const Colors = {
  light: {
    text: '#2E2E2E', // A deep, rich black for readability
    background: '#FFFFFF', // Crisp, clean white
    tint: tintColorLight, // For interactive elements
    icon: '#FF6B6B', // Icons that stand out
    tabIconDefault: '#BDBDBD', // Unselected icons in a neutral tone
    tabIconSelected: tintColorLight, // Highlighted icons in vibrant red
  },
  dark: {
    text: '#ECEDEE', // Soft white for dark mode readability
    background: '#121212', // True black for deep contrast
    tint: tintColorDark, // Warm yellow for interactive elements
    icon: '#FCD34D', // Icons that glow against the dark
    tabIconDefault: '#3A3A3A', // Unselected icons in a dark grey
    tabIconSelected: tintColorDark, // Highlighted icons in warm yellow
  },
};

