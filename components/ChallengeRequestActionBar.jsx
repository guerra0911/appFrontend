import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import api from "../api";

const ChallengeRequestsActionBar = ({
  challenge,
  fetchChallengeRequests,
  fetchChallengesDeclined,
  fetchRequestingChallenges,
}) => {
  const acceptChallengeRequest = async (challengeId) => {
    try {
      await api.post(`/api/challenges/accept/${challengeId}/`);
      fetchChallengeRequests(); // Refresh the requests list
    } catch (error) {
      console.error("Error accepting challenge request:", error);
      Alert.alert("Error", "Failed to accept challenge request.");
    }
  };

  const declineChallengeRequest = async (challengeId) => {
    try {
      await api.post(`/api/challenges/decline/${challengeId}/`);
      fetchChallengeRequests(); // Refresh the requests list
    } catch (error) {
      console.error("Error declining challenge request:", error);
      Alert.alert("Error", "Failed to decline challenge request.");
    }
  };

  const resubmitChallengeRequest = async (challengeId) => {
    try {
      await api.post(`/api/challenges/resubmit/${challengeId}/`);
      fetchChallengesDeclined(); // Refresh the declined list
      fetchRequestingChallenges(); // Refresh the requesting list
    } catch (error) {
      console.error("Error resubmitting challenge request:", error);
      Alert.alert("Error", "Failed to resubmit challenge request.");
    }
  };

  const deleteChallenge = async (challengeId) => {
    try {
      await api.post(`/api/challenges/delete/${challengeId}/`);
      fetchChallengesDeclined(); // Refresh the declined list
      fetchRequestingChallenges(); // Refresh the requesting list
    } catch (error) {
      console.error("Error deleting challenge:", error);
      Alert.alert("Error", "Failed to delete challenge.");
    }
  };

  return (
    <View style={styles.actionButtons}>
      {challenge.status === "pending" && (
        <>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={() => acceptChallengeRequest(challenge.id)}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.crossButton}
            onPress={() => declineChallengeRequest(challenge.id)}
          >
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </>
      )}
      {challenge.status === "declined" && (
        <>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={() => resubmitChallengeRequest(challenge.id)}
          >
            <Text style={styles.buttonText}>Resubmit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.crossButton}
            onPress={() => deleteChallenge(challenge.id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </>
      )}
      {challenge.status === "requesting" && (
        <TouchableOpacity
          style={styles.crossButton}
          onPress={() => deleteChallenge(challenge.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: "row",
    marginLeft: "auto",
    marginBottom: 10,
  },
  checkButton: {
    marginRight: 5,
    padding: 5,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  crossButton: {
    padding: 5,
    backgroundColor: "#F44336",
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default ChallengeRequestsActionBar;
