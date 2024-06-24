import React, { useState, useCallback } from "react";
import { ScrollView, View, Text, RefreshControl } from "react-native";
import PostCard from "./PostCard";
import api from "../api";

const PostList = ({ posts, setPosts }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await api.get("/api/notes/all/"); // Using the fetchAllPosts function from your API
      setPosts(response.data); // Update the posts state with the new data
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [setPosts]);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 50 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post.id}
            username={post.author}
            date={post.created_at}
            content={post.content}
            likes={post.likes}
            dislikes={post.dislikes}
            comments={post.comments}
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
  );
};

export default PostList;
