import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";

const placeholderLogo = "https://via.placeholder.com/50?text=+";
const placeholderProfilePic = "https://via.placeholder.com/50?text=Profile";

const BracketCard = ({ bracket }) => {
  console.log('Bracket Data:', bracket); // Add this line to log the bracket data

  const renderMatchup = (round, index, team1, team2, customStyle = "") => {
    return (
      <View
        style={[styles.matchupContainer, customStyle]}
        key={`${round}-${index}`}
      >
        <View style={styles.teamContainer}>
          <Image
            source={{ uri: team1 ? team1.logo : placeholderLogo }}
            style={styles.teamLogo}
          />
        </View>
        <View style={styles.teamContainer}>
          <Image
            source={{ uri: team2 ? team2.logo : placeholderLogo }}
            style={styles.teamLogo}
          />
        </View>
      </View>
    );
  };

  const renderFinalMatchup = () => {
    const team1 = bracket.finals[0] || null;
    const team2 = bracket.finals[1] || null;
    const winner = bracket.winner || null;
    const textWidth = 50 + 50;

    return (
      <View style={styles.centerItems}>
        {winner && (
          <Text style={[styles.championText, { width: textWidth }]}>
            CHAMPION
          </Text>
        )}
        <View style={styles.mb4}>
          <Image
            source={{ uri: winner ? winner.logo : placeholderLogo }}
            style={styles.winnerLogo}
          />
        </View>
        <View style={styles.finalMatchupContainer}>
          <View style={styles.teamContainer}>
            <Image
              source={{ uri: team1 ? team1.logo : placeholderLogo }}
              style={styles.teamLogo}
            />
          </View>
          <View style={styles.teamContainer}>
            <Image
              source={{ uri: team2 ? team2.logo : placeholderLogo }}
              style={styles.teamLogo}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.bgPrimary}>
      <View style={styles.cardContainer}>
        {!bracket.is_actual && (
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: bracket.author && bracket.author.profile ? bracket.author.profile.image : placeholderProfilePic }}
              style={styles.profileImage}
            />
            <Text style={styles.usernameText}>{bracket.author ? bracket.author.username : "Unknown User"}</Text>
            <Text style={styles.scoreText}>Score: {bracket.score || 0}</Text>
          </View>
        )}
        
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {bracket.team_size === 16 && (
            <View style={[styles.matchupWrapper, styles.pt12]}>
              {renderMatchup(
                "L16",
                0,
                bracket.left_side_round_of_16_teams[0],
                bracket.left_side_round_of_16_teams[1],
                styles.my2
              )}
              {renderMatchup(
                "L16",
                1,
                bracket.left_side_round_of_16_teams[2],
                bracket.left_side_round_of_16_teams[3],
                styles.my2
              )}
              {renderMatchup(
                "L16",
                2,
                bracket.left_side_round_of_16_teams[4],
                bracket.left_side_round_of_16_teams[5],
                styles.my2
              )}
              {renderMatchup(
                "L16",
                3,
                bracket.left_side_round_of_16_teams[6],
                bracket.left_side_round_of_16_teams[7],
                styles.my2
              )}
            </View>
          )}
          <View style={[styles.matchupWrapper, styles.pt12, styles.quarterFinalsContainerLeft]}>
            {renderMatchup(
              "LQF",
              0,
              bracket.left_side_quarter_finals[0],
              bracket.left_side_quarter_finals[1],
              styles.my12
            )}
            {renderMatchup(
              "LQF",
              1,
              bracket.left_side_quarter_finals[2],
              bracket.left_side_quarter_finals[3],
              styles.my12
            )}
          </View>
          <View
            style={[
              styles.matchupWrapper,
              styles.pt40,
              styles.semiFinalsContainerLeft,
            ]}
          >
            {renderMatchup(
              "LSF",
              0,
              bracket.left_side_semi_finals[0],
              bracket.left_side_semi_finals[1],
              styles.my4
            )}
          </View>
          <View style={[styles.matchupWrapper, styles.pt32]}>
            {renderFinalMatchup()}
          </View>
          <View
            style={[
              styles.matchupWrapper,
              styles.pt40,
              styles.semiFinalsContainerRight,
            ]}
          >
            {renderMatchup(
              "RSF",
              0,
              bracket.right_side_semi_finals[0],
              bracket.right_side_semi_finals[1],
              styles.my4
            )}
          </View>
          <View style={[styles.matchupWrapper, styles.pt12, styles.quarterFinalsContainerRight]}>
            {renderMatchup(
              "RQF",
              0,
              bracket.right_side_quarter_finals[0],
              bracket.right_side_quarter_finals[1],
              styles.my12
            )}
            {renderMatchup(
              "RQF",
              1,
              bracket.right_side_quarter_finals[2],
              bracket.right_side_quarter_finals[3],
              styles.my12
            )}
          </View>
          {bracket.team_size === 16 && (
            <View style={[styles.matchupWrapper, styles.pt12]}>
              {renderMatchup(
                "R16",
                0,
                bracket.right_side_round_of_16_teams[0],
                bracket.right_side_round_of_16_teams[1],
                styles.my2
              )}
              {renderMatchup(
                "R16",
                1,
                bracket.right_side_round_of_16_teams[2],
                bracket.right_side_round_of_16_teams[3],
                styles.my2
              )}
              {renderMatchup(
                "R16",
                2,
                bracket.right_side_round_of_16_teams[4],
                bracket.right_side_round_of_16_teams[5],
                styles.my2
              )}
              {renderMatchup(
                "R16",
                3,
                bracket.right_side_round_of_16_teams[6],
                bracket.right_side_round_of_16_teams[7],
                styles.my2
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bgPrimary: {
    backgroundColor: "#3498db",
    height: "100%",
  },
  cardContainer: {
    backgroundColor: "#1c1c1c",
    padding: 0,
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#2c2c2c",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  usernameText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  scoreText: {
    color: "white",
    fontSize: 18,
    marginLeft: "auto",
  },
  scrollViewContent: {
    flexDirection: "row",
  },
  matchupWrapper: {
    flex: 1,
    alignItems: "center",
    width: 96,
    padding: 0,
  },
  matchupContainer: {
    marginVertical: 8,
  },
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  teamLogo: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  pt12: {
    paddingTop: 20,
  },
  pt40: {
    paddingTop: 130,
  },
  pt32: {
    paddingTop: 100,
  },
  my2: {
    marginVertical: 8,
  },
  my12: {
    marginVertical: 52,
  },
  my4: {
    marginVertical: 16,
    marginHorizontal: 2,
  },
  centerItems: {
    alignItems: "center",
  },
  championText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    position: "absolute",
    top: -40,
    fontFamily: "Poppins-SemiBold",
  },
  mb4: {
    marginBottom: 16,
  },
  winnerLogo: {
    width: 50,
    height: 50,
  },
  finalMatchupContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 25,
    marginRight: 20,
  },
  quarterFinalsContainerLeft: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  quarterFinalsContainerRight: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  semiFinalsContainerLeft: {
    paddingLeft: 0,
    paddingRight: 24,
  },
  semiFinalsContainerRight: {
    paddingLeft: 24,
    paddingRight: 0,
  },
});

export default BracketCard;
