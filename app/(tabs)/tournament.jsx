import {
  View,
  Image,
  TouchableOpacity,
  Alert,
  Text,
  RefreshControl,
} from "react-native";
import { useEffect, useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PredictTournamentForm from "../../components/PredictTournamentForm";
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
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="bg-primary h-full">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
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
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <Text className="text-2xl text-white font-psemibold px-4 my-6">
                Tournament
              </Text>
              <CustomButton
                        title="Create Tournament"
                        handlePress={() => setModalVisible(true)}
                        containerStyles="mt-4 w-full flex justify-center items-center"
                        isLoading={loading}
                      />
              <View>
                <TournamentList />
              </View>
            </ScrollView>
          )}
          {!loading && (
            <View className="flex-1 justify-center items-center">
              <Text className="text-white font-psemibold text-lg">
                No Data available
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Tournament;
