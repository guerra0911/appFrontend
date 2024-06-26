import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import api from '../api'; // Ensure the correct path to your api.js
import { useGlobalContext } from '../context/GlobalProvider'; // Ensure the correct path to your GlobalProvider.js
import RenderModal from "../app/(tabs)/renderModal";

const PostCard = ({
  profilePicture,
  username,
  date,
  content,
  likes,
  dislikes,
  comments,
  post,
  onLikeDislikeUpdate,
}) => {
  const navigation = useNavigation();
  const { user, posts, setPosts } = useGlobalContext(); // Accessing the current user and posts
  const [likeCount, setLikeCount] = useState(likes.length);
  const [dislikeCount, setDislikeCount] = useState(dislikes.length);
  const [likedBy, setLikedBy] = useState([]);
  const [dislikedBy, setDislikedBy] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const navigateToProfile = () => {
    navigation.navigate("profile", { userId: post.author.id });
  };

  const updatePostLikesDislikes = (updatedPost) => {
    setPosts((prevPosts) => 
      prevPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  const handleLike = async () => {
    try {
      const response = await api.post(`/api/notes/${post.id}/like/`);
      setLikeCount(response.data.likes);
      setDislikeCount(response.data.dislikes);
      updatePostLikesDislikes(response.data); // Update global state
      onLikeDislikeUpdate(); // Trigger a refresh of the posts
    } catch (error) {
      console.error(error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await api.post(`/api/notes/${post.id}/dislike/`);
      setLikeCount(response.data.likes);
      setDislikeCount(response.data.dislikes);
      updatePostLikesDislikes(response.data); // Update global state
      onLikeDislikeUpdate(); // Trigger a refresh of the posts
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLikedBy = async () => {
    try {
      const response = await api.get(`/api/notes/${post.id}/liked_by/`);
      setLikedBy(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDislikedBy = async () => {
    try {
      const response = await api.get(`/api/notes/${post.id}/disliked_by/`);
      setDislikedBy(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openLikedByModal = () => {
    setModalTitle('Liked By');
    fetchLikedBy();
    setModalVisible(true);
  };

  const openDislikedByModal = () => {
    setModalTitle('Disliked By');
    fetchDislikedBy();
    setModalVisible(true);
  };

  return (
    <View className="w-full bg-black-200 rounded-xl p-6 mb-4">
      <View className="flex flex-row items-center mb-4">
        <TouchableOpacity
          onPress={navigateToProfile}
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-secondary mr-4"
        >
          <Image
            source={{ uri: profilePicture }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View>
          <Text
            className="text-white font-pbold text-lg"
            onPress={navigateToProfile}
          >
            @{username}
          </Text>
          <Text className="text-gray-100 font-pregular text-sm">{date}</Text>
        </View>
      </View>

      <Text className="text-white font-pregular text-lg mb-4">{content}</Text>

      <View className="flex flex-row justify-around mt-4">
        <TouchableOpacity className="flex flex-row items-center" onPress={handleLike}>
          <FontAwesome name="thumbs-up" size={18} color="#80FFDB" />
          <TouchableOpacity onPress={openLikedByModal}>
            <Text className="text-secondary-100 font-pregular text-lg ml-2">
              {likeCount}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-row items-center" onPress={handleDislike}>
          <FontAwesome name="thumbs-down" size={18} color="#FF0000" />
          <TouchableOpacity onPress={openDislikedByModal}>
            <Text className="text-secondary-100 font-pregular text-lg ml-2">
              {dislikeCount}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-row items-center">
          <FontAwesome name="comment" size={18} color="#FFFFFF" />
          <Text className="text-secondary-100 font-pregular text-lg ml-2">
            {comments.length}
          </Text>
        </TouchableOpacity>
      </View>

      <RenderModal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <Text style={styles.modalTitle}>{modalTitle}</Text>
        <ScrollView>
          {(modalTitle === 'Liked By' ? likedBy : dislikedBy).map(user => (
            <View key={user.id} style={styles.userContainer}>
              <Image source={{ uri: user.profile.image }} style={styles.userImage} />
              <Text style={styles.userName}>{user.username}</Text>
            </View>
          ))}
        </ScrollView>
      </RenderModal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#444",
    borderRadius: 10,
    marginVertical: 5,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    color: "#fff",
    fontSize: 18,
  },
});

export default PostCard;
