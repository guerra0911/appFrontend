import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import RenderModal from "../app/(tabs)/renderModal";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import useFollowBlockActions from "../hooks/useFollowBlockActions";

const BlockingStatusButton = ({ type }) => {
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const { blockedBy, blocking, fetchBlockedBy, fetchBlocking } =
    useFollowBlockActions();

  const openBlockedByModal = () => {
    setModalTitle("Blocked By");
    fetchBlockedBy();
    setBlockModalVisible(true);
  };

  const openBlockingModal = () => {
    setModalTitle("Blocking");
    fetchBlocking();
    setBlockModalVisible(true);
  };

  const navigateToProfile = (userId) => {
    setBlockModalVisible(false);
    navigation.navigate("otherProfile", { userId });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchBlockedBy();
    fetchBlocking();
    setRefreshing(false);
  }, [blockedBy, blocking]);

  return (
    <View>
      {type === "Blocked By" ? (
        <TouchableOpacity style={styles.button} onPress={openBlockedByModal}>
          <Text style={styles.buttonText}>Blocked By</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={openBlockingModal}>
          <Text style={styles.buttonText}>Blocking</Text>
        </TouchableOpacity>
      )}

      <RenderModal
        modalVisible={blockModalVisible}
        setModalVisible={setBlockModalVisible}
        refreshing={refreshing}
        onRefresh={onRefresh}
        modalTitle={modalTitle}
        modalTitleStyle={styles.modalTitle}
      >
        <ScrollView>
          {(modalTitle === "Blocked By" ? blockedBy : blocking).map(
            (user, index, array) => (
              <View key={user.id}>
                <TouchableOpacity onPress={() => navigateToProfile(user.id)}>
                  <View style={styles.userContainer}>
                    <Image
                      source={{ uri: user.profile.image }}
                      style={styles.userImage}
                    />
                    <Text style={styles.userName}>@{user.username}</Text>
                  </View>
                </TouchableOpacity>
                {index < array.length - 1 && <View style={styles.separator} />}
              </View>
            )
          )}
        </ScrollView>
      </RenderModal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 13,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    borderColor: "#DCDCDC",
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

export default BlockingStatusButton;
