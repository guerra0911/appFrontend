import React from "react";
import { Modal, View, TouchableOpacity, StyleSheet, PanResponder, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const RenderModal = ({ modalVisible, setModalVisible, children }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <AntDesign name="downcircle" size={24} color="#69C3FF" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: "100%",
    height: "87%",
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  modalText: {
    fontFamily: "pmedium",
    color: "black",
  },
  // ... other styles
});

export default RenderModal;
