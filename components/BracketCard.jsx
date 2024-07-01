import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";

const placeholderLogo =
  "https://nickguerrabucket.s3.us-east-2.amazonaws.com/admin/placeholder.png";
const placeholderProfilePic =
  "https://nickguerrabucket.s3.us-east-2.amazonaws.com/profile_pics/default.jpg";

const BracketCard = ({ bracket }) => {
  const renderMatchup = (round, index, team1, team2, customStyle = "") => {
    const teamLogoStyle =
      bracket.team_size === 16 ? styles.teamLogo16 : styles.teamLogo8;
    return (
      <View
        style={[styles.matchupContainer, customStyle]}
        key={`${round}-${index}`}
      >
        <View style={styles.teamContainer}>
          <Image
            source={{ uri: team1 ? team1.logo : placeholderLogo }}
            style={teamLogoStyle}
          />
        </View>
        <View style={styles.teamContainer}>
          <Image
            source={{ uri: team2 ? team2.logo : placeholderLogo }}
            style={teamLogoStyle}
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
    const teamLogoStyle =
      bracket.team_size === 16 ? styles.teamLogo16 : styles.teamLogo8;
    const winnerLogoStyle =
      bracket.team_size === 16 ? styles.winnerLogo16 : styles.winnerLogo8;

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
            style={winnerLogoStyle}
          />
        </View>
        <View style={styles.finalMatchupContainer}>
          <View style={styles.teamContainer}>
            <Image
              source={{ uri: team1 ? team1.logo : placeholderLogo }}
              style={teamLogoStyle}
            />
          </View>
          <View style={styles.teamContainer}>
            <Image
              source={{ uri: team2 ? team2.logo : placeholderLogo }}
              style={teamLogoStyle}
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
              source={{
                uri:
                  bracket.author && bracket.author.profile
                    ? bracket.author.profile.image
                    : placeholderProfilePic,
              }}
              style={styles.profileImage}
            />
            <Text style={styles.usernameText}>
              {bracket.author ? bracket.author.username : "Unknown User"}
            </Text>
            <Text style={styles.scoreText}>Score: {bracket.score || 0}</Text>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {bracket.team_size === 16 && (
            <>
              <View style={[styles.matchupWrapper, styles.pt12_16]}>
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
                <View
                  style={[
                    styles.matchupWrapper,
                    styles.pt24_16,
                    styles.quarterFinalsContainerLeft,
                  ]}
                >
                  {renderMatchup(
                    "LQF",
                    0,
                    bracket.left_side_quarter_finals[0],
                    bracket.left_side_quarter_finals[1],
                    styles.my12_16
                  )}
                  {renderMatchup(
                    "LQF",
                    1,
                    bracket.left_side_quarter_finals[2],
                    bracket.left_side_quarter_finals[3],
                    styles.my12_16
                  )}
                </View>
                <View
            style={[
              styles.matchupWrapper,
              styles.pt40_16,
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
          <View style={[styles.matchupWrapper, styles.pt32_16]}>
            {renderFinalMatchup()}
          </View>
          <View
            style={[
              styles.matchupWrapper,
              styles.pt40_16,
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
          <View
            style={[
              styles.matchupWrapper,
              styles.pt24_16,
              styles.quarterFinalsContainerRight,
            ]}
          >
            {renderMatchup(
              "RQF",
              0,
              bracket.right_side_quarter_finals[0],
              bracket.right_side_quarter_finals[1],
              styles.my12_16
            )}
            {renderMatchup(
              "RQF",
              1,
              bracket.right_side_quarter_finals[2],
              bracket.right_side_quarter_finals[3],
              styles.my12_16
            )}
          </View>
            <View style={[styles.matchupWrapper, styles.pt12_16]}>
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
            </>
          )}
          {bracket.team_size === 8 && (
            <>
          <View
            style={[
              styles.matchupWrapper,
              styles.pt24_8,
              styles.quarterFinalsContainerLeft,
            ]}
          >
            {renderMatchup(
              "LQF",
              0,
              bracket.left_side_quarter_finals[0],
              bracket.left_side_quarter_finals[1],
              styles.my12_8
            )}
            {renderMatchup(
              "LQF",
              1,
              bracket.left_side_quarter_finals[2],
              bracket.left_side_quarter_finals[3],
              styles.my12_8
            )}
          </View>
          
          <View
            style={[
              styles.matchupWrapper,
              styles.pt40_8,
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
          <View style={[styles.matchupWrapper, styles.pt32_8]}>
            {renderFinalMatchup()}
          </View>
          <View
            style={[
              styles.matchupWrapper,
              styles.pt40_8,
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
          <View
            style={[
              styles.matchupWrapper,
              styles.pt24_8,
              styles.quarterFinalsContainerRight,
            ]}
          >
            {renderMatchup(
              "RQF",
              0,
              bracket.right_side_quarter_finals[0],
              bracket.right_side_quarter_finals[1],
              styles.my12_8
            )}
            {renderMatchup(
              "RQF",
              1,
              bracket.right_side_quarter_finals[2],
              bracket.right_side_quarter_finals[3],
              styles.my12_8
            )}
          </View>
          </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bgPrimary: {
    backgroundColor: "#F5F5F5", //Edges
    height: "97.5%",
    borderRadius: 10,
  },
  cardContainer: {
    // borderColor: "yellow",
    // borderWidth: 1,
    backgroundColor: "#F5F5F5",
    padding: 0,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  headerContainer: {
    borderColor: "#F5F5F5",
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomColor: "#DCDCDC",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#69C3FF',
  },
  usernameText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  scoreText: {
    color: "black",
    fontSize: 18,
    marginLeft: "auto",
  },
  scrollViewContent: {
    flexDirection: "row",
  },
  matchupWrapper: {
    // borderColor: "orange",
    // borderWidth: 0.5,
    flex: 1,
    alignItems: "center",
    width: 96,
    padding: 0,
  },
  matchupContainer: {
    // borderColor: "brown",
    // borderWidth: 1,
    marginVertical: 8,
  },
  teamContainer: {
    // borderColor: "red",
    // borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    marginLeft: 0,
    marginRight: 0,
  },
  teamLogo16: {
    width: 28,
    height: 28,
    marginRight: 0,
  },
  teamLogo8: {
    width: 42,
    height: 42,
    marginRight: 0,
  },
  pt12_16: {
    paddingTop: 0, //R16
  },
  pt24_16: {
    paddingTop: 0, //QF
  },
  pt40_16: {
    paddingTop: 133, //SF
  },
  pt32_16: {
    paddingTop: 99, //F
  },
  pt24_8: {
    paddingTop: 0, //QF
  },
  pt40_8: {
    paddingTop: 115, //SF
  },
  pt32_8: {
    paddingTop: 75, //F
  },
  my2: {
    marginVertical: 10, //SPaces between R16 L16
  },
  my12_16: {
    marginVertical: 55, //Spaces between QF
  },
  my12_8: {
    marginVertical: 40, //Spaces between QF
  },
  my4: {
    marginVertical: 16,
    marginHorizontal: 2,
  },
  centerItems: {
    alignItems: "center",
  },
  championText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
    position: "absolute",
    top: -40,
    fontFamily: "Poppins-SemiBold",
  },
  mb4: {
    marginBottom: 16,
  },
  winnerLogo16: {
    width: 50,
    height: 50,
  },
  winnerLogo8: {
    width: 64,
    height: 64,
  },
  finalMatchupContainer: {
    // borderColour: "black",
    // borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 0,
    marginRight: 0,
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
