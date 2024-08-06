import React, { useEffect, useCallback, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Image, TouchableOpacity, Alert, Text, RefreshControl, StyleSheet, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
import ChallengeStatusButton from "../../components/ChallengeStatusButton";
import FollowStatusButton from "../../components/FollowStatusButton";
import BlockingStatusButton from "../../components/BlockingStatusButton";
import useChallengeActions from "../../hooks/useChallengeActions";
import useFollowBlockActions from "../../hooks/useFollowBlockActions";
import { icons } from "../../constants";

const Profile = () => {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const { user, setUser, setIsLogged, loading, setLoading } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const navigation = useNavigation();

  const {
    fetchRequests,
    fetchRequesting,
    fetchBlockedBy,
    fetchBlocking,
  } = useFollowBlockActions();

  const {
    fetchChallengeRequests,
    fetchRequestingChallenges,
    fetchChallengesDeclined,
  } = useChallengeActions();

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
      fetchChallengeRequests();
      fetchRequestingChallenges();
      fetchChallengesDeclined();
      console.log("AAC = ", response.data.profile.auto_accept_challenges);
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
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Loader isLoading={loading} />
          <View style={styles.headerRow}>
            <BlockingStatusButton type="Blocking" />
            <BlockingStatusButton type="Blocked By" />
            <FollowStatusButton type="Requesting" />
            <FollowStatusButton type="Requests" />
            <ChallengeStatusButton type="Sent" />
            <ChallengeStatusButton type="Requests" />
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Image source={icons.logout} resizeMode="contain" style={styles.logoutIcon} />
            </TouchableOpacity>
          </View>

          <RenderModal modalVisible={modalVisible} setModalVisible={setModalVisible}>
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
                    user?.id === userData.id && (
                      <CustomButton
                        title="Edit Profile"
                        handlePress={() => setModalVisible(true)}
                        containerStyles={styles.editButtonContainer}
                        isLoading={loading}
                      />
                    )
                  }
                  blockStatus={"No Block"}
                  isOwnProfile={true}
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
  logoutButton: {
    padding: 10,
  },
  logoutIcon: {
    width: 24,
    height: 24,
  },
});

export default Profile;
