import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, Text, View } from "react-native";
import api from "../../api";

import { images } from "../../constants";
import { PostList, SearchInput } from "../../components";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllPosts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/notes/all/');
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  

  return (
    <SafeAreaView className="bg-primary">
      <FlatList
        ListHeaderComponent={() => (
          <View className="flex mt-2 mb-0 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  Nicholas Guerra
                </Text>
              </View>
              {/* <SearchInput /> */}
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            
          </View>
        )}
      />
      <PostList posts={posts} setPosts={setPosts} />
    </SafeAreaView>
  );
};

export default Home;
