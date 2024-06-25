// _layout.jsx
import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import { icons } from "../../constants";
import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useNavigation } from "@react-navigation/native";

import React, { useState } from "react";
import RenderModal from "./renderModal";
import { CircularButton } from "../../components";
import { CreateNoteForm } from "../../components";

const TabIcon = ({ icon, children, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2">
      {icon ? (
        <Image
          source={icon}
          resizeMode="contain"
          style={{ tintColor: color, width: 24, height: 24 }}
        />
      ) : (
        children
      )}
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  const { user, loading, isLogged } = useGlobalContext();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const navigateToProfile = () => {
    navigation.navigate("profile", { userId: user.id });
  };

   // Log the user object and profile picture URL for debugging
  //  console.log('User:', user);
  //  console.log('Profile Picture URL:', user?.profile?.image);

  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001", // Color for active tab icon and label
          tabBarInactiveTintColor: "#CDCDE0", // Color for inactive tab icon and label
          tabBarShowLabel: false, // Hide labels to only show icons
          tabBarStyle: {
            backgroundColor: "#161622", // Background color of the tab bar
            borderTopWidth: 1, // Width of the top border line
            borderTopColor: "#232533", // Color of the top border line
            height: 90, // Height of the tab bar
            paddingTop: 10, // **Add top padding here**
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="picks"
          options={{
            title: "Picks",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.fireTrophy}
                color={color}
                name="Picks"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="renderModal"
          options={{
            tabBarButton: () => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => setModalVisible(true)}
              >
                <CircularButton />
              </TouchableOpacity>
            ),
          }}
        />

        <Tabs.Screen
          name="tournament"
          options={{
            title: "Tournament",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon color={color} name="Tournament" focused={focused}>
                <MaterialCommunityIcons
                  name="tournament"
                  size={24}
                  color={color}
                />
              </TabIcon>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon color={color} name="Profile" focused={focused}>
                {user?.profile?.image ? (
                  <Image
                    source={{ uri: user.profile.image }}
                    style={{ width: 24, height: 24, borderRadius: 12 }}
                  />
                ) : (
                  <Ionicons name="person" size={24} color={color} />
                )}
              </TabIcon>
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={navigateToProfile} />
            ),
          }}
        />
      </Tabs>

      <RenderModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      >
        <CreateNoteForm setModalVisible={setModalVisible} />
      </RenderModal>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default TabLayout;
