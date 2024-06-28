import React, {useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import PredictTournamentForm from "../components/PredictTournamentForm";
import { CustomButton } from "../components";
import PredictedBracketList from "../components/PredictedBracketList";
import RenderModal from "./(tabs)/renderModal";

const TournamentDetails = () => {
  const route = useRoute();
  const { tournament } = route.params;

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView className="bg-primary h-full">
      <View style={styles.container}>
        <Text style={styles.title}>{tournament.name}</Text>
        <CustomButton
          title="Make a Prediction"
          handlePress={() => setModalVisible(true)}
          containerStyles="my-4"
        />
        <PredictedBracketList tournament={tournament} />
      </View>

      <RenderModal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <PredictTournamentForm tournament={tournament} />
      </RenderModal>
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
