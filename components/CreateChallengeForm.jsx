import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  Alert,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import api from "../api";
import CustomButton from "./CustomButton";
import NoteFormField from "./NoteFormField";
import { useGlobalContext } from "../context/GlobalProvider";

const CreateChallengeForm = ({ setModalVisible, originalNoteId }) => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    content: "",
  });
  const [images, setImages] = useState([null, null, null]);

  const pickImage = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const updatedImages = [...images];
      updatedImages[index] = result.assets[0].uri;
      setImages(updatedImages);
    }
  };

  const handleSubmit = async () => {
    if (form.content === "") {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("content", form.content);
      formData.append("is_challenger", true);
      images.forEach((imageUri, index) => {
        if (imageUri) {
          formData.append(`images`, {
            uri: imageUri,
            name: `image${index + 1}.jpg`,
            type: "image/jpeg",
          });
        }
      });

      // First create the challenger note
      const noteRes = await api.post("/api/notes/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (noteRes.status === 200 || noteRes.status === 201) {
        const challengerNoteId = noteRes.data.id;

        // Then create the challenge linking it to the original note
        const challengeRes = await api.post("/api/challenges/create/", {
          original_note: originalNoteId,
          challenger_note: challengerNoteId,
        });

        if (challengeRes.status === 200 || challengeRes.status === 201) {
          setModalVisible(false);
          router.replace("/home");
        } else {
          Alert.alert("Challenge Creation Failed", challengeRes.data.message || "Error creating challenge");
        }
      } else {
        Alert.alert("Note Creation Failed", noteRes.data.message || "Error creating note");
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
        <Text style={styles.title}>New Challenge</Text>

        <NoteFormField
          value={form.content}
          placeholder="Counter the original note..."
          handleChangeText={(e) => setForm({ ...form, content: e })}
          otherStyles={styles.NoteformField}
          height={200}
          multiline={true}
        />

        <View style={styles.imagePickerContainer}>
          {images.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => pickImage(index)} style={styles.imagePicker}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <Text style={styles.placeholderText}>+</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <CustomButton
          title="Challenge"
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
  NoteformField: {
    marginTop: 0,
  },
  buttonContainer: {
    marginTop: 28,
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  imagePicker: {
    width: 100,
    height: 100,
    backgroundColor: '#DCDCDC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    fontSize: 32,
    color: '#888',
  },
});

export default CreateChallengeForm;
