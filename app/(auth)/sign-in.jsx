import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform } from "react-native";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  Keyboard,
} from "react-native";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import api from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setIsLogged, checkCurrentUser } = useGlobalContext();

  // SignIn Component
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/api/token/", { username, password });
      if (res.status === 200) {
        await AsyncStorage.setItem("authToken", res.data.access);
        api.setAuthToken(res.data.access);
        await checkCurrentUser();
        setIsLogged(true);
        router.replace("/home");
      } else {
        // Handle unsuccessful login
        Alert.alert("Login Failed", res.message);
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      Alert.alert("Error", "An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View
            className="w-full flex justify-center h-full px-4 my-0"
            style={{
              minHeight: Dimensions.get("window").height - 100,
            }}
          >
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[115px] h-[34px]"
            />

            <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
              Log in to Stinky
            </Text>

            <FormField
              title="Username"
              value={username}
              handleChangeText={(e) => setUsername(e)}
              otherStyles="mt-7"
            />

            <FormField
              title="Password"
              value={password}
              handleChangeText={(e) => setPassword(e)}
              otherStyles="mt-7"
            />

            <CustomButton
              title="Sign In"
              handlePress={handleSubmit}
              containerStyles="mt-7"
              isLoading={isLoading}
            />

            <View className="flex justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Don't have an account?
              </Text>
              <Link
                href="/sign-up"
                className="text-lg font-psemibold text-secondary"
              >
                Signup
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
