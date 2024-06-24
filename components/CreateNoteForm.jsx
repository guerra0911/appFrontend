import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  Alert,
  ScrollView,
} from "react-native";

import api from "../api";

import CustomButton from "./CustomButton";
import FormField from "./FormField";
import { useGlobalContext } from "../context/GlobalProvider";

const CreateNoteForm = ({ setModalVisible }) => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    content: "",
  });

  const handleSubmit = async () => {
    if (form.content === "") {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      const res = await api.post("/api/notes/", {
        content: form.content,
      });
      // Ensure the response is successful before navigating
      if (res.status === 200 || res.status === 201) {
        setModalVisible(false);  // Close the modal
        router.replace("/home");
      } else {
        // Handle unsuccessful registration
        Alert.alert("Upload Failed", res.message);
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      Alert.alert(
        "Error",
        "An error occurred while uploading your post. Try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">New Post</Text>

        <FormField
          value={form.content}
          placeholder="Tell the world your hottest take ..."
          handleChangeText={(e) => setForm({ ...form, content: e })}
          otherStyles="mt-0"
          height={200}
        />

        <CustomButton
          title="Post"
          handlePress={handleSubmit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateNoteForm;
