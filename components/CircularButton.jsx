// CircularButton.jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const CircularButton = () => {
  return (
    <View style={styles.button}>
      <AntDesign name="pluscircle" size={24} color="white" />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#69C3FF', // secondary color from tailwind.config.js
    marginBottom:5,
  },
});

export default CircularButton;
