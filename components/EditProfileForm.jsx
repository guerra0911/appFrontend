// EditProfileForm.jsx
import React, { useState, useEffect } from "react";
import { View, Image, Alert, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../api";
import { useGlobalContext } from "../context/GlobalProvider";

import CustomButton from "./CustomButton";
import FormField from "./FormField";

const EditProfileForm = ({ setModalVisible }) => {
  const [username, setUsername] = useState("");
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(null);
  const { user, setUser } = useGlobalContext();

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Image Picker Result: ", result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
      console.log("Selected image URI: ", selectedImageUri);
    }
  };

  const handleSubmit = async () => {
    setUploading(true);

    try {
      const formData = new FormData();
      if (username.trim()) {
        formData.append("username", username);
      }
      if (image) {
        const userId = user.id;
        const timestamp = new Date().getTime();
        const uniqueImageName = `profile_${userId}.jpg`;
        formData.append("profile.image", {
          uri: image,
          name: uniqueImageName,
          type: "image/jpeg",
        });
        console.log("FormData: ", formData);
      }

      const response = await api.put("/api/user/me/update/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update global user state
      setUser(response.data);

      Alert.alert("Profile updated successfully!");
      setModalVisible(false);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      Alert.alert("Error updating profile. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <FormField
        value={username}
        placeholder="Username"
        handleChangeText={setUsername}
        otherStyles="mt-0"
        multiline={false}
      />
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <CustomButton
        title="Submit"
        handlePress={handleSubmit}
        containerStyles="mt-4"
        isLoading={uploading}
      />
    </View>
  );
};

export default EditProfileForm;
