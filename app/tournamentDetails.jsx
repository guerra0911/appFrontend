import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import PredictTournamentForm from "../components/PredictTournamentForm";

const TournamentDetails = () => {
  const route = useRoute();
  const { tournament } = route.params;

  return (
    <SafeAreaView className="bg-primary h-full">
      <View style={styles.container}>
        <Text style={styles.title}>{tournament.name}</Text>
      </View>
      <View>
        <PredictTournamentForm tournament={tournament} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1e",
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    color: "#fff",
    fontSize: 16,
    marginTop: 8,
  },
});

export default TournamentDetails;
