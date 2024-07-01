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
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#DCDCDC', // Adding the thin border with color #DCDCDC
    borderRadius: 5, // Adding border radius for a smooth edge
  },
  banner: {
    width: '100%',
    height: 150,
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
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
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default TournamentCard;
