// CreateTournamentForm.jsx
import React, { useState } from "react";
import { View, Image, Alert, Button, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../api";
import { useGlobalContext } from "../context/GlobalProvider";

import CustomButton from "./CustomButton";
import FormField from "./FormField";

const CreateTournamentForm = ({ setModalVisible }) => {
  const [name, setName] = useState("");
  const [banner, setBanner] = useState(null);
  const [logo, setLogo] = useState(null);
  const [points, setPoints] = useState(["", "", "", ""]);
  const [bonus, setBonus] = useState("");
  const [winnerReward, setWinnerReward] = useState("");
  const [loserForfeit, setLoserForfeit] = useState("");
  const [teams, setTeams] = useState(Array(16).fill({ name: "", logo: null }));
  const [uploading, setUploading] = useState(false);
  const { user } = useGlobalContext();

  const pickImage = async (setImage) => {
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

  const handleTeamNameChange = (index, name) => {
    const updatedTeams = [...teams];
    updatedTeams[index] = { ...updatedTeams[index], name };
    setTeams(updatedTeams);
  };

  const handleTeamLogoChange = async (index) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      const updatedTeams = [...teams];
      updatedTeams[index] = { ...updatedTeams[index], logo: selectedImageUri };
      setTeams(updatedTeams);
    }
  };

  const handleSubmit = async () => {
    setUploading(true);
  
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("point_system", JSON.stringify(points));
      formData.append("correct_score_bonus", bonus);
      formData.append("winner_reward", winnerReward);
      formData.append("loser_forfeit", loserForfeit);
  
      if (banner) {
        formData.append("banner", {
          uri: banner,
          name: `banner.jpg`,
          type: "image/jpeg",
        });
      }
  
      if (logo) {
        formData.append("logo", {
          uri: logo,
          name: `logo.jpg`,
          type: "image/jpeg",
        });
      }
  
      teams.forEach((team, index) => {
        formData.append(`teams[${index}][name]`, team.name);
        if (team.logo) {
          formData.append(`teams[${index}][logo]`, {
            uri: team.logo,
            name: `team${index + 1}.jpg`,
            type: "image/jpeg",
          });
        }
      });
  
      const response = await api.post("/api/tournaments/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      Alert.alert("Tournament created successfully!");
      setModalVisible(false);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      Alert.alert("Error creating tournament. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <ScrollView style={{ padding: 20 }}>
      <FormField
        value={name}
        placeholder="Tournament Name"
        handleChangeText={setName}
        otherStyles="mt-0"
        multiline={false}
      />
      <Button title="Upload Banner Image" onPress={() => pickImage(setBanner)} />
      {banner && (
        <Image source={{ uri: banner }} style={{ width: 200, height: 200 }} />
      )}
      <Button title="Upload Logo Image" onPress={() => pickImage(setLogo)} />
      {logo && (
        <Image source={{ uri: logo }} style={{ width: 200, height: 200 }} />
      )}
      {points.map((point, index) => (
        <FormField
          key={index}
          value={point}
          placeholder={`Points for Round ${index + 1}`}
          handleChangeText={(text) => {
            const updatedPoints = [...points];
            updatedPoints[index] = text;
            setPoints(updatedPoints);
          }}
          otherStyles="mt-0"
          keyboardType="numeric"
          multiline={false}
        />
      ))}
      <FormField
        value={bonus}
        placeholder="Bonus Points for Correct Score"
        handleChangeText={setBonus}
        otherStyles="mt-0"
        keyboardType="numeric"
        multiline={false}
      />
      <FormField
        value={winnerReward}
        placeholder="Winner Reward"
        handleChangeText={setWinnerReward}
        otherStyles="mt-0"
        multiline={true}
      />
      <FormField
        value={loserForfeit}
        placeholder="Loser Forfeit"
        handleChangeText={setLoserForfeit}
        otherStyles="mt-0"
        multiline={true}
      />
      {teams.map((team, index) => (
        <View key={index} style={{ marginBottom: 20 }}>
          <FormField
            value={team.name}
            placeholder={`Team ${index + 1} Name`}
            handleChangeText={(text) => handleTeamNameChange(index, text)}
            otherStyles="mt-0"
            multiline={false}
          />
          <Button
            title={`Upload Team ${index + 1} Logo`}
            onPress={() => handleTeamLogoChange(index)}
          />
          {team.logo && (
            <Image source={{ uri: team.logo }} style={{ width: 100, height: 100 }} />
          )}
        </View>
      ))}
      <CustomButton
        title="Submit"
        handlePress={handleSubmit}
        containerStyles="mt-4"
        isLoading={uploading}
      />
    </ScrollView>
  );
};

export default CreateTournamentForm;
