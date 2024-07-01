import React, { useState } from "react";
import { View, Image, Alert, ScrollView, TouchableOpacity, Text, StyleSheet, TextInput } from "react-native";
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
  const [teamSize, setTeamSize] = useState(16);
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

  const handleTeamSizeChange = (size) => {
    setTeamSize(size);
    setTeams(Array(size).fill({ name: "", logo: null }));
  };

  const handleSubmit = async () => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("author", user.id);
      formData.append("name", name);
      formData.append("point_system", JSON.stringify(points));
      formData.append("correct_score_bonus", bonus);
      formData.append("winner_reward", winnerReward);
      formData.append("loser_forfeit", loserForfeit);
      formData.append("team_size", teamSize);

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
    <ScrollView style={styles.scrollView}>
      <View style={styles.tournamentCard}>
        <TouchableOpacity onPress={() => pickImage(setBanner)} style={styles.bannerPlaceholder}>
          {banner ? (
            <Image source={{ uri: banner }} style={styles.banner} />
          ) : (
            <Text style={styles.placeholderText}>+</Text>
          )}
        </TouchableOpacity>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => pickImage(setLogo)} style={styles.logoPlaceholder}>
            {logo ? (
              <Image source={{ uri: logo }} style={styles.logo} />
            ) : (
              <Text style={styles.placeholderText}>+</Text>
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.nameInput}
            value={name}
            placeholder="Tournament Name"
            placeholderTextColor="#DCDCDC"
            onChangeText={setName}
          />
        </View>
      </View>
      
      <View style={styles.teamSizeContainer}>
        <TouchableOpacity
          style={[styles.teamSizeButton, teamSize === 8 && styles.activeTeamSizeButton]}
          onPress={() => handleTeamSizeChange(8)}
        >
          <Text style={styles.teamSizeButtonText}>8 Teams</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.teamSizeButton, teamSize === 16 && styles.activeTeamSizeButton]}
          onPress={() => handleTeamSizeChange(16)}
        >
          <Text style={styles.teamSizeButtonText}>16 Teams</Text>
        </TouchableOpacity>
      </View>

      {teamSize === 16 && (
        <FormField
          value={points[0]}
          placeholder="Points for Round of 16"
          handleChangeText={(text) => {
            const updatedPoints = [...points];
            updatedPoints[0] = text;
            setPoints(updatedPoints);
          }}
          otherStyles={styles.formField}
          keyboardType="numeric"
          multiline={false}
        />
      )}
      <FormField
        value={points[teamSize === 16 ? 1 : 0]}
        placeholder="Points for Quarter Finals"
        handleChangeText={(text) => {
          const updatedPoints = [...points];
          updatedPoints[teamSize === 16 ? 1 : 0] = text;
          setPoints(updatedPoints);
        }}
        otherStyles={styles.formField}
        keyboardType="numeric"
        multiline={false}
      />
      <FormField
        value={points[teamSize === 16 ? 2 : 1]}
        placeholder="Points for Semi Finals"
        handleChangeText={(text) => {
          const updatedPoints = [...points];
          updatedPoints[teamSize === 16 ? 2 : 1] = text;
          setPoints(updatedPoints);
        }}
        otherStyles={styles.formField}
        keyboardType="numeric"
        multiline={false}
      />
      <FormField
        value={points[teamSize === 16 ? 3 : 2]}
        placeholder="Points for Finals"
        handleChangeText={(text) => {
          const updatedPoints = [...points];
          updatedPoints[teamSize === 16 ? 3 : 2] = text;
          setPoints(updatedPoints);
        }}
        otherStyles={styles.formField}
        keyboardType="numeric"
        multiline={false}
      />

      <FormField
        value={bonus}
        placeholder="Bonus Points for Correct Score"
        handleChangeText={setBonus}
        otherStyles={styles.formField}
        keyboardType="numeric"
        multiline={false}
      />
      <FormField
        value={winnerReward}
        placeholder="Winner Reward"
        handleChangeText={setWinnerReward}
        otherStyles={styles.formField}
        multiline={true}
      />
      <FormField
        value={loserForfeit}
        placeholder="Loser Forfeit"
        handleChangeText={setLoserForfeit}
        otherStyles={styles.formField}
        multiline={true}
      />

      <Text style={styles.bracketHeader}>Left Side of the Bracket</Text>
      {Array.from({ length: teamSize / 2 }).map((_, matchupIndex) => {
        if (teamSize === 16 && matchupIndex === 4) {
          return (
            <React.Fragment key={matchupIndex}>
              <Text style={styles.bracketHeader}>Right Side of the Bracket</Text>
              <View key={matchupIndex} style={styles.matchupContainer}>
                <Text style={styles.matchupText}>Matchup {matchupIndex + 1}</Text>
                <View style={styles.teamsContainer}>
                  <View style={styles.team}>
                    <TextInput
                      style={styles.teamNameInput}
                      value={teams[matchupIndex * 2].name}
                      placeholder={`Team ${matchupIndex * 2 + 1} Name`}
                      placeholderTextColor="#DCDCDC"
                      onChangeText={(text) => handleTeamNameChange(matchupIndex * 2, text)}
                    />
                    <TouchableOpacity onPress={() => handleTeamLogoChange(matchupIndex * 2)} style={styles.logoPlaceholder}>
                      {teams[matchupIndex * 2].logo ? (
                        <Image source={{ uri: teams[matchupIndex * 2].logo }} style={styles.logo} />
                      ) : (
                        <Text style={styles.placeholderText}>+</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.vsText}>vs.</Text>
                  <View style={styles.team}>
                    <TextInput
                      style={styles.teamNameInput}
                      value={teams[matchupIndex * 2 + 1].name}
                      placeholder={`Team ${matchupIndex * 2 + 2} Name`}
                      placeholderTextColor="#DCDCDC"
                      onChangeText={(text) => handleTeamNameChange(matchupIndex * 2 + 1, text)}
                    />
                    <TouchableOpacity onPress={() => handleTeamLogoChange(matchupIndex * 2 + 1)} style={styles.logoPlaceholder}>
                      {teams[matchupIndex * 2 + 1].logo ? (
                        <Image source={{ uri: teams[matchupIndex * 2 + 1].logo }} style={styles.logo} />
                      ) : (
                        <Text style={styles.placeholderText}>+</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </React.Fragment>
          );
        } else if (teamSize === 8 && matchupIndex === 2) {
          return (
            <React.Fragment key={matchupIndex}>
              <Text style={styles.bracketHeader}>Right Side of the Bracket</Text>
              <View key={matchupIndex} style={styles.matchupContainer}>
                <Text style={styles.matchupText}>Matchup {matchupIndex + 1}</Text>
                <View style={styles.teamsContainer}>
                  <View style={styles.team}>
                    <TextInput
                      style={styles.teamNameInput}
                      value={teams[matchupIndex * 2].name}
                      placeholder={`Team ${matchupIndex * 2 + 1} Name`}
                      placeholderTextColor="#DCDCDC"
                      onChangeText={(text) => handleTeamNameChange(matchupIndex * 2, text)}
                    />
                    <TouchableOpacity onPress={() => handleTeamLogoChange(matchupIndex * 2)} style={styles.logoPlaceholder}>
                      {teams[matchupIndex * 2].logo ? (
                        <Image source={{ uri: teams[matchupIndex * 2].logo }} style={styles.logo} />
                      ) : (
                        <Text style={styles.placeholderText}>+</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.vsText}>vs.</Text>
                  <View style={styles.team}>
                    <TextInput
                      style={styles.teamNameInput}
                      value={teams[matchupIndex * 2 + 1].name}
                      placeholder={`Team ${matchupIndex * 2 + 2} Name`}
                      placeholderTextColor="#DCDCDC"
                      onChangeText={(text) => handleTeamNameChange(matchupIndex * 2 + 1, text)}
                    />
                    <TouchableOpacity onPress={() => handleTeamLogoChange(matchupIndex * 2 + 1)} style={styles.logoPlaceholder}>
                      {teams[matchupIndex * 2 + 1].logo ? (
                        <Image source={{ uri: teams[matchupIndex * 2 + 1].logo }} style={styles.logo} />
                      ) : (
                        <Text style={styles.placeholderText}>+</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </React.Fragment>
          );
        }

        return (
          <View key={matchupIndex} style={styles.matchupContainer}>
            <Text style={styles.matchupText}>Matchup {matchupIndex + 1}</Text>
            <View style={styles.teamsContainer}>
              <View style={styles.team}>
                <TextInput
                  style={styles.teamNameInput}
                  value={teams[matchupIndex * 2].name}
                  placeholder={`Team ${matchupIndex * 2 + 1} Name`}
                  placeholderTextColor="#DCDCDC"
                  onChangeText={(text) => handleTeamNameChange(matchupIndex * 2, text)}
                />
                <TouchableOpacity onPress={() => handleTeamLogoChange(matchupIndex * 2)} style={styles.logoPlaceholder}>
                  {teams[matchupIndex * 2].logo ? (
                    <Image source={{ uri: teams[matchupIndex * 2].logo }} style={styles.logo} />
                  ) : (
                    <Text style={styles.placeholderText}>+</Text>
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.vsText}>vs.</Text>
              <View style={styles.team}>
                <TextInput
                  style={styles.teamNameInput}
                  value={teams[matchupIndex * 2 + 1].name}
                  placeholder={`Team ${matchupIndex * 2 + 2} Name`}
                  placeholderTextColor="#DCDCDC"
                  onChangeText={(text) => handleTeamNameChange(matchupIndex * 2 + 1, text)}
                />
                <TouchableOpacity onPress={() => handleTeamLogoChange(matchupIndex * 2 + 1)} style={styles.logoPlaceholder}>
                  {teams[matchupIndex * 2 + 1].logo ? (
                    <Image source={{ uri: teams[matchupIndex * 2 + 1].logo }} style={styles.logo} />
                  ) : (
                    <Text style={styles.placeholderText}>+</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
      <CustomButton
        title="Submit"
        handlePress={handleSubmit}
        containerStyles={styles.submitButton}
        isLoading={uploading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 20,
  },
  formField: {
    marginTop: 10,
  },
  tournamentCard: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  bannerPlaceholder: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
    marginRight: 15,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderText: {
    fontSize: 24,
    color: '#fff',
  },
  nameInput: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  teamSizeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  teamSizeButton: {
    backgroundColor: '#DCDCDC',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  activeTeamSizeButton: {
    backgroundColor: '#69C3FF',
  },
  teamSizeButtonText: {
    color: 'white',
  },
  bracketHeader: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    marginVertical: 20,
  },
  matchupContainer: {
    marginBottom: 20,
  },
  matchupText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  team: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  teamNameInput: {
    color: "black",
    marginBottom: 5,
    textAlign: "center",
    width: 100, // Adjust width as needed
  },
  vsText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default CreateTournamentForm;
