import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  TouchableOpacity,
  Alert,
  Text,
  RefreshControl,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useRoute } from '@react-navigation/native';
import { useEffect, useCallback, useState } from "react";
import { icons } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "../context/GlobalProvider";
import { ProfileCard, PostList, Loader, CustomButton } from "../components";
import EditProfileForm from "../components/EditProfileForm";
import api from "../api";
import RenderModal from "./(tabs)/renderModal";

const OtherProfile = () => {
  const router = useRouter();
  const route = useRoute();
  const { userId } = route.params;
  // const { userId } = useLocalSearchParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const { user, setUser, setIsLogged, loading, setLoading } =
    useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  console.log("User:", user);
  console.log("Profile Picture URL:", user?.profile?.image);

  const fetchUserProfile = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/profile/user/${id}/`);
      setUserData(response.data.userData);
      setUserProfile(response.data.profile);
      setPosts(response.data.posts);
      const timestamp = new Date().getTime();
      setProfilePic(`${response.data.profile.image}?timestamp=${timestamp}`);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert("Error", "Failed to fetch user profile.");
    } finally {
      setLoading(false);
    }
  };  
  

  useEffect(() => {
    const fetchProfile = async () => {
      const id = userId || user?.id;
      if (id) {
        await fetchUserProfile(id);
      }
    };
  
    if (user) {
      fetchProfile();
    }
  }, [userId, user]);  

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (userId) {
      await fetchUserProfile(userId);
    } else {
      await fetchUserProfile(user.id);
    }
    setRefreshing(false);
  }, [userId, user]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      setUser(null);
      setIsLogged(false);
      router.replace("/sign-in");
    } catch (error) {
      Alert.alert("Logout Error", "An error occurred while trying to log out.");
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="bg-primary h-full">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Loader isLoading={loading} />
          <TouchableOpacity
            onPress={logout}
            className="flex w-full items-end mb-3 px-4 mt-5"
          >
            <Image
              source={icons.logout}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>

          <RenderModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          >
            <EditProfileForm setModalVisible={setModalVisible} />
          </RenderModal>

          {!loading && userProfile && userData && (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View className="w-full flex justify-center items-center mt-2 mb-5 px-4">
                <ProfileCard
                  image={profilePic}
                  username={userData.username}
                  posts={posts.length}
                  followers={userProfile.following.length}
                  following={userProfile.following.length}
                  rating={userProfile.rating}
                  button={
                    user?.id === userData.id && (
                      <CustomButton
                        title="Edit Profile"
                        handlePress={() => setModalVisible(true)}
                        containerStyles="mt-4 w-full flex justify-center items-center"
                        isLoading={loading}
                      />
                    )
                  }
                />
              </View>
              <View className="w-full px-4">
              <PostList userId={userData.id}/>
              </View>
            </ScrollView>
          )}
          {!loading && !userProfile && !userData && (
            <View className="flex-1 justify-center items-center">
              <Text className="text-white font-psemibold text-lg">
                No user data available
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default OtherProfile;