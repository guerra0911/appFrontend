import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostCard from "./PostCard";
import ChallengeCardStacked from "./ChallengeCardStacked";
import SubCard from "./SubCard";
import { useGlobalContext } from "../context/GlobalProvider";
import PostLoadingIndicator from "./PostLoadingIndicator";

const PostList = ({ userId = null }) => {
  const {
    posts,
    fetchAllCombinedPosts,
    fetchUserCombinedPosts,
    fetchFollowingCombinedPosts,
    setPosts,
  } = useGlobalContext();
  
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("all");

  const [challengesToMeasure, setChallengesToMeasure] = useState(0);
  const [challengesMeasured, setChallengesMeasured] = useState(0);
  const [allChallengesMeasured, setAllChallengesMeasured] = useState(false);
  const challengesMeasuredRef = useRef(0);

  useEffect(() => {
    const loadPreferences = async () => {
      console.log("Loading Preferences");
      try {
        const storedView = await AsyncStorage.getItem("view");
        const storedSortBy = await AsyncStorage.getItem("sortBy");
        if (storedView) setView(storedView);
        if (storedSortBy) setSortBy(storedSortBy);
        console.log("Set Stored and SortBy Views");
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };
    loadPreferences();
  }, []);

  const savePreferences = async (view, sortBy) => {
    console.log("Saving Preferences");
    try {
      await AsyncStorage.setItem("view", view);
      await AsyncStorage.setItem("sortBy", sortBy);
      console.log("Preferences Saved");
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const fetchData = async (sortOption) => {
    setLoading(true);
    setAllChallengesMeasured(false);
    console.log("Setting All Challenges Measured = False");
    try {
      if (userId) {
        await fetchUserCombinedPosts(userId, sortOption);
      } else if (view === "all") {
        await fetchAllCombinedPosts(sortOption);
      } else {
        await fetchFollowingCombinedPosts(sortOption);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (posts.length > 0) {
      const challengesCount = posts.filter(post => post.challenger_note).length;
      setChallengesToMeasure(challengesCount);
      setChallengesMeasured(0);
      challengesMeasuredRef.current = 0;
      console.log(`${challengesCount} to be Measured, Currently Measured 0`);
    }
  }, [posts]);

  const incrementChallengesMeasured = () => {
    challengesMeasuredRef.current += 1;
    console.log(`${challengesMeasuredRef.current} Measured. Need to Measure ${challengesToMeasure}`);
    if (challengesMeasuredRef.current >= challengesToMeasure) {
      setTimeout(() => {
        setAllChallengesMeasured(true);
      }, 4); // Increased delay for visibility
      console.log("All Challenges Measured!");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData(sortBy);
      return () => {
        // Reset states when leaving the screen
        setPosts([]); // Clear posts when navigating away
        setChallengesToMeasure(0);
        setChallengesMeasured(0);
        setAllChallengesMeasured(false);
        challengesMeasuredRef.current = 0;
      };
    }, [sortBy, userId, view])
  );

  const handleSortChange = (newSortBy) => {
    console.log("Handling Sort Change");
    setSortBy(newSortBy);
    savePreferences(view, newSortBy);
  };

  const onLikeDislikeUpdate = () => {
    fetchData(sortBy);
  };

  const handleViewChange = (newView) => {
    console.log("Handling View Change");
    setView(newView);
    savePreferences(newView, sortBy);
  };

  const renderPost = (post) => {
    if (post.challenger_note) {
      return (
        <View key={`challenge-${post.id}`}>
          <ChallengeCardStacked challenge={post} onLikeDislikeUpdate={onLikeDislikeUpdate} onMeasurement={incrementChallengesMeasured}/>
        </View>
      );
    } else if (post.sub_note) {
      return <SubCard key={`sub-${post.id}`} sub={post} onLikeDislikeUpdate={onLikeDislikeUpdate} />;
    } else {
      return (
        <PostCard
          key={`post-${post.id}`}
          post={post}
          onLikeDislikeUpdate={onLikeDislikeUpdate}
        />
      );
    }
  };

  return (
    <>
      {!userId && (
        <View style={styles.viewButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.viewButton,
              view === "all" && styles.activeViewButton,
            ]}
            onPress={() => handleViewChange("all")}
          >
            <Text style={styles.viewButtonText}>All Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewButton,
              view === "following" && styles.activeViewButton,
            ]}
            onPress={() => handleViewChange("following")}
          >
            <Text style={styles.viewButtonText}>Following</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.sortButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "created_at" && styles.activeSortButton,
          ]}
          onPress={() => handleSortChange("created_at")}
        >
          <Text style={styles.sortButtonText}>Newest</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "most_likes" && styles.activeSortButton,
          ]}
          onPress={() => handleSortChange("most_likes")}
        >
          <Text style={styles.sortButtonText}>Hottest</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "most_dislikes" && styles.activeSortButton,
          ]}
          onPress={() => handleSortChange("most_dislikes")}
        >
          <Text style={styles.sortButtonText}>Coldest</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, position: 'relative' }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 50 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchData(sortBy)}
            />
          }
        >
          {posts.length > 0 ? (
            posts.map((post) => renderPost(post))
          ) : (
            !loading && (
              <View
                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
              >
                <Text style={{ color: "white", fontWeight: "600", fontSize: 18 }}>
                  No posts available
                </Text>
              </View>
            )
          )}
        </ScrollView>

        {/* Render the custom PostLoadingIndicator component */}
        <PostLoadingIndicator isVisible={loading || !allChallengesMeasured} />
      </View>
    </>
  );  
};

const styles = StyleSheet.create({
  viewButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    marginHorizontal: 16,
  },
  viewButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#69C3FF",
  },
  activeViewButton: {
    backgroundColor: "#007EFF",
  },
  viewButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sortButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    marginHorizontal: 16,
  },
  sortButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#69C3FF",
  },
  activeSortButton: {
    backgroundColor: "#007EFF",
  },
  sortButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PostList;
