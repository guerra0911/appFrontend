// TournamentCard.jsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TournamentCard = ({ tournament }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('tournamentDetails', { tournament });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={{ uri: tournament.banner }} style={styles.banner} />
      <View style={styles.content}>
        <Image source={{ uri: tournament.logo }} style={styles.logo} />
        <Text style={styles.name}>{tournament.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  banner: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TournamentCard;
