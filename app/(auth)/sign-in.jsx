import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform } from "react-native";
import { View, Text, ScrollView, Dimensions, Alert, Image, StyleSheet } from "react-native";

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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView>
          <View style={styles.mainView}>
            <Image
              source={images.logo}
              resizeMode="contain"
              style={styles.logo}
            />

            <Text style={styles.title}>
              Log in to Stinky
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

            <CustomButton
              title="Sign In"
              handlePress={handleSubmit}
              containerStyles="mt-7"
              isLoading={isLoading}
            />

<View style={styles.signupContainer}>
  <Text style={styles.signupText}>
    Don't have an account?
  </Text>
  <Link
    href="/sign-up"
    style={styles.signupLink}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'primary', // Replace 'primary' with the actual color value
    height: '100%',
  },
  keyboardView: {
    flex: 1,
  },
  mainView: {
    width: '100%',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 24,
    marginVertical: 0,
    minHeight: Dimensions.get("window").height - 100,
  },
  logo: {
    width: 115,
    height: 34,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black', // Replace 'black' with the actual color value
    marginTop: 40,
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold', // Replace 'Poppins-SemiBold' with the actual font family
  },
  signupContainer: {
    justifyContent: 'center',
    paddingTop: 5,
    flexDirection: 'row',
    gap: 2,
  },
  signupText: {
    fontSize: 18,
    color: 'black', // Replace with the actual color value for the text
    fontFamily: 'Poppins-Regular', // Replace with the actual font family
    marginRight: 10,
  },
  signupLink: {
    fontSize: 18,
    fontWeight: '600',
    color: '#69C3FF', // New color for the 'Signup' link
    fontFamily: 'Poppins-SemiBold', // Replace with the actual font family
  },
});

export default SignIn;
