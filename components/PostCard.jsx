import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import api from '../api'; // Ensure the correct path to your api.js
import { useGlobalContext } from '../context/GlobalProvider'; // Ensure the correct path to your GlobalProvider.js

const PostCard = ({
  profilePicture,
  username,
  date,
  content,
  likes,
  dislikes,
  comments,
  post,
}) => {
  const navigation = useNavigation();
  const { user } = useGlobalContext(); // Accessing the current user
  const [likeCount, setLikeCount] = useState(likes.length);
  const [dislikeCount, setDislikeCount] = useState(dislikes.length);

  const navigateToProfile = () => {
    navigation.navigate("profile", { userId: post.author.id });
  };

  const handleLike = async () => {
    try {
      const response = await api.post(`/api/notes/${post.id}/like/`);
      setLikeCount(response.data.likes);
      setDislikeCount(response.data.dislikes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await api.post(`/api/notes/${post.id}/dislike/`);
      setLikeCount(response.data.likes);
      setDislikeCount(response.data.dislikes);
    } catch (error) {
      console.error(error);
    }
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
          <Text className="text-secondary-100 font-pregular text-lg ml-2">
            {likeCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-row items-center" onPress={handleDislike}>
          <FontAwesome name="thumbs-down" size={18} color="#FF0000" />
          <Text className="text-secondary-100 font-pregular text-lg ml-2">
            {dislikeCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-row items-center">
          <FontAwesome name="comment" size={18} color="#FFFFFF" />
          <Text className="text-secondary-100 font-pregular text-lg ml-2">
            {comments.length}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostCard;
