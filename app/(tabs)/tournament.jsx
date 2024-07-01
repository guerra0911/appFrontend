import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PredictBracketForm from "../../components/PredictTournamentForm";
import CustomButton from "../../components/CustomButton";
import RenderModal from "./renderModal";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import CreateTournamentForm from "../../components/CreateTournamentForm";
import { useGlobalContext } from "../../context/GlobalProvider";
import Loader from "../../components/Loader";
import TournamentList from "../../components/TournamentList";

const Tournament = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user, setUser, setIsLogged, loading, setLoading } =
    useGlobalContext();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);

  return (
    <GestureHandlerRootView style={styles.flex1}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Loader isLoading={loading} />

          <View>
            <RenderModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
            >
              <CreateTournamentForm setModalVisible={setModalVisible} />
            </RenderModal>
          </View>

          {!loading && (
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.headerRow}>
                <Text style={styles.headerText}>
                  Tournament
                </Text>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.createButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TournamentList />
              </View>
            </ScrollView>
          )}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 72,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 36,
    color: 'black',
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: '#69C3FF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Tournament;
