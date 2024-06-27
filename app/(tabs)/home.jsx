import { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Image, Text, View, RefreshControl, Alert } from "react-native";

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-primary" style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Loader isLoading={loading} />
          {!loading && username && (
            <>
              <View className="flex mt-2 mb-0 px-4 space-y-6">
                <View className="flex justify-between items-start flex-row mb-6">
                  <View>
                    <Text className="font-pmedium text-sm text-gray-100">
                      Welcome Back
                    </Text>
                    <Text className="text-2xl font-psemibold text-white">
                      {username}
                    </Text>
                  </View>
                  <View className="mt-1.5">
                    <Image
                      source={images.logoSmall}
                      className="w-9 h-10"
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View>
                  <PostList userId={null}/>
                </View>
              </ScrollView>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;
