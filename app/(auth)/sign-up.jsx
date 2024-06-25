import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { apiWithoutAuth as api } from "../../api";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9._]{1,25}$/;
    return regex.test(username);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*\d).{6,}$/;
    return regex.test(password);
  };

  const handleSubmit = async () => {
    if (!validateUsername(username)) {
      Alert.alert("Error", "Username must be between 1 and 25 characters and can only contain letters, numbers, periods, and underscores.");
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert("Error", "Password must be at least 6 characters long and contain at least one number.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/api/user/register/", {
        username: username.trim(),
        password: password.trim(),
        confirm_password: confirmPassword.trim(),
      });

      if (res.status === 200 || res.status === 201) {
        Alert.alert("Registration Success", res.message);
        router.replace("/sign-in");
      } else {
        Alert.alert("Registration Failed", res.message);
      }
    } catch (error) {
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
              Sign Up to Stinky
            </Text>

            <FormField
              title="Username"
              value={username}
              handleChangeText={(e) => setUsername(e)}
              otherStyles="mt-7"
              multiline={false} 
            />

            <FormField
              title="Password"
              value={password}
              handleChangeText={(e) => setPassword(e)}
              otherStyles="mt-7"
              multiline={false} 
            />

            <FormField
              title="Confirm Password" 
              value={confirmPassword}
              handleChangeText={(e) => setConfirmPassword(e)}
              otherStyles="mt-7"
              multiline={false} 
            />

            <CustomButton
              title="Sign Up"
              handlePress={handleSubmit}
              containerStyles="mt-7"
              isLoading={isLoading}
            />

            <View className="flex justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Have an account already?
              </Text>
              <Link
                href="/sign-in"
                className="text-lg font-psemibold text-secondary"
              >
                Login
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;