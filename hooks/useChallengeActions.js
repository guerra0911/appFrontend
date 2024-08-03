import { useState, useEffect } from "react";
import { Alert } from "react-native";
import api from '../api';

const useChallengeActions = () => {
  const [challengeRequests, setChallengeRequests] = useState([]);
  const [challengesDeclined, setChallengesDeclined] = useState([]);
  const [requestingChallenges, setRequestingChallenges] = useState([]);

  const fetchChallengeRequests = async () => {
    try {
      const response = await api.get(`/api/challenges/requests/`);
      setChallengeRequests(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRequestingChallenges = async () => {
    try {
      const response = await api.get(`/api/challenges/requesting/`);
      setRequestingChallenges(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChallengesDeclined = async () => {
    try {
      const response = await api.get(`/api/challenges/declined/`);
      setChallengesDeclined(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const acceptChallengeRequest = async (challengeId) => {
    try {
      await api.post(`/api/challenges/accept/${challengeId}/`);
      fetchChallengeRequests();
    } catch (error) {
      console.error("Error accepting challenge request:", error);
      Alert.alert("Error", "Failed to accept challenge request.");
    }
  };

  const declineChallengeRequest = async (challengeId) => {
    try {
      await api.post(`/api/challenges/decline/${challengeId}/`);
      fetchChallengeRequests();
    } catch (error) {
      console.error("Error declining challenge request:", error);
      Alert.alert("Error", "Failed to decline challenge request.");
    }
  };

  const resubmitChallengeRequest = async (challengeId) => {
    try {
      await api.post(`/api/challenges/resubmit/${challengeId}/`);
      fetchChallengesDeclined();
      fetchRequestingChallenges();
    } catch (error) {
      console.error("Error resubmitting challenge request:", error);
      Alert.alert("Error", "Failed to resubmit challenge request.");
    }
  };

  const deleteChallenge = async (challengeId) => {
    try {
      await api.post(`/api/challenges/delete/${challengeId}/`);
      fetchChallengesDeclined();
      fetchRequestingChallenges();
    } catch (error) {
      console.error("Error deleting challenge:", error);
      Alert.alert("Error", "Failed to delete challenge.");
    }
  };

  return {
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
  };
};

export default useChallengeActions;
