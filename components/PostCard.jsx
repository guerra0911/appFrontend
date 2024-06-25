import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

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

  const navigateToProfile = () => {
    navigation.navigate("profile", { userId: post.author.id });
  };

  return (
    <View className="w-full bg-black-200 rounded-xl p-6 mb-4">
      {/* Header: Profile Picture and Username */}
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

      {/* Content */}
      <Text className="text-white font-pregular text-lg mb-4">{content}</Text>

      {/* Footer: Likes, Dislikes, Comments */}
      <View className="flex flex-row justify-around mt-4">
        <TouchableOpacity className="flex flex-row items-center">
          <FontAwesome name="thumbs-up" size={18} color="#80FFDB" />
          <Text className="text-secondary-100 font-pregular text-lg ml-2">
            {likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-row items-center">
          <FontAwesome name="thumbs-down" size={18} color="#FF0000" />
          <Text className="text-secondary-100 font-pregular text-lg ml-2">
            {dislikes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-row items-center">
          <FontAwesome name="comment" size={18} color="#FFFFFF" />
          <Text className="text-secondary-100 font-pregular text-lg ml-2">
            {comments}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostCard;
