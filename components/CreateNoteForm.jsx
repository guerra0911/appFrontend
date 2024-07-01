import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  Alert,
  ScrollView,
  StyleSheet,
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>New Post</Text>

        <FormField
          value={form.content}
          placeholder="Tell the world your hottest take ..."
          handleChangeText={(e) => setForm({ ...form, content: e })}
          otherStyles={styles.formField}
          height={200}
          multiline={true}
        />

        <CustomButton
          title="Post"
          handlePress={handleSubmit}
          containerStyles={styles.buttonContainer}
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  title: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 0,
    marginLeft: 2,
  },
  formField: {
    marginTop: 0,
  },
  buttonContainer: {
    marginTop: 28,
  },
});

export default CreateNoteForm;
