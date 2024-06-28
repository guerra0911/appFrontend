import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import api from "../api";
import CustomButton from "./CustomButton";

const placeholderLogo = "https://via.placeholder.com/50?text=+";

const ActualBracketForm = ({ tournament, setActualBracket }) => {
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

    const clearFutureRounds = (currentRound, currentIndex) => {
      if (currentRound === "L16") {
        newWinners.LQF[Math.floor(currentIndex / 2)] = null;
      }
      if (currentRound === "LQF" || currentRound === "L16") {
        newWinners.LSF[0] = null;
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
        newWinners.RSF[0] = null;
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
    return (
      <View className={`my-2 ${customStyle}`} key={`${round}-${index}`}>
        <TouchableOpacity onPress={() => handleSelect(round, index, team1)}>
          <View className="flex-row items-center my-1">
            <Image
              source={{ uri: team1 ? team1.logo : placeholderLogo }}
              className="w-6 h-6 mr-2"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSelect(round, index, team2)}>
          <View className="flex-row items-center my-1">
            <Image
              source={{ uri: team2 ? team2.logo : placeholderLogo }}
              className="w-6 h-6 mr-2"
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

    return (
      <View className="items-center">
        {winner && (
          <Text
            className="text-white text-center font-psemibold"
            style={{
              fontSize: 16,
              width: textWidth,
              textAlign: "center",
              position: "absolute",
              top: -30,
            }}
          >
            CHAMPION
          </Text>
        )}
        <View className="mb-4">
          <Image
            source={{ uri: winner ? winner.logo : placeholderLogo }}
            style={{ width: 50, height: 50 }}
          />
        </View>
        <View className="flex-row justify-between items-center ml-1 ">
          <TouchableOpacity onPress={() => handleSelect("F", 0, team1)}>
            <View className="flex-row items-center ml-0 mr-1.5">
              <Image
                source={{ uri: team1 ? team1.logo : placeholderLogo }}
                className="w-6 h-6 mr-2"
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect("F", 0, team2)}>
            <View className="flex-row items-center ml-0 mr-0">
              <Image
                source={{ uri: team2 ? team2.logo : placeholderLogo }}
                className="w-6 h-6 mr-2"
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
      };
      
      if (tournament.team_size === 8) {
        data.left_side_quarter_finals = teams.left;
        data.right_side_quarter_finals = teams.right;
      } else if (tournament.team_size === 16) {
        data.left_side_quarter_finals = winners.L16;
        data.right_side_quarter_finals = winners.R16;
      }
      const response = await api.post(
        `/api/tournaments/${tournament.id}/update_actual_bracket/`,
        data
      );
      setActualBracket(response.data.bracket);
      Alert.alert("Success", "Your prediction has been submitted!");
    } catch (error) {
      console.error("Error submitting prediction:", error);
      Alert.alert("Error", "There was a problem submitting your prediction.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className={`bg-black-200 p-10 rounded-lg`}>
        <ScrollView contentContainerStyle={{ flexDirection: "row" }}>
          {tournament.team_size === 16 && (
            <>
              <View className="flex-1 items-center w-24 p-4 pt-12">
                {renderMatchup("L16", 0, teams.left[0], teams.left[1], "my-2")}
                {renderMatchup("L16", 1, teams.left[2], teams.left[3], "my-2")}
                {renderMatchup("L16", 2, teams.left[4], teams.left[5], "my-2")}
                {renderMatchup("L16", 3, teams.left[6], teams.left[7], "my-2")}
              </View>
              <View className="flex-1 items-center w-24 p-4 pt-12">
                {renderMatchup("LQF", 0, winners.L16[0], winners.L16[1], "my-12")}
                {renderMatchup("LQF", 1, winners.L16[2], winners.L16[3], "my-12")}
              </View>
            </>
          )}
          {tournament.team_size === 8 && (
            <>
              <View className="flex-1 items-center w-24 p-4 pt-12">
                {renderMatchup("LQF", 0, teams.left[0], teams.left[1], "my-2")}
                {renderMatchup("LQF", 1, teams.left[2], teams.left[3], "my-2")}
              </View>
            </>
          )}
          <View className="flex-1 items-center w-24 p-4 pt-40">
            {renderMatchup("LSF", 0, winners.LQF[0], winners.LQF[1], "my-4")}
          </View>
          <View className="flex-1 items-center w-36 p-8 pt-32">
            {renderFinalMatchup()}
          </View>
          <View className="flex-1 items-center w-24 p-4 pt-40">
            {renderMatchup("RSF", 0, winners.RQF[0], winners.RQF[1], "my-4")}
          </View>
          {tournament.team_size === 8 && (
            <>
              <View className="flex-1 items-center w-24 p-4 pt-12">
                {renderMatchup("RQF", 0, teams.right[0], teams.right[1], "my-2")}
                {renderMatchup("RQF", 1, teams.right[2], teams.right[3], "my-2")}
              </View>
            </>
          )}
          {tournament.team_size === 16 && (
            <>
              <View className="flex-1 items-center w-24 p-4 pt-12">
                {renderMatchup("RQF", 0, winners.R16[0], winners.R16[1], "my-12")}
                {renderMatchup("RQF", 1, winners.R16[2], winners.R16[3], "my-12")}
              </View>
              <View className="flex-1 items-center w-24 p-4 pt-12">
                {renderMatchup("R16", 0, teams.right[0], teams.right[1], "my-2")}
                {renderMatchup("R16", 1, teams.right[2], teams.right[3], "my-2")}
                {renderMatchup("R16", 2, teams.right[4], teams.right[5], "my-2")}
                {renderMatchup("R16", 3, teams.right[6], teams.right[7], "my-2")}
              </View>
            </>
          )}
        </ScrollView>
      </View>
      <CustomButton
        title="Update Actual Bracket"
        handlePress={handleSubmitPrediction}
        containerStyles="mt-4"
        isLoading={uploading}
      />
    </SafeAreaView>
  );
};

export default ActualBracketForm;
