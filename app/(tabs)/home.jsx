import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Image, Text, View, RefreshControl, Alert, StyleSheet } from "react-native";

import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";
import { PostList } from "../../components";
import Loader from "../../components/Loader";
import api from "../../api";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { userId } = useLocalSearchParams();
  const [username, setUsername] = useState(null);
  const { user, setUser, setIsLogged, loading, setLoading, setPosts } =
    useGlobalContext();

  const fetchUsername = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/user/me/');
      setUsername(res.data.username);
    } catch (error) {
      console.error("Error fetching username:", error);
      Alert.alert("Error", "Failed to fetch username.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const id = userId || user?.id;
      if (id) {
        await fetchUsername();
      }
    };
  
    if (user) {
      fetchUser();
    }

    // Clear posts when navigating away
    return () => {
      setPosts([]); 
    };
  }, [userId, user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchUsername();
    setRefreshing(false);
  }, [userId, user]);

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
          {!loading && username && (
            <>
              <View style={styles.welcomeContainer}>
                <View style={styles.headerContainer}>
                  <View>
                    <Text style={styles.welcomeText}>
                      Welcome Back
                    </Text>
                    <Text style={styles.usernameText}>
                      {username}
                    </Text>
                  </View>
                  <View style={styles.logoContainer}>
                    <Image
                      source={images.logoSmall}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View>
                  <PostList userId={null}/>
                </View>
              </ScrollView>
            </>
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
  safeArea: {
    backgroundColor: '#F5F5F5', // Equivalent to bg-primary
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  welcomeContainer: {
    marginTop: 65, // Equivalent to mt-2
    marginBottom: 0, // Equivalent to mb-0
    paddingHorizontal: 16, // Equivalent to px-4
    spaceY: 24, // Equivalent to space-y-6
  },
  headerContainer: {
    flexDirection: 'row', // Equivalent to flex-row
    justifyContent: 'space-between', // Equivalent to justify-between
    alignItems: 'flex-start', // Equivalent to items-start
    marginBottom: 24, // Equivalent to mb-6
  },
  welcomeText: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'psemibold', // Equivalent to font-psemibold
    fontWeight: "bold",
  },
  usernameText: {
    fontSize: 24, // Equivalent to text-2xl
    fontFamily: 'psemibold', // Equivalent to font-psemibold
    color: 'black', 
    fontWeight: "bold",
  },
  logoContainer: {
    marginTop: 6, // Equivalent to mt-1.5
  },
  logo: {
    width: 36, // Equivalent to w-9
    height: 40, // Equivalent to h-10
  },
});

export default Home;
