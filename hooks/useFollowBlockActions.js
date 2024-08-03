import { useState, useEffect } from "react";
import { Alert } from "react-native";
import api from '../api';

const useFollowBlockActions = () => {
  const [requests, setRequests] = useState([]);
  const [requesting, setRequesting] = useState([]);
  const [blockedBy, setBlockedBy] = useState([]);
  const [blocking, setBlocking] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await api.get(`/api/user/me/requests/`);
      setRequests(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRequesting = async () => {
    try {
      const response = await api.get(`/api/user/me/requesting/`);
      setRequesting(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBlockedBy = async () => {
    try {
      const response = await api.get(`/api/user/me/blocked_by/`);
      setBlockedBy(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBlocking = async () => {
    try {
      const response = await api.get(`/api/user/me/blocking/`);
      setBlocking(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const acceptFollowRequest = async (userId) => {
    try {
      await api.post(`/api/user/accept_follow/${userId}/`);
      fetchRequests();
    } catch (error) {
      console.error("Error accepting follow request:", error);
      Alert.alert("Error", "Failed to accept follow request.");
    }
  };

  const declineFollowRequest = async (userId) => {
    try {
      await api.post(`/api/user/decline_follow/${userId}/`);
      fetchRequests();
    } catch (error) {
      console.error("Error declining follow request:", error);
      Alert.alert("Error", "Failed to decline follow request.");
    }
  };

  return {
    requests,
    requesting,
    blockedBy,
    blocking,
    fetchRequests,
    fetchRequesting,
    fetchBlockedBy,
    fetchBlocking,
    acceptFollowRequest,
    declineFollowRequest,
  };
};

export default useFollowBlockActions;
