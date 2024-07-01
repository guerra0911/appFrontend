import React from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Picks = () => {
  const scaleValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Picks</Text>
      <Animated.View style={[styles.animatedContainer, { transform: [{ scale: scaleValue }] }]}>
        <Text style={styles.comingSoonText}>Coming Soon</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Replace with your primary color
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#69C3FF',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 20,
  },
  animatedContainer: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#69C3FF',
  },
  comingSoonText: {
    fontSize: 28,
    color: '#69C3FF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Picks;
