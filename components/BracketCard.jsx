import React from "react";
import { View, Text, Image, ScrollView, SafeAreaView } from "react-native";

const placeholderLogo = "https://via.placeholder.com/50?text=+";

const BracketCard = ({ bracket }) => {
  const renderMatchup = (round, index, team1, team2, customStyle = "") => {
    return (
      <View className={`my-2 ${customStyle}`} key={`${round}-${index}`}>
        <View className="flex-row items-center my-1">
          <Image
            source={{ uri: team1 ? team1.logo : placeholderLogo }}
            className="w-6 h-6 mr-2"
          />
          {/* <Text>{team1 ? team1.name : "TBD"}</Text> */}
        </View>
        <View className="flex-row items-center my-1">
          <Image
            source={{ uri: team2 ? team2.logo : placeholderLogo }}
            className="w-6 h-6 mr-2"
          />
          {/* <Text>{team2 ? team2.name : "TBD"}</Text> */}
        </View>
      </View>
    );
  };

  const renderFinalMatchup = () => {
    const team1 = bracket.left_side_semi_finals[0] || null;
    const team2 = bracket.right_side_semi_finals[0] || null;
    const winner = bracket.winner || null;
    const textWidth = 50 + 50; // Adjust this based on your layout needs

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
          <View className="flex-row items-center ml-0 mr-1.5">
            <Image
              source={{ uri: team1 ? team1.logo : placeholderLogo }}
              className="w-6 h-6 mr-2"
            />
            {/* <Text>{team1 ? team1.name : "TBD"}</Text> */}
          </View>
          <View className="flex-row items-center ml-0 mr-0">
            <Image
              source={{ uri: team2 ? team2.logo : placeholderLogo }}
              className="w-6 h-6 mr-2"
            />
            {/* <Text>{team2 ? team2.name : "TBD"}</Text> */}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className={`bg-black-200 p-10 rounded-lg`}>
        {!bracket.is_actual && (
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              Score: {bracket.score || 0}
            </Text>
          </View>
        )}

        <ScrollView contentContainerStyle={{ flexDirection: "row" }}>
          <View className="flex-1 items-center w-24 p-4 pt-12">
            {renderMatchup(
              "L16",
              0,
              bracket.left_side_round_of_16_teams[0],
              bracket.left_side_round_of_16_teams[1],
              "my-2"
            )}
            {renderMatchup(
              "L16",
              1,
              bracket.left_side_round_of_16_teams[2],
              bracket.left_side_round_of_16_teams[3],
              "my-2"
            )}
            {renderMatchup(
              "L16",
              2,
              bracket.left_side_round_of_16_teams[4],
              bracket.left_side_round_of_16_teams[5],
              "my-2"
            )}
            {renderMatchup(
              "L16",
              3,
              bracket.left_side_round_of_16_teams[6],
              bracket.left_side_round_of_16_teams[7],
              "my-2"
            )}
          </View>
          <View className="flex-1 items-center w-24 p-4 pt-12">
            {renderMatchup(
              "LQF",
              0,
              bracket.left_side_quarter_finals[0],
              bracket.left_side_quarter_finals[1],
              "my-12"
            )}
            {renderMatchup(
              "LQF",
              1,
              bracket.left_side_quarter_finals[2],
              bracket.left_side_quarter_finals[3],
              "my-12"
            )}
          </View>
          <View className="flex-1 items-center w-24 p-4 pt-40">
            {renderMatchup(
              "LSF",
              0,
              bracket.left_side_semi_finals[0],
              bracket.left_side_semi_finals[1],
              "my-4"
            )}
          </View>
          <View className="flex-1 items-center w-36 p-8 pt-32">
            {renderFinalMatchup()}
          </View>
          <View className="flex-1 items-center w-24 p-4 pt-40">
            {renderMatchup(
              "RSF",
              0,
              bracket.right_side_semi_finals[0],
              bracket.right_side_semi_finals[1],
              "my-4"
            )}
          </View>
          <View className="flex-1 items-center w-24 p-4 pt-12">
            {renderMatchup(
              "RQF",
              0,
              bracket.right_side_quarter_finals[0],
              bracket.right_side_quarter_finals[1],
              "my-12"
            )}
            {renderMatchup(
              "RQF",
              1,
              bracket.right_side_quarter_finals[2],
              bracket.right_side_quarter_finals[3],
              "my-12"
            )}
          </View>
          <View className="flex-1 items-center w-24 p-4 pt-12">
            {renderMatchup(
              "R16",
              0,
              bracket.right_side_round_of_16_teams[0],
              bracket.right_side_round_of_16_teams[1],
              "my-2"
            )}
            {renderMatchup(
              "R16",
              1,
              bracket.right_side_round_of_16_teams[2],
              bracket.right_side_round_of_16_teams[3],
              "my-2"
            )}
            {renderMatchup(
              "R16",
              2,
              bracket.right_side_round_of_16_teams[4],
              bracket.right_side_round_of_16_teams[5],
              "my-2"
            )}
            {renderMatchup(
              "R16",
              3,
              bracket.right_side_round_of_16_teams[6],
              bracket.right_side_round_of_16_teams[7],
              "my-2"
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default BracketCard;
