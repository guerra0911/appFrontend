import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import PredictBracketForm from "../components/PredictTournamentForm";
import { CustomButton } from "../components";
import PredictedBracketList from "../components/PredictedBracketList";
import ActualBracketForm from "../components/ActualBracketForm";
import BracketCard from "../components/BracketCard";
import RenderModal from "./(tabs)/renderModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import api from "../api";

const TournamentDetails = () => {
  const route = useRoute();
  const { tournament } = route.params;

  const [predictModalVisible, setPredictModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [actualBracket, setActualBracket] = useState(null);
  const [pointSystem, setPointSystem] = useState([]);

  useEffect(() => {
    api
      .get(`/api/tournaments/${tournament.id}/`)
      .then((response) => {
        setActualBracket(response.data.actual_bracket);
        // Parse the point system data here
        const points = JSON.parse(response.data.point_system);
        setPointSystem(points);
      })
      .catch((error) => {
        console.error("Error fetching actual bracket:", error);
      });
  }, [tournament]);


  const renderPointSystem = () => {
    if (!Array.isArray(pointSystem) || pointSystem.length !== 4) {
      return <Text style={styles.text}>Point system data is unavailable.</Text>;
    }

    return (
      <View style={styles.pointSystem}>
        <Text style={styles.point}>✨ Round of 16: {pointSystem[0]} points for each correct guess</Text>
        <Text style={styles.point}>✨ Quarterfinals: {pointSystem[1]} points for each correct guess</Text>
        <Text style={styles.point}>✨ Semifinals: {pointSystem[2]} points for each correct guess</Text>
        <Text style={styles.point}>🏆 Finals: {pointSystem[3]} points for each correct guess</Text>
        <Text style={styles.point}>🎯 Correct Score Bonus: {tournament.correct_score_bonus} points</Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>{tournament.name}</Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Point System</Text>
            {renderPointSystem()}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reward</Text>
            <Text style={styles.text}>{tournament.winner_reward}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Forfeit</Text>
            <Text style={styles.text}>{tournament.loser_forfeit}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actual Bracket</Text>
            <CustomButton
              title="Update Actual Bracket"
              handlePress={() => setUpdateModalVisible(true)}
              containerStyles="my-4"
            />
            {actualBracket ? (
              <View style={styles.bracketContainer}>
                <BracketCard bracket={actualBracket} isActual={true} />
              </View>
            ) : (
              <Text>Loading actual bracket...</Text>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Predicted Brackets</Text>
            <CustomButton
              title="Make a Prediction"
              handlePress={() => setPredictModalVisible(true)}
              containerStyles="my-4"
            />
            <PredictedBracketList tournament={tournament} />
          </View>
        </ScrollView>
        <RenderModal
          modalVisible={predictModalVisible}
          setModalVisible={setPredictModalVisible}
        >
          <Text style={styles.modalTitle}>Make a Prediction</Text>
          <PredictBracketForm tournament={tournament} />
        </RenderModal>
        <RenderModal
          modalVisible={updateModalVisible}
          setModalVisible={setUpdateModalVisible}
        >
          <Text style={styles.modalTitle}>Update Actual Bracket</Text>
          <ActualBracketForm
            tournament={tournament}
            setActualBracket={setActualBracket}
          />
        </RenderModal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1c1c1e",
  },
  container: {
    padding: 16,
    flexGrow: 1,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  pointSystem: {
    paddingLeft: 16,
  },
  point: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },
  bracketContainer: {
    maxHeight: 400,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D0D0D0',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default TournamentDetails;
