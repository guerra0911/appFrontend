import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const TournamentLeaderboard = ({ top3Brackets, pointSystem, setPointSystemModalVisible }) => {
  return (
    <View style={styles.leaderboardContainer}>
      <View style={styles.leaderboardHeader}>
        <Text style={styles.leaderboardTitle}>Leaderboard</Text>
        <TouchableOpacity onPress={() => setPointSystemModalVisible(true)}>
          <Text style={styles.pointSystemLink}>Point System</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      {top3Brackets.map((bracket, index) => (
        <View key={bracket.id}>
          <View style={styles.leaderboardItem}>
            <View style={styles.profileContainer}>
              <Image source={{ uri: bracket.author.profile.image }} style={styles.profileImage} />
              <Text style={styles.profileName}>{bracket.author.username}</Text>
            </View>
            <Text style={styles.profileScore}>{bracket.score}</Text>
          </View>
          {index < top3Brackets.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  leaderboardContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leaderboardTitle: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  pointSystemLink: {
    color: "#69C3FF",
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  separator: {
    height: 1,
    backgroundColor: "#DCDCDC",
    marginVertical: 8,
  },
  leaderboardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#69C3FF',
  },
  profileName: {
    color: "black",
    fontSize: 16,
  },
  profileScore: {
    color: "black",
    fontSize: 16,
  },
});

export default TournamentLeaderboard;
