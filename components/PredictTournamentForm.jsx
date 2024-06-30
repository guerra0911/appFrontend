import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import api from "../api";
import CustomButton from "./CustomButton";

const placeholderLogo = "https://nickguerrabucket.s3.us-east-2.amazonaws.com/admin/placeholder.png";

const PredictTournamentForm = ({ tournament }) => {
  const [teams, setTeams] = useState({ left: [], right: [] });
  const [uploading, setUploading] = useState(false);
  const [winners, setWinners] = useState({
    L16: [null, null, null, null],
    LQF: [null, null],
    LSF: [null],
    RSF: [null],
    RQF: [null, null],
    R16: [null, null, null, null],
    F: [null],
  });

  useEffect(() => {
    if (tournament && tournament.id) {
      api
        .get(`/api/tournaments/${tournament.id}/`)
        .then((response) => {
          let fetchedTeams = response.data.teams;

          // Split the fetched data into two halves
          const halfLength = Math.ceil(fetchedTeams.length / 2);
          let uniqueTeams = fetchedTeams.slice(0, halfLength);
          const uniquehalfLength = Math.floor(uniqueTeams.length / 2);

          const leftTeams = uniqueTeams.slice(0, uniquehalfLength);
          const rightTeams = uniqueTeams.slice(uniquehalfLength);


          setTeams({ left: leftTeams, right: rightTeams });
        })
        .catch((error) => {
          console.error("Error fetching teams:", error);
        });
    }
  }, [tournament]);


  const handleSelect = (round, index, team) => {
    const newWinners = { ...winners };
    newWinners[round][index] = team;

    // Clear future rounds based on the current selection
    const clearFutureRounds = (currentRound, currentIndex) => {
      if (currentRound === "L16") {
        newWinners.LQF[Math.floor(currentIndex / 2)] = null;
      }
      if (currentRound === "LQF" || currentRound === "L16") {
        newWinners.LSF[0] = null; // Ensure LSF only has one item
      }
      if (
        currentRound === "LSF" ||
        currentRound === "LQF" ||
        currentRound === "L16"
      ) {
        newWinners.F[0] = null;
      }

      if (currentRound === "R16") {
        newWinners.RQF[Math.floor(currentIndex / 2)] = null;
      }
      if (currentRound === "RQF" || currentRound === "R16") {
        newWinners.RSF[0] = null; // Ensure RSF only has one item
      }
      if (
        currentRound === "RSF" ||
        currentRound === "RQF" ||
        currentRound === "R16"
      ) {
        newWinners.F[0] = null;
      }
    };

    clearFutureRounds(round, index);

    setWinners(newWinners);

  };

  const renderMatchup = (round, index, team1, team2, customStyle = "") => {
    const teamLogoStyle = tournament.team_size === 16 ? styles.teamLogo16 : styles.teamLogo8;
    return (
      <View style={[styles.matchupContainer, customStyle]} key={`${round}-${index}`}>
        <TouchableOpacity onPress={() => handleSelect(round, index, team1)}>
          <View style={styles.teamContainer}>
            <Image
              source={{ uri: team1 ? team1.logo : placeholderLogo }}
              style={teamLogoStyle}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSelect(round, index, team2)}>
          <View style={styles.teamContainer}>
            <Image
              source={{ uri: team2 ? team2.logo : placeholderLogo }}
              style={teamLogoStyle}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFinalMatchup = () => {
    const team1 = winners.LSF[0];
    const team2 = winners.RSF[0];
    const winner = winners.F[0];
    const textWidth = 50 + 50;
    const teamLogoStyle = tournament.team_size === 16 ? styles.teamLogo16 : styles.teamLogo8;
    const winnerLogoStyle = tournament.team_size === 16 ? styles.winnerLogo16 : styles.winnerLogo8;

    return (
      <View style={styles.centerItems}>
        {winner && (
          <Text
            className="text-white text-center font-psemibold"
            style={[styles.championText, { width: textWidth }]}
          >
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
          <TouchableOpacity onPress={() => handleSelect("F", 0, team1)}>
          <View style={styles.teamContainer}>
              <Image
                source={{ uri: team1 ? team1.logo : placeholderLogo }}
                style={teamLogoStyle}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect("F", 0, team2)}>
          <View style={styles.teamContainer}>
              <Image
                source={{ uri: team2 ? team2.logo : placeholderLogo }}
                style={teamLogoStyle}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleSubmitPrediction = async () => {
    setUploading(true);
    try {
      let data = {
        tournament_id: tournament.id,
        left_side_round_of_16_teams: teams.left,
        right_side_round_of_16_teams: teams.right,
        left_side_quarter_finals: null,
        right_side_quarter_finals: null,
        left_side_semi_finals: winners.LQF,
        right_side_semi_finals: winners.RQF,
        finals: [winners.LSF[0], winners.RSF[0]],
        winner: winners.F[0]?.id,
        team_size: tournament.team_size,
      };

      if (tournament.team_size === 8) {
        data.left_side_quarter_finals = teams.left;
        data.right_side_quarter_finals = teams.right;
      } else if (tournament.team_size === 16) {
        data.left_side_quarter_finals = winners.L16;
        data.right_side_quarter_finals = winners.R16;
      }

      const validateData = () => {
        const valuesToCheck = [
          ...data.left_side_round_of_16_teams,
          ...data.left_side_quarter_finals,
          ...data.left_side_semi_finals,
          ...data.right_side_round_of_16_teams,
          ...data.right_side_quarter_finals,
          ...data.right_side_semi_finals,
          ...data.finals,
          data.winner,
        ];
        return valuesToCheck.every((value) => value !== null);
      };

      if (!validateData()) {
        Alert.alert(
          "Error",
          "Please make sure all selections are made before submitting."
        );
        setUploading(false);
        return;
      }

      const response = await api.post(
        `/api/tournaments/${tournament.id}/submit_prediction/`,
        data
      );
      Alert.alert("Success", "Your prediction has been submitted!");
    } catch (error) {
      console.error("Error submitting prediction:", error);
      Alert.alert("Error", "There was a problem submitting your prediction.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
    <SafeAreaView style={styles.bgPrimary}>
      <View style={styles.cardContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {tournament.team_size === 16 && (
            <>
              <View style={[styles.matchupWrapper, styles.pt12]}>
                {renderMatchup("L16", 0, teams.left[0], teams.left[1], styles.my2_16)}
                {renderMatchup("L16", 1, teams.left[2], teams.left[3], styles.my2_16)}
                {renderMatchup("L16", 2, teams.left[4], teams.left[5], styles.my2_16)}
                {renderMatchup("L16", 3, teams.left[6], teams.left[7], styles.my2_16)}
              </View>
              <View style={[styles.matchupWrapper, styles.pt24, styles.quarterFinalsContainerLeft]}>
                {renderMatchup(
                  "LQF",
                  0,
                  winners.L16[0],
                  winners.L16[1],
                  styles.my12_16
                )}
                {renderMatchup(
                  "LQF",
                  1,
                  winners.L16[2],
                  winners.L16[3],
                  styles.my12_16
                )}
              </View>
            </>
          )}
          {tournament.team_size === 8 && (
            <>
              <View style={[styles.matchupWrapper, styles.pt24, styles.quarterFinalsContainerLeft]}>
                {renderMatchup("LQF", 0, teams.left[0], teams.left[1], styles.my2_8)}
                {renderMatchup("LQF", 1, teams.left[2], teams.left[3], styles.my2_8)}
              </View>
            </>
          )}
          <View
            style={[
              styles.matchupWrapper,
              styles.pt40,
              styles.semiFinalsContainerLeft,
            ]}
          >
            {renderMatchup("LSF", 0, winners.LQF[0], winners.LQF[1], styles.my4)}
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
            {renderMatchup("RSF", 0, winners.RQF[0], winners.RQF[1], styles.my4)}
          </View>
          {tournament.team_size === 8 && (
            <>
              <View style={[styles.matchupWrapper, styles.pt24, styles.quarterFinalsContainerRight]}>
                {renderMatchup(
                  "RQF",
                  0,
                  teams.right[0],
                  teams.right[1],
                  styles.my2_8
                )}
                {renderMatchup(
                  "RQF",
                  1,
                  teams.right[2],
                  teams.right[3],
                  styles.my2_8
                )}
              </View>
            </>
          )}
          {tournament.team_size === 16 && (
            <>
              <View style={[styles.matchupWrapper, styles.pt24, styles.quarterFinalsContainerRight]}>
                {renderMatchup(
                  "RQF",
                  0,
                  winners.R16[0],
                  winners.R16[1],
                  styles.my12_16
                )}
                {renderMatchup(
                  "RQF",
                  1,
                  winners.R16[2],
                  winners.R16[3],
                  styles.my12_16
                )}
              </View>
              <View style={[styles.matchupWrapper, styles.pt12]}>
                {renderMatchup(
                  "R16",
                  0,
                  teams.right[0],
                  teams.right[1],
                  styles.my2_16
                )}
                {renderMatchup(
                  "R16",
                  1,
                  teams.right[2],
                  teams.right[3],
                  styles.my2_16
                )}
                {renderMatchup(
                  "R16",
                  2,
                  teams.right[4],
                  teams.right[5],
                  styles.my2_16
                )}
                {renderMatchup(
                  "R16",
                  3,
                  teams.right[6],
                  teams.right[7],
                  styles.my2_16
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
    <CustomButton
    title="Submit Prediction"
    handlePress={handleSubmitPrediction}
    containerStyles="mt-4"
    isLoading={uploading}
  />
  </>
  );
};

const styles = StyleSheet.create({
  bgPrimary: {
    backgroundColor: "#1c1c1c",     //Edges
    // height: "100%",
    borderRadius: 10,
  },
  cardContainer: {
    borderColor: "yellow",
    borderWidth: 1,
    backgroundColor: "#1c1c1c",
    padding: 0,
    borderRadius: 10,
    height: 400,
  },
  headerContainer: {
    borderColor: "purple",
    borderWidth: 1,
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
    borderColor: "orange",
    borderWidth: 0.5,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    width: 96,
    padding: 0,
  },
  matchupContainer: {
    borderColor: "brown",
    borderWidth: 1,
    marginVertical: 8,
  },
  teamContainer: {
    borderColor: "red",
    borderWidth: 1,
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
    width: 48,
    height: 48,
    marginRight: 0,
  },
  pt12: {
    paddingTop: 0,     //R16
  },
  pt24: {
    paddingTop: 0,     //QF
  },
  pt40: {
    paddingTop: 145,    //SF
  },
  pt32: {
    paddingTop: 108,    //F
  },
  my2_16: {
    marginVertical: 10,   //SPaces between R16 L16
  },
  my2_8: {
    marginVertical: 45,   //SPaces between R16 L16
  },
  my12_16: {
    marginVertical: 60,   //Spaces between QF   
  },
  my12_8: {
    marginVertical: 60,   //Spaces between QF   
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
  winnerLogo16: {
    width: 50,
    height: 50,
  },
  winnerLogo8: {
    width: 64,
    height: 64,
  },
  finalMatchupContainer: {
    borderColour: "black",
    borderWidth: 1,
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

export default PredictTournamentForm;
