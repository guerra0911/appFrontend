// RenderModal.jsx
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <AntDesign name="closecircle" size={24} color="#80FFDB" />
          </TouchableOpacity>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    height: "87%",
    backgroundColor: "#5E60CE",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    // Add additional styling as needed
  },
  modalText: {
    fontFamily: "pmedium",
    color: "#D0D0D0", // gray.100 from tailwind.config.js
    // Add additional styling as needed
  },
  // ... other styles
});

export default RenderModal;
