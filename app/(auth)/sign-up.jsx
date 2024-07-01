import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Alert, Image, Dimensions, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { apiWithoutAuth as api } from "../../api";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9._]{1,25}$/;
    return regex.test(username);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*\d).{6,}$/;
    return regex.test(password);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (!validateUsername(username)) {
      Alert.alert(
        "Error",
        "Username must be between 1 and 25 characters and can only contain letters, numbers, periods, and underscores."
      );
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert(
        "Error",
        "Password must be at least 6 characters long and contain at least one number."
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Invalid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/api/user/register/", {
        username: username.trim(),
        password: password.trim(),
        confirm_password: confirmPassword.trim(),
        profile: {
          email: email.trim(),
        },
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        extraScrollHeight={100} // Adjust this value as needed
        contentContainerStyle={styles.scrollViewContent}
      >
        <View
          style={styles.container}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            style={styles.logo}
          />

          <Text style={styles.title}>
            Sign Up to Stinky
          </Text>

          <FormField
            title="Username"
            value={username}
            handleChangeText={(e) => setUsername(e)}
            otherStyles={styles.formField}
            multiline={false}
          />

          <FormField
            title="Email"
            value={email}
            handleChangeText={(e) => setEmail(e)}
            otherStyles={styles.formField}
            multiline={false}
          />

          <FormField
            title="Password"
            value={password}
            handleChangeText={(e) => setPassword(e)}
            otherStyles={styles.formField}
            multiline={false}
          />

          <FormField
            title="Confirm Password"
            value={confirmPassword}
            handleChangeText={(e) => setConfirmPassword(e)}
            otherStyles={styles.formField}
            multiline={false}
          />

          <CustomButton
            title="Sign Up"
            handlePress={handleSubmit}
            containerStyles={styles.button}
            isLoading={isLoading}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              style={styles.loginLink}
            >
              Login
            </Link>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F5F5F5',
    height: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    minHeight: Dimensions.get("window").height - 100,
  },
  logo: {
    width: 115,
    height: 34,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    textAlign: 'left',
    marginTop: 40,
  },
  formField: {
    marginTop: 16,
  },
  button: {
    marginTop: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 5,
  },
  loginText: {
    fontSize: 18,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
  loginLink: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007EFF',
    marginLeft: 4,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default SignUp;
