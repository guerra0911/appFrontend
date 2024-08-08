import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import ChallengeStatusModal from "./ChallengeStatusModal";
import ChallengeCardStacked from "./ChallengeCardStacked";
import { useChallengeContext } from "../context/ChallengeContext";
import StatusActionButton from "./StatusActionButton";

const ChallengeStatusButton = ({ type }) => {
  const [challengeModalVisible, setChallengeModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const scrollViewRef = useRef(null);

  const {
    challengeRequests,
    challengesDeclined,
    requestingChallenges,
    fetchChallengeRequests,
    fetchRequestingChallenges,
    fetchChallengesDeclined,
    acceptAllChallengeRequests,
    declineAllChallengeRequests,
  } = useChallengeContext();

  const openChallengeRequestsModal = () => {
    setModalTitle("Challenge Requests");
    fetchChallengeRequests();
    setChallengeModalVisible(true);
  };

  const openRequestingChallengesModal = () => {
    setModalTitle("Sent Challenges");
    fetchRequestingChallenges();
    fetchChallengesDeclined();
    setChallengeModalVisible(true);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchChallengeRequests();
    fetchRequestingChallenges();
    fetchChallengesDeclined();
    setRefreshing(false);
  }, [fetchChallengeRequests, fetchRequestingChallenges, fetchChallengesDeclined]);

  const handleAcceptAll = async () => {
    try {
      await acceptAllChallengeRequests();
      Alert.alert("All challenge requests accepted!");
      fetchChallengeRequests();
    } catch (error) {
      console.error("Error accepting all challenges:", error);
      Alert.alert("Error accepting all challenges. Please try again.");
    }
  };

  const handleDeclineAll = async () => {
    try {
      await declineAllChallengeRequests();
      Alert.alert("All challenge requests declined!");
      fetchChallengeRequests();
    } catch (error) {
      console.error("Error declining all challenges:", error);
      Alert.alert("Error declining all challenges. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {type === "Requests" ? (
        <TouchableOpacity
          style={styles.button}
          onPress={openChallengeRequestsModal}
        >
          <Text style={styles.buttonText}>Challenge Requests</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={openRequestingChallengesModal}
        >
          <Text style={styles.buttonText}>Sent Challenges</Text>
        </TouchableOpacity>
      )}

      <ChallengeStatusModal
        modalVisible={challengeModalVisible}
        setModalVisible={setChallengeModalVisible}
        refreshing={refreshing}
        onRefresh={onRefresh}
        modalTitle={modalTitle}
        modalTitleStyle={styles.modalTitle}
        scrollViewRef={scrollViewRef}
        scrollEnabled={scrollEnabled}
      >
        {modalTitle === "Challenge Requests" && (
          <>
            <View style={styles.actionButtons}>
              <StatusActionButton
                text="Accept All"
                color="#4CAF50"
                onPress={handleAcceptAll}
              />
              <StatusActionButton
                text="Decline All"
                color="#F44336"
                onPress={handleDeclineAll}
              />
            </View>
            {challengeRequests.map((challenge) => (
              <View
                key={`challenge-${challenge.id}`}
                style={styles.challengeRequestView}
              >
                <ChallengeCardStacked
                  challenge={challenge}
                  onLikeDislikeUpdate={fetchChallengeRequests}
                  isRequestView={true}
                  setScrollEnabled={setScrollEnabled}
                  buttonTypes={["accept", "decline"]}
                />
              </View>
            ))}
            <View style={styles.paddingView}></View>
          </>
        )}

        {modalTitle === "Sent Challenges" && (
          <>
            {requestingChallenges.map((challenge) => (
              <View
                key={`challenge-${challenge.id}`}
                style={styles.sentChallengeView}
              >
                <ChallengeCardStacked
                  key={`challenge-${challenge.id}`}
                  challenge={challenge}
                  onLikeDislikeUpdate={fetchRequestingChallenges}
                  isRequestView={true}
                  setScrollEnabled={setScrollEnabled}
                  buttonTypes={["delete"]}
                />
              </View>
            ))}
            <Text style={styles.sectionTitle}>Declined Challenges</Text>
            {challengesDeclined.map((challenge) => (
              <View
                key={`challenge-${challenge.id}`}
                style={styles.declinedChallengeView}
              >
                <ChallengeCardStacked
                  key={`challenge-${challenge.id}`}
                  challenge={challenge}
                  onLikeDislikeUpdate={fetchChallengesDeclined}
                  isRequestView={true}
                  setScrollEnabled={setScrollEnabled}
                  buttonTypes={["resubmit", "delete"]}
                />
              </View>
            ))}
            <View style={styles.paddingView}></View>
          </>
        )}
      </ChallengeStatusModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  button: {
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 13,
  },
  actionButtons: {
    flexDirection: "row",
    marginLeft: "auto",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 13,
  },
  challengeRequestView: {
    marginBottom: 10,
  },
  sentChallengeView: {
    marginBottom: 10,
  },
  declinedChallengeView: {
    marginBottom: 10,
  },
  paddingView: {
    height: 450,
  },
});

export default ChallengeStatusButton;
