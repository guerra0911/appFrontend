import React, { useState, useEffect } from "react";
import { View, Image, Alert, Button, Switch, Text, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import api from "../api";
import { useGlobalContext } from "../context/GlobalProvider";
import CustomButton from "./CustomButton";
import FormField from "./FormField";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const isValidURL = (url) => {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(url);
};

const EditProfileForm = ({ setModalVisible }) => {
  const { user, setUser } = useGlobalContext();
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.profile.bio || "");
  const [birthday, setBirthday] = useState(new Date(user.profile.birthday) || new Date());
  const [formattedBirthday, setFormattedBirthday] = useState(birthday.toDateString());
  const [spotifyUrl, setSpotifyUrl] = useState(user.profile.spotify_url || "");
  const [imdbUrl, setImdbUrl] = useState(user.profile.imdb_url || "");
  const [websiteUrl, setWebsiteUrl] = useState(user.profile.website_url || "");
  const [email, setEmail] = useState(user.profile.email || "");
  const [privacyFlag, setPrivacyFlag] = useState(user.profile.privacy_flag);
  const [notificationFlag, setNotificationFlag] = useState(user.profile.notification_flag);
  const [image, setImage] = useState(user.profile.image || null);
  const [uploading, setUploading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Initial state to compare later
  const initialState = {
    username: user.username,
    bio: user.profile.bio,
    birthday: user.profile.birthday,
    spotify_url: user.profile.spotify_url,
    imdb_url: user.profile.imdb_url,
    website_url: user.profile.website_url,
    email: user.profile.email,
    privacy_flag: user.profile.privacy_flag,
    notification_flag: user.profile.notification_flag,
    image: user.profile.image,
  };

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

  const handleSubmit = async () => {
    setUploading(true);
    const formData = new FormData();

    // Check for changes and add only changed fields to formData
    if (username.trim() && username !== initialState.username) {
      formData.append("username", username);
    }
    if (bio.trim() && bio !== initialState.bio) {
      formData.append("profile.bio", bio);
    }
    if (birthday && birthday.toISOString().split('T')[0] !== initialState.birthday) {
      formData.append("profile.birthday", birthday.toISOString().split('T')[0]);
    }
    if (spotifyUrl.trim() && spotifyUrl !== initialState.spotify_url) {
      if (!isValidURL(spotifyUrl)) {
        Alert.alert("Invalid Spotify URL.");
        setUploading(false);
        return;
      }
      formData.append("profile.spotify_url", spotifyUrl);
    }
    if (imdbUrl.trim() && imdbUrl !== initialState.imdb_url) {
      if (!isValidURL(imdbUrl)) {
        Alert.alert("Invalid IMDb URL.");
        setUploading(false);
        return;
      }
      formData.append("profile.imdb_url", imdbUrl);
    }
    if (websiteUrl.trim() && websiteUrl !== initialState.website_url) {
      if (!isValidURL(websiteUrl)) {
        Alert.alert("Invalid Website URL.");
        setUploading(false);
        return;
      }
      formData.append("profile.website_url", websiteUrl);
    }
    if (email.trim() && email !== initialState.email) {
      formData.append("profile.email", email);
    }
    if (privacyFlag !== initialState.privacy_flag) {
      formData.append("profile.privacy_flag", privacyFlag);
    }
    if (notificationFlag !== initialState.notification_flag) {
      formData.append("profile.notification_flag", notificationFlag);
    }
    if (image && image !== initialState.image) {
      const userId = user.id;
      const timestamp = new Date().getTime();
      const uniqueImageName = `profile_${userId}.jpg`;
      formData.append("profile.image", {
        uri: image,
        name: uniqueImageName,
        type: "image/jpeg",
      });
    }

    try {
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
    <KeyboardAwareScrollView
      extraScrollHeight={100} // Adjust this value as needed
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <FormField
        value={username}
        placeholder="Username"
        handleChangeText={setUsername}
        otherStyles="mt-0"
        multiline={false}
      />
      <FormField
        value={bio}
        placeholder="Bio"
        handleChangeText={setBio}
        otherStyles="mt-2"
        multiline={true}
      />
      <FormField
        value={email}
        placeholder="Email"
        handleChangeText={setEmail}
        otherStyles="mt-2"
        multiline={false}
      />
      <Button title="Pick Birthday" onPress={() => setShowDatePicker(true)} />
      <Text>Selected Birthday: {formattedBirthday}</Text>
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        date={birthday}
        onConfirm={(date) => {
          setBirthday(date);
          setFormattedBirthday(date.toDateString());
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
      <FormField
        value={spotifyUrl}
        placeholder="Spotify URL"
        handleChangeText={setSpotifyUrl}
        otherStyles="mt-2"
        multiline={false}
      />
      <FormField
        value={imdbUrl}
        placeholder="IMDb URL"
        handleChangeText={setImdbUrl}
        otherStyles="mt-2"
        multiline={false}
      />
      <FormField
        value={websiteUrl}
        placeholder="Website URL"
        handleChangeText={setWebsiteUrl}
        otherStyles="mt-2"
        multiline={false}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 }}>
        <Text>Private Account</Text>
        <Switch
          value={privacyFlag}
          onValueChange={setPrivacyFlag}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 }}>
        <Text>Enable Notifications</Text>
        <Switch
          value={notificationFlag}
          onValueChange={setNotificationFlag}
        />
      </View>
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
    </KeyboardAwareScrollView>
  );
};

export default EditProfileForm;
