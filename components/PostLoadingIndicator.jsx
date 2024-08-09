import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const PostLoadingIndicator = ({ isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#69C3FF" style={styles.indicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start', // Aligns the indicator to the top
    alignItems: 'center', // Centers the indicator horizontally
    backgroundColor: '#F5F5F5', // Light gray background
    zIndex: 10, // High zIndex to ensure it overlays the content
    paddingTop: 50, // Adds padding to ensure the indicator is not too close to the top edge
  },
  indicator: {
    marginTop: 20, // Additional margin if needed
  },
});

export default PostLoadingIndicator;
