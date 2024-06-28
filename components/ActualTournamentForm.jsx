import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";

const teams = {
  left: [
    { id: "L1", name: "L1", logo: "https://via.placeholder.com/50" },
    { id: "L2", name: "L2", logo: "https://via.placeholder.com/50" },
    { id: "L3", name: "L3", logo: "https://via.placeholder.com/50" },
    { id: "L4", name: "L4", logo: "https://via.placeholder.com/50" },
    { id: "L5", name: "L5", logo: "https://via.placeholder.com/50" },
    { id: "L6", name: "L6", logo: "https://via.placeholder.com/50" },
    { id: "L7", name: "L7", logo: "https://via.placeholder.com/50" },
    { id: "L8", name: "L8", logo: "https://via.placeholder.com/50" },
  ],
  right: [
    { id: "R1", name: "R1", logo: "https://via.placeholder.com/50" },
    { id: "R2", name: "R2", logo: "https://via.placeholder.com/50" },
    { id: "R3", name: "R3", logo: "https://via.placeholder.com/50" },
    { id: "R4", name: "R4", logo: "https://via.placeholder.com/50" },
    { id: "R5", name: "R5", logo: "https://via.placeholder.com/50" },
    { id: "R6", name: "R6", logo: "https://via.placeholder.com/50" },
    { id: "R7", name: "R7", logo: "https://via.placeholder.com/50" },
    { id: "R8", name: "R8", logo: "https://via.placeholder.com/50" },
  ],
};

const placeholderLogo = "https://via.placeholder.com/50?text=+"; // Placeholder image URL

const ActualTournamentForm = () => {
  const [winners, setWinners] = useState({
    L16: [null, null, null, null],
    LQF: [null, null],
    LSF: [null],
    RSF: [null],
    RQF: [null, null],
    R16: [null, null, null, null],
    F: [null],
  });

  const [padding, setPadding] = useState(10); // State for padding
  const [winnerSize, setWinnerSize] = useState(50); // State for winner placeholder size
  const [winnerTextSize, setWinnerTextSize] = useState(16); // State for winner text size

  const handleSelect = (round, index, team) => {
    const newWinners = { ...winners };
    newWinners[round][index] = team;

    // Clear future rounds based on the current selection
    const clearFutureRounds = (currentRound, currentIndex) => {
      if (currentRound === "L16") {
        newWinners.LQF[Math.floor(currentIndex / 2)] = null;
      }
      if (currentRound === "LQF" || currentRound === "L16") {
        newWinners.LSF[Math.floor(currentIndex / 2)] = null;
      }
      if (currentRound === "LSF" || currentRound === "LQF" || currentRound === "L16") {
        newWinners.F[0] = null;
      }

      if (currentRound === "R16") {
        newWinners.RQF[Math.floor(currentIndex / 2)] = null;
      }
      if (currentRound === "RQF" || currentRound === "R16") {
        newWinners.RSF[Math.floor(currentIndex / 2)] = null;
      }
      if (currentRound === "RSF" || currentRound === "RQF" || currentRound === "R16") {
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
            <Image source={{ uri: team1 ? team1.logo : placeholderLogo }} className="w-6 h-6 mr-2" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSelect(round, index, team2)}>
          <View className="flex-row items-center my-1">
            <Image source={{ uri: team2 ? team2.logo : placeholderLogo }} className="w-6 h-6 mr-2" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFinalMatchup = () => {
    const team1 = winners.LSF[0];
    const team2 = winners.RSF[0];
    const winner = winners.F[0];
    const textWidth = winnerSize + 50;
  
    return (
      <View className="items-center">
        {winner && (
          <Text
            className="text-white text-center font-psemibold"
            style={{
              fontSize: winnerTextSize,
              width: textWidth,
              textAlign: 'center',
              position: 'absolute',
              top: -30,
            }}
          >
            CHAMPION
          </Text>
        )}
        <View className="mb-4">
          <Image
            source={{ uri: winner ? winner.logo : placeholderLogo }}
            style={{ width: winnerSize, height: winnerSize }}
          />
        </View>
        <View className="flex-row justify-between items-center ml-1 ">
          <TouchableOpacity onPress={() => handleSelect('F', 0, team1)}>
            <View className="flex-row items-center mx-2">
              <Image source={{ uri: team1 ? team1.logo : placeholderLogo }} className="w-6 h-6 mr-2" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect('F', 0, team2)}>
            <View className="flex-row items-center mx-2">
              <Image source={{ uri: team2 ? team2.logo : placeholderLogo }} className="w-6 h-6 mr-2" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className={`bg-black-200 p-${padding} rounded-lg`}>
        <ScrollView contentContainerStyle={{ flexDirection: "row" }}>
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
          <View className="flex-1 items-center w-24 p-4 pt-40">
            {renderMatchup("LSF", 0, winners.LQF[0], winners.LQF[1], "my-4")}
          </View>
          <View className="flex-1 items-center w-36 p-8 pt-32">
            {renderFinalMatchup()}
          </View>
          <View className="flex-1 items-center w-24 p-4 pt-40">
            {renderMatchup("RSF", 0, winners.RQF[0], winners.RQF[1], "my-4")}
          </View>
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ActualTournamentForm;
