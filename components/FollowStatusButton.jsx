import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import RenderModal from "../app/(tabs)/renderModal";
import { useNavigation } from "@react-navigation/native";
import useFollowBlockActions from "../hooks/useFollowBlockActions";
import StatusActionButton from "./StatusActionButton";

const FollowStatusButton = ({ type }) => {
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const {
    requests,
    requesting,
    fetchRequests,
    fetchRequesting,
    acceptFollowRequest,
    declineFollowRequest,
  } = useFollowBlockActions();

  const openRequestsModal = () => {
    setModalTitle("Requests");
    fetchRequests();
    setRequestModalVisible(true);
  };

  const openRequestingModal = () => {
    setModalTitle("Requesting");
    fetchRequesting();
    setRequestModalVisible(true);
  };

  const navigateToProfile = (userId) => {
    setRequestModalVisible(false);
    navigation.navigate("otherProfile", { userId });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchRequests();
    fetchRequesting();
    setRefreshing(false);
  }, [requests, requesting]);

  return (
    <View>
      {type === "Requests" ? (
        <TouchableOpacity style={styles.button} onPress={openRequestsModal}>
          <Text style={styles.buttonText}>Follow Requests</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={openRequestingModal}>
          <Text style={styles.buttonText}>Requesting</Text>
        </TouchableOpacity>
      )}

      <RenderModal modalVisible={requestModalVisible} setModalVisible={setRequestModalVisible} refreshing={refreshing} onRefresh={onRefresh} modalTitle={modalTitle}  modalTitleStyle={styles.modalTitle}>
        <ScrollView>
          {(modalTitle === "Requests" ? requests : requesting).map((user, index, array) => (
            <View key={user.id}>
              <TouchableOpacity onPress={() => navigateToProfile(user.id)}>
                <View style={styles.userContainer}>
                  <Image source={{ uri: user.profile.image }} style={styles.userImage} />
                  <Text style={styles.userName}>@{user.username}</Text>
                  {modalTitle === "Requests" && (
                    <View style={styles.actionButtons}>
                      <StatusActionButton
                        text="✓"
                        color="#4CAF50"
                        onPress={() => acceptFollowRequest(user.id)}
                      />
                      <StatusActionButton
                        text="✗"
                        color="#F44336"
                        onPress={() => declineFollowRequest(user.id)}
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              {index < array.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
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
  actionButtons: {
    flexDirection: "row",
    marginLeft: "auto",
    marginBottom: 10,
  },
});

export default FollowStatusButton;
