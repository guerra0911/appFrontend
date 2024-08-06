import React, { useState, useEffect } from "react";
import { View, Image, Alert, Button, ScrollView, TextInput, Text, Switch} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import api from "../api";
import { useGlobalContext } from "../context/GlobalProvider";
import CustomButton from "./CustomButton";
import FormField from "./FormField";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const EditProfileForm = ({ setModalVisible }) => {
  const { user, setUser } = useGlobalContext();
  const [image, setImage] = useState(user.profile.image);
  const [uploading, setUploading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [birthday, setBirthday] = useState(new Date(user.profile.birthday));
  const [formData, setFormData] = useState({
    username: user.username,
    bio: user.profile.bio,
    location: user.profile.location,
    birthday: user.profile.birthday,
    spotify_url: user.profile.spotify_url,
    imdb_url: user.profile.imdb_url,
    website_url: user.profile.website_url,
    privacy_flag: user.profile.privacy_flag,
    notification_flag: user.profile.notification_flag,
    email: user.profile.email,
    auto_accept_challenges: user.profile.auto_accept_challenges,
  });

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setBirthday(date);
    setFormData({ ...formData, birthday: date.toISOString().split('T')[0] });
    hideDatePicker();
  };

  const handleSubmit = async () => {
    setUploading(true);
    const changedData = {};

    Object.keys(formData).forEach(key => {
      if (formData[key] !== user[key] && formData[key] !== user.profile[key]) {
        changedData[key] = formData[key];
      }
    });

    if (image !== user.profile.image) {
      changedData.image = {
        uri: image,
        name: `profile_${user.id}.jpg`,
        type: "image/jpeg",
      };
    }

    const requestData = new FormData();
    for (const key in changedData) {
      requestData.append(key, changedData[key]);
    }

    try {
      const response = await api.put("/api/user/me/update/", requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Profile updated successfully!");
      setUser(response.data);
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
    <KeyboardAwareScrollView extraScrollHeight={100} contentContainerStyle={{ paddingBottom: 20 }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

      <FormField
        title="Username"
        value={formData.username}
        placeholder="Enter your username"
        handleChangeText={(value) => handleInputChange('username', value)}
      />
      <FormField
        title="Bio"
        value={formData.bio}
        placeholder="Enter your bio"
        handleChangeText={(value) => handleInputChange('bio', value)}
        multiline
      />
      <FormField
        title="Spotify URL"
        value={formData.spotify_url}
        placeholder="Enter your Spotify URL"
        handleChangeText={(value) => handleInputChange('spotify_url', value)}
        isURL
      />
      <FormField
        title="IMDb URL"
        value={formData.imdb_url}
        placeholder="Enter your IMDb URL"
        handleChangeText={(value) => handleInputChange('imdb_url', value)}
        isURL
      />
      <FormField
        title="Email"
        value={formData.email}
        placeholder="Enter your email"
        handleChangeText={(value) => handleInputChange('email', value)}
      />
      
      <View>
        <Text>Birthday</Text>
        <Button title={birthday.toDateString()} onPress={showDatePicker} />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          date={birthday}
        />
      </View>

      <Text>Location</Text>
      <TextInput
        value={formData.location}
        placeholder="Enter your location"
        onChangeText={(value) => handleInputChange('location', value)}
      />
      <Text>Website URL</Text>
      <TextInput
        value={formData.website_url}
        placeholder="Enter your website URL"
        onChangeText={(value) => handleInputChange('website_url', value)}
      />
      <Text>Privacy</Text>
      <Switch
        value={formData.privacy_flag}
        onValueChange={(value) => handleInputChange('privacy_flag', value)}
      />
      <Text>Notifications</Text>
      <Switch
        value={formData.notification_flag}
        onValueChange={(value) => handleInputChange('notification_flag', value)}
      />
      <Text>Auto Accept Challenges</Text>
      <Switch
        value={formData.auto_accept_challenges}
        onValueChange={(value) => handleInputChange('auto_accept_challenges', value)}
      />
      <CustomButton
        title="Submit"
        handlePress={handleSubmit}
        containerStyles="mt-4"
        isLoading={uploading}
      />
    </KeyboardAwareScrollView>
  );
};

export default EditProfileForm;
