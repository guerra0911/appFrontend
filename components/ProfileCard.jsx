import React from "react";
import { View, Text, Image } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

const ProfileCard = ({image, username, posts, followers, following, rating, button }) => {
  return (
    <View className="w-full bg-black-200 rounded-xl p-6 flex items-center">
      {/* Profile Picture */}
      <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-secondary mb-4">
      <Image
          source={{ uri: image }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      {/* Username */}
      <Text className="text-white font-pbold text-2xl mb-1">@{username}</Text>
      {/* Rating */}
      <View className="flex flex-row items-center mb-4">
        <Text className="text-secondary-100 font-pregular text-lg ml-1">Rating: {rating}</Text>
        <FontAwesome name="star" size={18} color="#FFD700" />
      </View>
      {/* Posts, Followers, Following */}
      <View className="w-full flex flex-row justify-around mt-4">
        <View className="flex items-center">
          <Text className="text-white font-psemibold text-lg">{posts}</Text>
          <Text className="text-gray-100 font-pregular text-lg">Posts</Text>
        </View>
        <View className="flex items-center">
          <Text className="text-white font-psemibold text-lg">{followers}</Text>
          <Text className="text-gray-100 font-pregular text-lg">Followers</Text>
        </View>
        <View className="flex items-center">
          <Text className="text-white font-psemibold text-lg">{following}</Text>
          <Text className="text-gray-100 font-pregular text-lg">Following</Text>
        </View>
      </View>
      <View className="w-full mt-4">
          {button}
        </View>
    </View>
  );
};

export default ProfileCard;
