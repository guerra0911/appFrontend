import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";

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

const Tournament = () => {
  const [winners, setWinners] = useState({
    L16: [null, null, null, null],
    LQF: [null, null],
    LSF: [null],
    RSF: [null],
    RQF: [null, null],
    R16: [null, null, null, null],
    F: [null],
  });

  const handleSelect = (round, index, team) => {
    const newWinners = { ...winners };
    newWinners[round][index] = team;

    // Clear future rounds based on the current selection
    const clearFutureRounds = (currentRound, currentIndex) => {
      if (currentRound === "L16" || currentRound === "R16") {
        newWinners.LQF[Math.floor(currentIndex / 2)] = null;
        newWinners.RQF[Math.floor(currentIndex / 2)] = null;
      }
      if (currentRound === "L16" || currentRound === "LQF" || currentRound === "R16" || currentRound === "RQF") {
        newWinners.LSF[Math.floor(currentIndex / 2)] = null;
        newWinners.RSF[Math.floor(currentIndex / 2)] = null;
      }
      if (currentRound === "L16" || currentRound === "LQF" || currentRound === "LSF" || currentRound === "R16" || currentRound === "RQF" || currentRound === "RSF") {
        newWinners.F[0] = null;
      }
    };

    clearFutureRounds(round, index);

    setWinners(newWinners);
  };

  const renderMatchup = (round, index, team1, team2, customStyle = "") => {
    if (!team1 || !team2) return null;
    return (
      <View className={`my-2 ${customStyle}`} key={`${round}-${index}`}>
        <TouchableOpacity onPress={() => handleSelect(round, index, team1)}>
          <View className="flex-row items-center my-1">
            <Image source={{ uri: team1.logo }} className="w-6 h-6 mr-2" />
            <Text className="text-xs text-white font-psemibold">{team1.name}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSelect(round, index, team2)}>
          <View className="flex-row items-center my-1">
            <Image source={{ uri: team2.logo }} className="w-6 h-6 mr-2" />
            <Text className="text-xs text-white font-psemibold">{team2.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const getNextRoundTeams = (round) => {
    if (round === "LQF")
      return [winners.L16[0], winners.L16[1], winners.L16[2], winners.L16[3]];
    if (round === "LSF") return [winners.LQF[0], winners.LQF[1]];
    if (round === "F") return [winners.LSF[0], winners.RSF[0]];
    if (round === "RQF")
      return [winners.R16[0], winners.R16[1], winners.R16[2], winners.R16[3]];
    if (round === "RSF") return [winners.RQF[0], winners.RQF[1]];
    return [];
  };

  return (
    <ScrollView contentContainerStyle={{ flexDirection: "row", padding: 10 }}>
      <View className="flex-1 items-center w-24 p-4 pt-12">
        {renderMatchup("L16", 0, teams.left[0], teams.left[1], "my-2")}
        {renderMatchup("L16", 1, teams.left[2], teams.left[3], "my-2")}
        {renderMatchup("L16", 2, teams.left[4], teams.left[5], "my-2")}
        {renderMatchup("L16", 3, teams.left[6], teams.left[7], "my-2")}
      </View>
      <View className="flex-1 items-center w-24 p-4 pt-12">
        {renderMatchup("LQF", 0, winners.L16[0], winners.L16[1], "my-20")}
        {renderMatchup("LQF", 1, winners.L16[2], winners.L16[3], "my-20")}
      </View>
      <View className="flex-1 items-center w-24 p-4 pt-44">
        {renderMatchup("LSF", 0, winners.LQF[0], winners.LQF[1], "my-20")}
      </View>
      <View className="flex-1 items-center w-24 p-4 pt-56">
        {renderMatchup("F", 0, winners.LSF[0], winners.RSF[0], "my-4")}
      </View>
      <View className="flex-1 items-center w-24 p-4 pt-40">
        {renderMatchup("RSF", 0, winners.RQF[0], winners.RQF[1], "my-20")}
      </View>
      <View className="flex-1 items-center w-24 p-4 pt-12">
        {renderMatchup("RQF", 0, winners.R16[0], winners.R16[1], "my-20")}
        {renderMatchup("RQF", 1, winners.R16[2], winners.R16[3], "my-20")}
      </View>
      <View className="flex-1 items-center w-24 p-4 pt-12">
        {renderMatchup("R16", 0, teams.right[0], teams.right[1], "my-2")}
        {renderMatchup("R16", 1, teams.right[2], teams.right[3], "my-2")}
        {renderMatchup("R16", 2, teams.right[4], teams.right[5], "my-2")}
        {renderMatchup("R16", 3, teams.right[6], teams.right[7], "my-2")}
      </View>
    </ScrollView>
  );
};

export default Tournament;
