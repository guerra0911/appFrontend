import React from "react";
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
import { useEffect, useCallback, useState } from "react";
import { icons } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "../../context/GlobalProvider";
import ProfileCard from "../../components/ProfileCard";
import { PostList } from "../../components";
import Loader from "../../components/Loader";
import api from "../../api";
import CustomButton from "../../components/CustomButton";
import RenderModal from "./renderModal";
import EditProfileForm from "../../components/EditProfileForm";
import PrivateProfileIndicator from "../../components/PrivateProfileIndicator";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const { user, setUser, setIsLogged, loading, setLoading } =
    useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [requests, setRequests] = useState([]);
  const [requesting, setRequesting] = useState([]);
  const [blockedBy, setBlockedBy] = useState([]);
  const [blocking, setBlocking] = useState([]);
  const navigation = useNavigation();
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const navigateToProfile = (userId) => {
    setModalVisible(false);
    setRequestModalVisible(false);
    setBlockModalVisible(false);
    navigation.navigate("otherProfile", { userId });
  };

  const fetchUserProfile = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/profile/user/${id}/`);
      setUserData(response.data.userData);
      setUserProfile(response.data.profile);
      setPosts(response.data.posts);
      const timestamp = new Date().getTime();
      setProfilePic(`${response.data.profile.image}?timestamp=${timestamp}`);
      fetchRequests();
      fetchRequesting();
      fetchBlockedBy();
      fetchBlocking();
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert("Error", "Failed to fetch user profile.");
    } finally {
      setLoading(false);
    }
  };

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

  const openRequestsModal = () => {
    setModalTitle("Requests");
    fetchRequests();
    setRequestModalVisible(true);
  };

  const openRequestingModal = () => {
    setModalTitle("Requesting");
    fetchRequesting();
    setRequestModalVisible(true);
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

  const openBlockedByModal = () => {
    setModalTitle("Blocked By");
    fetchBlockedBy();
    setBlockModalVisible(true);
  };

  const openBlockingModal = () => {
    setModalTitle("Blocking");
    fetchBlocking();
    setBlockModalVisible(true);
  };

  const acceptFollowRequest = async (userId) => {
    try {
      await api.post(`/api/user/accept_follow/${userId}/`);
      fetchRequests(); // Refresh the requests list
    } catch (error) {
      console.error("Error accepting follow request:", error);
      Alert.alert("Error", "Failed to accept follow request.");
    }
  };

  const declineFollowRequest = async (userId) => {
    try {
      await api.post(`/api/user/decline_follow/${userId}/`);
      fetchRequests(); // Refresh the requests list
    } catch (error) {
      console.error("Error declining follow request:", error);
      Alert.alert("Error", "Failed to decline follow request.");
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
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Loader isLoading={loading} />
          <View style={styles.headerRow}>
          <TouchableOpacity
              style={styles.button}
              onPress={openBlockingModal}
            >
              <Text style={styles.buttonText}>Blocking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={openBlockedByModal}>
              <Text style={styles.buttonText}>Blocked By</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={openRequestingModal}
            >
              <Text style={styles.buttonText}>Requesting</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={openRequestsModal}>
              <Text style={styles.buttonText}>Requests</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Image
                source={icons.logout}
                resizeMode="contain"
                style={styles.logoutIcon}
              />
            </TouchableOpacity>
          </View>

          <RenderModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          >
            <EditProfileForm setModalVisible={setModalVisible} />
          </RenderModal>

          <RenderModal
            modalVisible={requestModalVisible}
            setModalVisible={setRequestModalVisible}
          >
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <ScrollView>
              {(modalTitle === "Requests" ? requests : requesting).map(
                (user, index, array) => (
                  <View key={user.id}>
                    <TouchableOpacity
                      onPress={() => navigateToProfile(user.id)}
                    >
                      <View style={styles.userContainer}>
                        <Image
                          source={{ uri: user.profile.image }}
                          style={styles.userImage}
                        />
                        <Text style={styles.userName}>@{user.username}</Text>
                        {modalTitle === "Requests" && (
                          <View style={styles.actionButtons}>
                            <TouchableOpacity
                              style={styles.checkButton}
                              onPress={() => acceptFollowRequest(user.id)}
                            >
                              <Text style={styles.buttonText}>✓</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.crossButton}
                              onPress={() => declineFollowRequest(user.id)}
                            >
                              <Text style={styles.buttonText}>✗</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                    {index < array.length - 1 && (
                      <View style={styles.separator} />
                    )}
                  </View>
                )
              )}
            </ScrollView>
          </RenderModal>

          <RenderModal
            modalVisible={blockModalVisible}
            setModalVisible={setBlockModalVisible}
          >
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <ScrollView>
              {(modalTitle === "Blocked By" ? blockedBy : blocking).map(
                (user, index, array) => (
                  <View key={user.id}>
                    <TouchableOpacity
                      onPress={() => navigateToProfile(user.id)}
                    >
                      <View style={styles.userContainer}>
                        <Image
                          source={{ uri: user.profile.image }}
                          style={styles.userImage}
                        />
                        <Text style={styles.userName}>@{user.username}</Text>
                      </View>
                    </TouchableOpacity>
                    {index < array.length - 1 && (
                      <View style={styles.separator} />
                    )}
                  </View>
                )
              )}
            </ScrollView>
          </RenderModal>

          {!loading && userProfile && userData && (
            <View style={styles.contentContainer}>
              <View style={styles.profileContainer}>
                <ProfileCard
                  userProfile={userProfile}
                  image={profilePic}
                  username={userData.username}
                  posts={posts.length}
                  followers={userProfile.followers.length}
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
              {!userProfile.privacy_flag || user?.id === userData.id ? (
                <View style={styles.postsContainer}>
                  <PostList userId={userData.id} />
                </View>
              ) : (
                <PrivateProfileIndicator />
              )}
            </View>
          )}
          {!loading && !userProfile && !userData && (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No user data available</Text>
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
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  button: {
    marginRight: 10,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
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
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  postsContainer: {
    marginTop: 10,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  flexGrow1: {
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 13,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    borderColor: "#DCDCDC",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginVertical: 5,
  },
  userImage: {
    borderWidth: 2,
    borderColor: "#69C3FF",
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    color: "black",
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: "#DCDCDC",
    marginVertical: 1,
    marginHorizontal: 13,
  },
  actionButtons: {
    flexDirection: "row",
    marginLeft: "auto",
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
});

export default Profile;
