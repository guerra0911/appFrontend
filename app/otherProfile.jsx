import React, { useEffect, useCallback, useState } from "react";
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
  Modal,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { icons } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "../context/GlobalProvider";
import { ProfileCard, PostList, Loader, CustomButton } from "../components";
import EditProfileForm from "../components/EditProfileForm";
import api from "../api";
import RenderModal from "./(tabs)/renderModal";
import { Ionicons } from "@expo/vector-icons";
import PrivateProfileIndicator from "../components/PrivateProfileIndicator";

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
  const [followStatus, setFollowStatus] = useState(null);
  const [blockStatus, setBlockStatus] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false); // New state for dropdown visibility

  const fetchUserProfile = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/profile/user/${id}/`);
      setUserData(response.data.userData);
      setUserProfile(response.data.profile);
      setPosts(response.data.posts);
      const timestamp = new Date().getTime();
      setProfilePic(`${response.data.profile.image}?timestamp=${timestamp}`);
      updateBlockStatus(response.data.profile);
      updateFollowStatus(response.data.profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert("Error", "Failed to fetch user profile.");
    } finally {
      setLoading(false);
    }
  };

  const updateFollowStatus = (profile) => {
    const followers = profile.followers || [];
    const followRequests = profile.requests || [];

    if (followers.includes(user.username)) {
      setFollowStatus("Following");
    } else if (followRequests.includes(user.username)) {
      setFollowStatus("Requested");
    } else {
      setFollowStatus("Follow");
    }
  };

  const updateBlockStatus = (profile) => {
    const blocking = profile.blocking || [];
    const blocked_by = profile.blocked_by || [];

    if (blocking.includes(user.username)) {
      setBlockStatus("This User Has Blocked You");
    } else if (blocked_by.includes(user.username)) {
      setBlockStatus("You are Blocking this User");
    } else {
      setBlockStatus("No Block");
    }
  };

  const handleFollow = async () => {
    try {
      const response = await api.post(`/api/user/follow/${userId}/`);
      if (response.data.status === "request_sent") {
        setFollowStatus("Requested");
      } else if (response.data.status === "following") {
        setFollowStatus("Following");
      }
    } catch (error) {
      console.error("Error following user:", error);
      Alert.alert("Error", "Failed to follow user.");
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await api.post(`/api/user/unfollow/${userId}/`);
      setFollowStatus("Follow");
    } catch (error) {
      console.error("Error unfollowing user:", error);
      Alert.alert("Error", "Failed to unfollow user.");
    }
  };

  const handleUnrequest = async () => {
    try {
      const response = await api.post(`/api/user/unrequest/${userId}/`);
      setFollowStatus("Follow");
    } catch (error) {
      console.error("Error unrequesting user:", error);
      Alert.alert("Error", "Failed to unrequest user.");
    }
  };

  const handleBlock = async () => {
    try {
      const response = await api.post(`/api/user/block/${userId}/`);
      setBlockStatus("You are Blocking this User");
      fetchUserProfile(userId); // Refresh the profile
    } catch (error) {
      console.error("Error blocking user:", error);
      Alert.alert("Error", "Failed to block user.");
    }
  };

  const handleUnblock = async () => {
    try {
      const response = await api.post(`/api/user/unblock/${userId}/`);
      setBlockStatus("No Block");
      fetchUserProfile(userId); // Refresh the profile
    } catch (error) {
      console.error("Error unblocking user:", error);
      Alert.alert("Error", "Failed to unblock user.");
    }
  };

  const fetchProfile = async () => {
    const id = userId || user?.id;
    if (id) {
      await fetchUserProfile(id);
    }
  };

  useEffect(() => {
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

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setDropdownVisible(true)}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#69C3FF" />
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
                    user?.id === userData.id ? (
                      <CustomButton
                        title="Edit Profile"
                        handlePress={() => setModalVisible(true)}
                        containerStyles={styles.editButtonContainer}
                        isLoading={loading}
                      />
                    ) : blockStatus === "This User Has Blocked You" ? (
                      <View style={styles.blockMessageContainer}>
                        <Text style={styles.blockMessageText}>
                          This User has Blocked You
                        </Text>
                      </View>
                    ) : blockStatus === "You are Blocking this User" ? (
                      <View style={styles.blockMessageContainer}>
                        <Text style={styles.blockMessageText}>
                          You are Blocking this User
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <CustomButton
                          title={followStatus}
                          handlePress={() => {
                            if (followStatus === "Follow") {
                              handleFollow();
                            } else if (followStatus === "Requested") {
                              handleUnrequest();
                            } else if (followStatus === "Following") {
                              handleUnfollow();
                            }
                          }}
                          containerStyles={styles.editButtonContainer}
                          isLoading={loading}
                        />
                      </View>
                    )
                  }
                  isPrivate={userProfile.privacy_flag}
                  isFollowing={followStatus === "Following"}
                  isOwnProfile={user?.id === userData.id}
                  blockStatus={blockStatus}
                />
              </View>
              {blockStatus === "No Block" &&
                (!userProfile.privacy_flag || user?.id === userData.id) ? (
                <View style={styles.postsContainer}>
                  <PostList userId={userData.id} />
                </View>
              ) : blockStatus === "This User Has Blocked You" ||
                blockStatus === "You are Blocking this User" ? (
                <View style={styles.blockMessageContainer}>
                  <Text style={styles.blockMessageText}>
                    {blockStatus === "This User Has Blocked You"
                      ? "This User has Blocked You"
                      : "You are Blocking this User"}
                  </Text>
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

        {/* Dropdown Menu */}
        <Modal
          transparent={true}
          visible={dropdownVisible}
          onRequestClose={() => setDropdownVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setDropdownVisible(false)}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  if (blockStatus === "No Block") {
                    handleBlock();
                  } else if (blockStatus === "You are Blocking this User") {
                    handleUnblock();
                  } else if (blockStatus === "This User Has Blocked You") {
                    // Do Nothing
                  }
                  setDropdownVisible(false);
                }}
              >
                <Text style={styles.dropdownItemText}>
                  {blockStatus === "No Block"
                    ? "Block User"
                    : blockStatus === "You are Blocking this User"
                      ? "Unblock User"
                      : "Blocked"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  backButton: {
    padding: 10,
  },
  menuButton: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  dropdownItemText: {
    fontSize: 18,
    color: "#69C3FF",
  },
  blockMessageContainer: {
    marginTop: 16,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  blockMessageText: {
    fontSize: 16,
    color: "red",
  },
});

export default OtherProfile;
