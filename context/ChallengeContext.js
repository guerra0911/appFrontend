import React, { createContext, useContext, useState, useCallback } from "react";
import api from "../api";

const ChallengeContext = createContext();

export const useChallengeContext = () => useContext(ChallengeContext);

export const ChallengeProvider = ({ children }) => {
  const [challengeRequests, setChallengeRequests] = useState([]);
  const [requestingChallenges, setRequestingChallenges] = useState([]);
  const [challengesDeclined, setChallengesDeclined] = useState([]);
  const [activeChallengesMade, setActiveChallengesMade] = useState([]);
  const [activeChallengesReceived, setActiveChallengesReceived] = useState([]);

  const fetchChallengeRequests = useCallback(async () => {
    try {
      const response = await api.get('/api/challenges/requests/');
      setChallengeRequests(response.data);
    } catch (error) {
      console.error('Error fetching challenge requests:', error);
    }
  }, []);

  const fetchRequestingChallenges = useCallback(async () => {
    try {
      const response = await api.get('/api/challenges/sent/');
      setRequestingChallenges(response.data);
    } catch (error) {
      console.error('Error fetching requesting challenges:', error);
    }
  }, []);

  const fetchChallengesDeclined = useCallback(async () => {
    try {
      const response = await api.get('/api/challenges/declined/');
      setChallengesDeclined(response.data);
    } catch (error) {
      console.error('Error fetching declined challenges:', error);
    }
  }, []);

  const acceptChallengeRequest = useCallback(async (challengeId) => {
    try {
      await api.post(`/api/challenges/accept/${challengeId}/`);
      fetchChallengeRequests();
    } catch (error) {
      console.error('Error accepting challenge request:', error);
    }
  }, [fetchChallengeRequests]);

  const declineChallengeRequest = useCallback(async (challengeId) => {
    try {
        await api.post(`/api/challenges/decline/${challengeId}/`);
      fetchChallengeRequests();
    } catch (error) {
      console.error('Error declining challenge request:', error);
    }
  }, [fetchChallengeRequests]);

  const resubmitChallengeRequest = useCallback(async (challengeId) => {
    try {
        await api.post(`/api/challenges/resubmit/${challengeId}/`);
      fetchChallengesDeclined();
    } catch (error) {
      console.error('Error resubmitting challenge request:', error);
    }
  }, [fetchChallengesDeclined]);

  const deleteChallenge = useCallback(async (challengeId) => {
    try {
        await api.post(`/api/challenges/delete/${challengeId}/`);
      fetchRequestingChallenges();
      fetchChallengesDeclined();
    } catch (error) {
      console.error('Error deleting challenge:', error);
    }
  }, [fetchRequestingChallenges, fetchChallengesDeclined]);

  const acceptAllChallengeRequests = useCallback(async () => {
    try {
      await api.post('/api/challenges/accept_all/');
      fetchChallengeRequests();
    } catch (error) {
      console.error('Error accepting all challenge requests:', error);
    }
  }, [fetchChallengeRequests]);

  const declineAllChallengeRequests = useCallback(async () => {
    try {
      await api.post('/api/challenges/decline_all/');
      fetchChallengeRequests();
    } catch (error) {
      console.error('Error declining all challenge requests:', error);
    }
  }, [fetchChallengeRequests]);

  const fetchActiveChallengesMade = useCallback(async () => {
    try {
      const response = await api.get('/api/challenges/active_challenges_made/');
      setActiveChallengesMade(response.data);
    } catch (error) {
      console.error('Error fetching active challenges made:', error);
    }
  }, []);

  const fetchActiveChallengesReceived = useCallback(async () => {
    try {
      const response = await api.get('/api/challenges/active_challenges_received/');
      setActiveChallengesReceived(response.data);
    } catch (error) {
      console.error('Error fetching active challenges received:', error);
    }
  }, []);

  return (
    <ChallengeContext.Provider
      value={{
        challengeRequests,
        requestingChallenges,
        challengesDeclined,
        activeChallengesMade,
        activeChallengesReceived,
        fetchChallengeRequests,
        fetchRequestingChallenges,
        fetchChallengesDeclined,
        acceptChallengeRequest,
        declineChallengeRequest,
        resubmitChallengeRequest,
        deleteChallenge,
        acceptAllChallengeRequests,
        declineAllChallengeRequests,
        fetchActiveChallengesMade,
        fetchActiveChallengesReceived,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};
