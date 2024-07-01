import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import PredictBracketForm from "../components/PredictTournamentForm";
import { CustomButton } from "../components";
import PredictedBracketList from "../components/PredictedBracketList";
import ActualBracketForm from "../components/ActualBracketForm";
import BracketCard from "../components/BracketCard";
import RenderModal from "./(tabs)/renderModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import api from "../api";
import { FontAwesome } from "@expo/vector-icons";
import PointSystemModal from "../components/PointSystemModal";
import TournamentLeaderboard from "../components/TournamentLeaderboard";
import { useGlobalContext } from "../context/GlobalProvider";

const TournamentDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { tournament } = route.params;

  const { user } = useGlobalContext(); // Get current user from context
  const [predictModalVisible, setPredictModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [actualBracket, setActualBracket] = useState(null);
  const [pointSystem, setPointSystem] = useState([]);
  const [pointSystemModalVisible, setPointSystemModalVisible] = useState(false);
  const [top3Brackets, setTop3Brackets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    api
      .get(`/api/tournaments/${tournament.id}/`)
      .then((response) => {
        setActualBracket(response.data.actual_bracket);
        const points = JSON.parse(response.data.point_system);
        setPointSystem(points);

        const predictedBrackets = response.data.predicted_brackets;
        const top3Brackets = predictedBrackets
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
        setTop3Brackets(top3Brackets);
      })
      .catch((error) => {
        console.error("Error fetching actual bracket:", error);
      });
  }, [tournament]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await api.get(`/api/tournaments/${tournament.id}/`);
      setActualBracket(response.data.actual_bracket);
      const points = JSON.parse(response.data.point_system);
      setPointSystem(points);

      const predictedBrackets = response.data.predicted_brackets;
      const top3Brackets = predictedBrackets
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      setTop3Brackets(top3Brackets);
    } catch (error) {
      console.error("Error fetching actual bracket:", error);
    } finally {
      setRefreshing(false);
    }
  }, [tournament]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.bannerContainer}>
            <Image source={{ uri: tournament.banner }} style={styles.banner} />
            <View style={styles.bannerOverlay} />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <Image source={{ uri: tournament.logo }} style={styles.logo} />
            <Text style={styles.title}>{tournament.name}</Text>
          </View>

          <View style={styles.section}>
            {actualBracket ? (
              <View style={styles.bracketContainer}>
                <BracketCard bracket={actualBracket} isActual={true} />
              </View>
            ) : (
              <Text>Loading actual bracket...</Text>
            )}

            {user &&
              user.id === tournament.author && ( // Conditionally render the button
                <CustomButton
                  title="Update Actual Bracket"
                  handlePress={() => setUpdateModalVisible(true)}
                  containerStyles="my-4"
                />
              )}
          </View>

          <View style={styles.separator} />

          <TournamentLeaderboard
            top3Brackets={top3Brackets}
            pointSystem={pointSystem}
            setPointSystemModalVisible={setPointSystemModalVisible}
          />

          <View style={styles.cardsContainer}>
            <View style={styles.card}>
              <FontAwesome name="trophy" size={24} color="#ffd700" />
              <Text style={styles.cardTitle}>Reward</Text>
              <Text style={styles.cardText}>{tournament.winner_reward}</Text>
            </View>
            <View style={styles.card}>
              <FontAwesome name="ban" size={24} color="#ff0000" />
              <Text style={styles.cardTitle}>Forfeit</Text>
              <Text style={styles.cardText}>{tournament.loser_forfeit}</Text>
            </View>
          </View>

          <View style={styles.section}>
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
          <PredictBracketForm
            tournament={tournament}
            setModalVisible={setPredictModalVisible}
          />
        </RenderModal>
        <RenderModal
          modalVisible={updateModalVisible}
          setModalVisible={setUpdateModalVisible}
        >
          <Text style={styles.modalTitle}>Update Actual Bracket</Text>
          <ActualBracketForm
            tournament={tournament}
            setActualBracket={setActualBracket}
            setModalVisible={setUpdateModalVisible}
          />
        </RenderModal>
        <PointSystemModal
          modalVisible={pointSystemModalVisible}
          setModalVisible={setPointSystemModalVisible}
          pointSystem={pointSystem}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Add padding to ensure smooth scrolling
  },
  bannerContainer: {
    position: "relative",
  },
  banner: {
    width: "100%",
    height: 130,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Darker overlay
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1, // Ensure the button is on top
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#DCDCDC",
    marginTop: 0,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 20, // Circular logo
  },
  title: {
    color: "black",
    fontSize: 29,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 12,
    paddingHorizontal: 16,
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
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  card: {
    flex: 1,
    // backgroundColor: "#2c2c2e",    DARK MODE
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  cardTitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  cardText: {
    color: "black",
    fontSize: 14,
    textAlign: "center",
  },
  bracketContainer: {
    maxHeight: 390,
    overflow: "hidden",
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default TournamentDetails;
