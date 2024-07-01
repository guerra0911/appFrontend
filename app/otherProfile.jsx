import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  TouchableOpacity,
  Alert,
  Text,
  RefreshControl,
  StyleSheet,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute, useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation();
  const { userId } = route.params;
  const [userProfile, setUserProfile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const { user, setUser, setIsLogged, loading, setLoading } =
    useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

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
    <GestureHandlerRootView style={styles.flex1}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="arrow-left" size={24} color="#69C3FF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Loader isLoading={loading} />

          <RenderModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          >
            <EditProfileForm setModalVisible={setModalVisible} />
          </RenderModal>

          {!loading && userProfile && userData && (
            <View style={styles.contentContainer}>
              <View style={styles.profileContainer}>
                <ProfileCard
                  image={profilePic}
                  username={userData.username}
                  posts={posts.length}
                  followers={userProfile.following.length}
                  following={userProfile.following.length}
                  rating={userProfile.rating}
                  spotifyLink={userProfile.spotify_url}
                  imdbLink={userProfile.imdb_url}
                  websiteLink={userProfile.website_url}
                  bio={userProfile.bio}
                  button={
                    user?.id === userData.id && (
                      <CustomButton
                        title="Edit Profile"
                        handlePress={() => setModalVisible(true)}
                        containerStyles={styles.editButtonContainer}
                        isLoading={loading}
                      />
                    )
                  }
                />
              </View>
              <View style={styles.postsContainer}>
                <PostList userId={userData.id} />
              </View>
            </View>
          )}
          {!loading && !userProfile && !userData && (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                No user data available
              </Text>
            </View>
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
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  backButton: {
    padding: 10,
  },
  logoutButton: {
    padding: 10,
  },
  logoutIcon: {
    width: 24,
    height: 24,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  editButtonContainer: {
    marginTop: 16,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postsContainer: {
    marginTop: 10,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  flexGrow1: {
    flexGrow: 1,
  },
});

export default OtherProfile;
