import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../api"; // Ensure the correct path to your api.js

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (route.params?.initialQuery) {
      setQuery(route.params.initialQuery);
      searchUsers(route.params.initialQuery);
    }
    // Focus the TextInput on mount
    Keyboard.addListener("keyboardDidShow", () => {
      this.textInputRef?.focus();
    });
  }, [route.params?.initialQuery]);

  const searchUsers = async (text) => {
    setQuery(text);
    if (text.length > 0) {
      try {
        const response = await api.get(`/api/user/search/?q=${text}`);
        setResults(response.data);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    } else {
      setResults([]);
    }
  };

  const navigateToProfile = (userId) => {
    navigation.navigate("otherProfile", { userId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={24} color="#69C3FF" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={20} color="#69C3FF" />
          <TextInput
            ref={(ref) => {
              this.textInputRef = ref;
            }}
            style={styles.input}
            placeholder="Search..."
            placeholderTextColor="#DCDCDC"
            value={query}
            onChangeText={searchUsers}
            autoFocus={true}
          />
        </View>
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToProfile(item.id)}>
            <View style={styles.userContainer}>
              <Image
                source={{ uri: item.profile.image }}
                style={styles.userImage}
              />
              <Text style={styles.userName}>@{item.username}</Text>
            </View>
            <View style={styles.separator} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 55,
  },
  backButton: {
    padding: 10,
    paddingRight: 15,
  },
  searchContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DCDCDC",
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#F5F5F5",
    padding: 10,
    flex: 1,
    marginHorizontal: 10,
},
input: {
    flex: 1,
    marginLeft: 10,
    color: "black",
},
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginVertical: 5,
  },
  userImage: {
    borderWidth: 2,
    borderColor: "#69C3FF",
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#DCDCDC",
    marginVertical: 1,
    marginHorizontal: 13,
  },
});

export default SearchPage;