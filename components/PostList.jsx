import React, { useState, useCallback, useEffect } from "react";
import { ScrollView, View, Text, RefreshControl, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostCard from "./PostCard";
import { useGlobalContext } from '../context/GlobalProvider';
import { formatDistanceToNow } from 'date-fns';

const PostList = ({ userId = null }) => {
  const { posts, fetchPosts, fetchFollowingPosts } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('all'); // Add view state

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedView = await AsyncStorage.getItem('view');
        const storedSortBy = await AsyncStorage.getItem('sortBy');
        if (storedView) setView(storedView);
        if (storedSortBy) setSortBy(storedSortBy);
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };
    loadPreferences();
  }, []);

  const savePreferences = async (view, sortBy) => {
    try {
      await AsyncStorage.setItem('view', view);
      await AsyncStorage.setItem('sortBy', sortBy);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const fetchData = async (sortOption) => {
    setLoading(true);
    if (view === 'all') {
      await fetchPosts(userId, sortOption);
    } else {
      await fetchFollowingPosts(sortOption);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData(sortBy);
    }, [sortBy, userId, view]) // Add view as a dependency
  );

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    savePreferences(view, newSortBy);
  };

  const onLikeDislikeUpdate = () => {
    fetchData(sortBy);
  };

  const handleViewChange = (newView) => {
    setView(newView);
    savePreferences(newView, sortBy);
  };

  return (
    <>
      <View style={styles.viewButtonsContainer}>
        <TouchableOpacity
          style={[styles.viewButton, view === 'all' && styles.activeViewButton]}
          onPress={() => handleViewChange('all')}
        >
          <Text style={styles.viewButtonText}>All Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, view === 'following' && styles.activeViewButton]}
          onPress={() => handleViewChange('following')}
        >
          <Text style={styles.viewButtonText}>Following</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sortButtonsContainer}>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'created_at' && styles.activeSortButton]}
          onPress={() => handleSortChange('created_at')}
        >
          <Text style={styles.sortButtonText}>Newest</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'most_likes' && styles.activeSortButton]}
          onPress={() => handleSortChange('most_likes')}
        >
          <Text style={styles.sortButtonText}>Hottest</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'most_dislikes' && styles.activeSortButton]}
          onPress={() => handleSortChange('most_dislikes')}
        >
          <Text style={styles.sortButtonText}>Coldest</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 50 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchData(sortBy)} />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              profilePicture={post.author.profile.image}
              username={post.author.username}
              date={formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              content={post.content}
              likes={post.likes}
              dislikes={post.dislikes}
              comments={post.comments}
              post={post}
              images={[post.image1, post.image2, post.image3]} // Pass images here
              onLikeDislikeUpdate={onLikeDislikeUpdate}
            />
          ))
        ) : (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "white", fontWeight: "600", fontSize: 18 }}>
              No posts available
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  viewButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    marginHorizontal: 16,
  },
  viewButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#69C3FF',
  },
  activeViewButton: {
    backgroundColor: '#007EFF',
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sortButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    marginHorizontal: 16,
  },
  sortButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#69C3FF',
  },
  activeSortButton: {
    backgroundColor: '#007EFF',
  },
  sortButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PostList;
