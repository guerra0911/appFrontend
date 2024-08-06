import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import RenderModal from "../app/(tabs)/renderModal";
import ChallengeCardStacked from "./ChallengeCardStacked";
import useChallengeActions from "../hooks/useChallengeActions";
import StatusActionButton from "./StatusActionButton";

const ChallengeStatusButton = ({ type }) => {
  const [challengeModalVisible, setChallengeModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const {
    challengeRequests,
    challengesDeclined,
    requestingChallenges,
    fetchChallengeRequests,
    fetchRequestingChallenges,
    fetchChallengesDeclined,
    acceptChallengeRequest,
    declineChallengeRequest,
    resubmitChallengeRequest,
    deleteChallenge,
    acceptAllChallengeRequests,
    declineAllChallengeRequests,
  } = useChallengeActions();

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
    <View>
      {type === "Requests" ? (
        <TouchableOpacity style={styles.button} onPress={openChallengeRequestsModal}>
          <Text style={styles.buttonText}>Challenge Requests</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={openRequestingChallengesModal}>
          <Text style={styles.buttonText}>Sent Challenges</Text>
        </TouchableOpacity>
      )}

      <RenderModal modalVisible={challengeModalVisible} setModalVisible={setChallengeModalVisible}>
        <Text style={styles.modalTitle}>{modalTitle}</Text>
        <ScrollView>
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
                <View key={`challenge-${challenge.id}`}>
                  <View style={styles.actionButtons}>
                    <StatusActionButton
                      text="Accept"
                      color="#4CAF50"
                      onPress={() => acceptChallengeRequest(challenge.id)}
                    />
                    <StatusActionButton
                      text="Decline"
                      color="#F44336"
                      onPress={() => declineChallengeRequest(challenge.id)}
                    />
                  </View>
                  <View key={`challenge-${challenge.id}`}>
                    <ChallengeCardStacked
                      challenge={challenge}
                      onLikeDislikeUpdate={fetchChallengeRequests}
                      isRequestView={true}
                    />
                  </View>
                </View>
              ))}
            </>
          )}

          {modalTitle === "Sent Challenges" && (
            <>
              {requestingChallenges.map((challenge) => (
                <View key={`challenge-${challenge.id}`}>
                  <StatusActionButton
                    text="Delete"
                    color="#F44336"
                    onPress={() => deleteChallenge(challenge.id)}
                  />
                  <ChallengeCardStacked
                    key={`challenge-${challenge.id}`}
                    challenge={challenge}
                    onLikeDislikeUpdate={fetchRequestingChallenges}
                    isRequestView={true}
                  />
                </View>
              ))}
              <Text style={styles.sectionTitle}>Declined Challenges</Text>
              {challengesDeclined.map((challenge) => (
                <View key={`challenge-${challenge.id}`}>
                  <View style={styles.actionButtons}>
                    <StatusActionButton
                      text="Resubmit"
                      color="#4CAF50"
                      onPress={() => resubmitChallengeRequest(challenge.id)}
                    />
                    <StatusActionButton
                      text="Delete"
                      color="#F44336"
                      onPress={() => deleteChallenge(challenge.id)}
                    />
                  </View>
                  <ChallengeCardStacked
                    key={`challenge-${challenge.id}`}
                    challenge={challenge}
                    onLikeDislikeUpdate={fetchChallengesDeclined}
                    isRequestView={true}
                  />
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </RenderModal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
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
});

export default ChallengeStatusButton;
