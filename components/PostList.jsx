import React, { useState, useCallback, useEffect } from "react";
import { ScrollView, View, Text, RefreshControl, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import PostCard from "./PostCard";
import { useGlobalContext } from '../context/GlobalProvider';
import { formatDistanceToNow } from 'date-fns';

const PostList = ({ userId }) => {
  const { posts, fetchPosts } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [loading, setLoading] = useState(true);  // New loading state

  const fetchData = async (sortOption) => {
    setLoading(true);  // Set loading to true
    await fetchPosts(userId, sortOption);
    setLoading(false);  // Set loading to false after fetching
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData(sortBy);
    }, [sortBy, userId])
  );

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const onLikeDislikeUpdate = () => {
    fetchData(sortBy);
  };

  return (
    <>
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
              onLikeDislikeUpdate={onLikeDislikeUpdate}
            />
          ))
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
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
    backgroundColor: '#333',
  },
  activeSortButton: {
    backgroundColor: '#80FFDB',
  },
  sortButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PostList;
