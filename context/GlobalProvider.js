import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../api"; // Make sure this is the correct path to your api.js

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const checkCurrentUser = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        api.setAuthToken(token);
        const res = await api.get('/api/user/me/');
        if (res.status === 200) {
          setIsLogged(true);
          setUser(res.data);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      } else {
        setIsLogged(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLogged(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (userId, sortBy = 'created_at') => {
    try {
      const response = userId
        ? await api.get(`/api/notes/user/${userId}/?sort_by=${sortBy}`)
        : await api.get(`/api/notes/all/?sort_by=${sortBy}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchFollowingPosts = async (sortBy = 'created_at') => {
    try {
      const response = await api.get(`/api/notes/following/?sort_by=${sortBy}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching following posts:', error);
    }
  };

  const fetchAllCombinedPosts = async (sortBy = 'created_at') => {
    try {
      const response = await api.get(`/api/notes/all/combined/?sort_by=${sortBy}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching all combined posts:', error);
    }
  };

  const fetchUserCombinedPosts = async (userId, sortBy = 'created_at') => {
    try {
      const response = await api.get(`/api/notes/user/${userId}/combined/?sort_by=${sortBy}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching user combined posts:', error);
    }
  };

  const fetchFollowingCombinedPosts = async (sortBy = 'created_at') => {
    try {
      const response = await api.get(`/api/notes/following/combined/?sort_by=${sortBy}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching following combined posts:', error);
    }
  };
  

  useEffect(() => {
    checkCurrentUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        setLoading,
        checkCurrentUser,
        posts,
        setPosts,
        fetchPosts,
        fetchFollowingPosts,
        fetchAllCombinedPosts,
        fetchUserCombinedPosts,
        fetchFollowingCombinedPosts,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
