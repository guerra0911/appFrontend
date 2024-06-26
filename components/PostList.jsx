import React, { useState, useCallback, useEffect } from "react";
import { ScrollView, View, Text, RefreshControl, TouchableOpacity, StyleSheet } from "react-native";
import PostCard from "./PostCard";
import api from "../api";
import { formatDistanceToNow } from 'date-fns';

const PostList = ({ posts, setPosts }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');

  const fetchPosts = async (sortOption) => {
    setRefreshing(true);
    try {
      const response = await api.get(`/api/notes/all/?sort_by=${sortOption}`);
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts(sortBy);
  }, [sortBy]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
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
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchPosts(sortBy)} />
        }
      >
        {posts.length > 0 ? (
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
