import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PrivateProfileIndicator = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Private Profile</Text>
      <Text style={styles.message}>This user's profile is private.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    marginVertical: 20,
  },
  title: {
    color: '#721c24',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    color: '#721c24',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PrivateProfileIndicator;
