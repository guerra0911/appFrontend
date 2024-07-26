import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GradientBar = ({ height, defaultHeight }) => {
  // Calculate the opacity
  const threshold = defaultHeight + 100;
  const opacity = Math.max(0, Math.min(1, (threshold - height) / 100));

  return (
    <>
      {height && height < threshold && (
        <LinearGradient
          colors={[`rgba(245, 245, 245, 0)`, `rgba(245, 245, 245, ${opacity})`]}
          style={styles.footer}
        >
        </LinearGradient>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50, // Adjust as needed
  },
});

export default GradientBar;
