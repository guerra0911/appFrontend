import React from "react";
import { View, StyleSheet, Text } from "react-native";
import StatusActionButton from "./StatusActionButton";
import { useChallengeContext } from "../context/ChallengeContext";

const StatusButtonBar = ({ challengeId, buttonTypes = [] }) => {
  const {
    acceptChallengeRequest,
    declineChallengeRequest,
    resubmitChallengeRequest,
    deleteChallenge,
    fetchChallengeRequests,
    fetchRequestingChallenges,
    fetchChallengesDeclined,
  } = useChallengeContext();

  return (
    <View style={styles.actionButtonsContainer}>
      <Text style={styles.vsText}>VS</Text>
      {buttonTypes.includes("accept") && (
        <StatusActionButton
          text="Accept"
          color="#4CAF50"
          onPress={() => {
            acceptChallengeRequest(challengeId);
            fetchChallengeRequests();
          }}
        />
      )}
      {buttonTypes.includes("decline") && (
        <StatusActionButton
          text="Decline"
          color="#F44336"
          onPress={() => {
            declineChallengeRequest(challengeId);
            fetchChallengeRequests();
          }}
        />
      )}
      {buttonTypes.includes("resubmit") && (
        <StatusActionButton
          text="Resubmit"
          color="#FF9800"
          onPress={() => {
            resubmitChallengeRequest(challengeId);
            fetchChallengesDeclined();
          }}
        />
      )}
      {buttonTypes.includes("delete") && (
        <StatusActionButton
          text="Delete"
          color="#F44336"
          onPress={() => {
            deleteChallenge(challengeId);
            fetchRequestingChallenges();
            fetchChallengesDeclined();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonsContainer: {
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    borderColor: "#DCDCDC",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    padding: 4,
  },
  vsText: {
    fontSize: 12,
    color: "#000",
    marginRight: 8,
    marginLeft: 8,
  },
});

export default StatusButtonBar;
